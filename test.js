const assert = require('node:assert/strict');
const fs = require('node:fs');
process.env.ATLAS_ENABLE_EXPERIMENTAL_WRITES = '0';
const { COPY, parseIntervalConfig, chooseIntervalMs, formatCountdown } = require('./app');
const { parseKeyValues, achievementsFromSchema } = require('./steam-schema');
const { server, ENABLE_EXPERIMENTAL_WRITES } = require('./server');
const { getPublicCatalog } = require('./public-catalog');
const { validateIds, findNativeDll, authorizeUnlock } = require('./steam-native');
const { verifyUnlock } = require('./verify-unlock');
const { createActivityLog, safeEvent, classifyError } = require('./activity-log');
const os = require('node:os');
const path = require('node:path');

function str(value) { return Buffer.from(`${value}\0`, 'utf8'); }
function field(type, key, value) { return Buffer.concat([Buffer.from([type]), str(key), value]); }
function object(key, children) { return field(0, key, Buffer.concat([...children, Buffer.from([8])])); }
const display = object('display', [
  object('name', [field(1, 'brazilian', str('Conquista de teste'))]),
  object('desc', [field(1, 'english', str('Test description'))])
]);
const achievement = object('0', [field(1, 'name', str('ACH_TEST')), display]);
const bits = object('bits', [achievement]);
const stat = object('1', [bits]);
const stats = object('stats', [stat]);
const sample = Buffer.concat([object('123', [stats]), Buffer.from([8])]);
const catalog = achievementsFromSchema(parseKeyValues(sample), '123');
assert.deepEqual(catalog, [{ id: 'ACH_TEST', name: 'Conquista de teste', description: 'Test description', hidden: false }]);
assert.deepEqual(achievementsFromSchema({ '123': { stats: { '1': { bits: { '0': { name: '781', display: { name: { english: 1 }, desc: { english: 'Open level 1' } } } } } } } }, '123'), [{ id: '781', name: '1', description: 'Open level 1', hidden: false }]);
assert.deepEqual(validateIds(['ACH_ONE']), ['ACH_ONE']);
assert.throws(() => validateIds(['ACH_ONE', 'ACH_TWO']), /uma conquista/);
assert.throws(() => validateIds(['ACH\0BAD']), /inválido/);
assert.throws(() => findNativeDll('bad', () => []), /App ID/);
assert.throws(() => authorizeUnlock({ appid: '1086940', ids: ['ACH_ONE'] }), /Confirmação/);
assert.deepEqual(authorizeUnlock({ appid: '1086940', ids: ['ACH_ONE'], confirmation: 'ASSUMO O RISCO' }), { appid: '1086940', ids: ['ACH_ONE'] });
assert.throws(() => authorizeUnlock({ appid: '1086940', ids: ['ACH_ONE', 'ACH_TWO'], confirmation: 'ASSUMO O RISCO' }), /uma conquista/);
assert.equal(ENABLE_EXPERIMENTAL_WRITES, false);
function localRequest(method, url, headers) {
  let status; let sentHeaders; let body;
  server.emit('request', { method, url, headers }, {
    writeHead(code, responseHeaders) { status = code; sentHeaders = responseHeaders; },
    end(payload) { body = payload; }
  });
  return { status, headers: sentHeaders, body };
}
const deniedWrite = localRequest('POST', '/api/native-unlock', { host: '127.0.0.1:47621' });
assert.equal(deniedWrite.status, 403);
assert.match(deniedWrite.headers['Content-Security-Policy'], /script-src 'self'/);
assert.equal(deniedWrite.headers['X-Frame-Options'], 'DENY');
assert.equal(localRequest('GET', '/', { host: 'evil.example' }).status, 403);
assert.equal(localRequest('GET', '/', { host: '127.0.0.1:47621', origin: 'https://evil.example' }).status, 403);
assert.equal(JSON.parse(localRequest('GET', '/api/capabilities', { host: '127.0.0.1:47621' }).body).experimentalWritesEnabled, false);
assert.deepEqual(Object.keys(COPY.pt).sort(), Object.keys(COPY.en).sort());
assert.equal(chooseIntervalMs(parseIntervalConfig({ mode: '60' })), 60_000);
assert.equal(chooseIntervalMs(parseIntervalConfig({ mode: 'custom', customSeconds: '90' })), 90_000);
const randomInterval = parseIntervalConfig({ mode: 'random', minSeconds: '45', maxSeconds: '75' });
assert.equal(chooseIntervalMs(randomInterval, () => 0), 45_000);
assert.equal(chooseIntervalMs(randomInterval, () => 0.999999), 75_000);
assert.throws(() => parseIntervalConfig({ mode: 'custom', customSeconds: '0' }), /Intervalo inválido/);
assert.throws(() => parseIntervalConfig({ mode: 'random', minSeconds: '120', maxSeconds: '60' }), /máximo/);
assert.equal(formatCountdown(60_000), '1:00');
assert.equal(classifyError(new Error('StoreStats falhou')), 'STORE_FAILED');
const sanitized = safeEvent({ action: 'unlock', stage: 'finished', operation: 'test', appid: '2784470', achievementId: 'ACH_TEST', result: 'confirmed', steamId: '76561190000000001', password: 'secret', error: 'raw error' });
assert.equal(sanitized.appid, '2784470');
assert.equal(sanitized.achievementHash.length, 16);
assert.ok(!JSON.stringify(sanitized).includes('ACH_TEST'));
assert.ok(!JSON.stringify(sanitized).includes('76561190000000001'));
assert.ok(!JSON.stringify(sanitized).includes('secret'));
const logRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-log-test-'));
try {
  const log = createActivityLog(logRoot);
  log.record({ action: 'probe', stage: 'finished', operation: 'test', appid: '2784470', count: 50 });
  const lines = fs.readFileSync(log.file, 'utf8').trim().split('\n');
  assert.equal(lines.length, 1);
  assert.equal(JSON.parse(lines[0]).count, 50);
} finally {
  fs.unlinkSync(path.join(logRoot, 'logs', 'atlas-events.jsonl'));
  fs.rmdirSync(path.join(logRoot, 'logs'));
  fs.rmdirSync(logRoot);
}
const html = fs.readFileSync(require('node:path').join(__dirname, 'index.html'), 'utf8');
for (const [, key] of html.matchAll(/data-i18n(?:-placeholder|-aria)?="([^"]+)"/g)) assert.ok(COPY.pt[key], `Missing translation: ${key}`);
console.log('Leitura de schema e limites HTTP locais: OK');

(async () => {
  const identity = { appId: 799070, steamId: '76561190000000001' };
  const wait = async () => {};
  const confirmed = await verifyUnlock({ appid: '799070', steamId: identity.steamId, id: 'ACH_A', readState: async () => ({ ...identity, achievements: { ACH_A: true } }), wait });
  assert.equal(confirmed.status, 'confirmed');
  let reads = 0;
  const pending = await verifyUnlock({ appid: '799070', steamId: identity.steamId, id: 'ACH_A', readState: async () => { reads++; return { ...identity, achievements: { ACH_A: false } }; }, wait });
  assert.equal(pending.status, 'pending');
  assert.equal(reads, 2);
  const switched = await verifyUnlock({ appid: '799070', steamId: identity.steamId, id: 'ACH_A', readState: async () => ({ ...identity, steamId: '76561190000000002', achievements: { ACH_A: true } }), wait });
  assert.equal(switched.status, 'unverified');
  assert.equal(switched.achievements, undefined);
  console.log('Releitura após envio: OK');
  let calls = 0;
  const fakeFetch = async url => {
    calls++;
    assert.match(url, /gameid=987654321/);
    return { ok: true, headers: { get: () => null }, text: async () => JSON.stringify({ achievementpercentages: { achievements: [{ name: 'ACH_A', percent: 12.5 }] } }) };
  };
  const first = await getPublicCatalog('987654321', fakeFetch);
  const second = await getPublicCatalog('987654321', fakeFetch);
  assert.deepEqual(first, [{ id: 'ACH_A', name: 'ACH_A', description: '', globalPercent: 12.5 }]);
  assert.deepEqual(first, second);
  assert.equal(calls, 1);
  console.log('Consulta pública com cache: OK');
})().catch(error => { console.error(error); process.exitCode = 1; });
