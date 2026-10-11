const assert = require('node:assert/strict');
const { parseKeyValues, achievementsFromSchema } = require('./steam-schema');
const { installedGames, server, ENABLE_EXPERIMENTAL_WRITES } = require('./server');
const { getPublicCatalog } = require('./public-catalog');
const { validateIds, findNativeDll, authorizeUnlock } = require('./steam-native');
const { verifyUnlock } = require('./verify-unlock');

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
assert.ok(installedGames().every(g => /^\d+$/.test(g.appid) && g.name));
assert.deepEqual(validateIds(['ACH_ONE']), ['ACH_ONE']);
assert.throws(() => validateIds(['ACH_ONE', 'ACH_TWO']), /uma conquista/);
assert.throws(() => validateIds(['ACH\0BAD']), /inválido/);
assert.throws(() => findNativeDll('bad', () => []), /App ID/);
assert.throws(() => authorizeUnlock({ appid: '1086940', ids: ['ACH_ONE'] }), /Confirmação/);
assert.deepEqual(authorizeUnlock({ appid: '1086940', ids: ['ACH_ONE'], confirmation: 'ASSUMO O RISCO' }), { appid: '1086940', ids: ['ACH_ONE'] });
assert.throws(() => authorizeUnlock({ appid: '1086940', ids: ['ACH_ONE', 'ACH_TWO'], confirmation: 'ASSUMO O RISCO' }), /uma conquista/);
if (!ENABLE_EXPERIMENTAL_WRITES) {
  let status;
  server.emit('request', { method: 'POST', url: '/api/native-unlock', headers: { host: '127.0.0.1:47621' } }, { writeHead(code) { status = code; }, end() {} });
  assert.equal(status, 403);
}
console.log('Leitura de schema e descoberta de jogos: OK');

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
