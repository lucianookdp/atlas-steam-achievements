const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { randomUUID, createHmac } = require('node:crypto');
const { readSchema } = require('./steam-schema');
const { getPublicCatalog } = require('./public-catalog');
const { runNative, authorizeUnlock } = require('./steam-native');
const { verifyUnlock } = require('./verify-unlock');
const { createActivityLog, classifyError } = require('./activity-log');
const { assertNoOtherSteamGame } = require('./active-game-check');

const ROOT = __dirname;
const PORT = 47621;
const ENABLE_EXPERIMENTAL_WRITES = process.env.ATLAS_ENABLE_EXPERIMENTAL_WRITES === '1';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
let nativeBusy = false;
const recentProbes = new Map();
const PROBE_TTL_MS = 5 * 60 * 1000;
const activityLog = createActivityLog(ROOT);
const fingerprintSecret = randomUUID();
function accountFingerprint(steamId) { return createHmac('sha256', fingerprintSecret).update(steamId).digest('hex').slice(0, 16); }

function decodeVdf(value) { return value.replace(/\\\\/g, '\\').replace(/\\"/g, '"'); }
function vdfValue(contents, key) {
  const match = contents.match(new RegExp('"' + key + '"\\s+"((?:\\\\.|[^"\\\\])*)"', 'i'));
  return match ? decodeVdf(match[1]) : null;
}
function libraryPaths() {
  const bases = [
    path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Steam'),
    path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Steam'),
    path.join(os.homedir(), '.steam', 'steam'),
    path.join(os.homedir(), '.local', 'share', 'Steam')
  ];
  const libraries = new Set();
  for (const base of bases) {
    if (!fs.existsSync(base)) continue;
    libraries.add(base);
    const file = path.join(base, 'steamapps', 'libraryfolders.vdf');
    if (!fs.existsSync(file)) continue;
    const data = fs.readFileSync(file, 'utf8');
    for (const match of data.matchAll(/"path"\s+"((?:\\.|[^"\\])*)"/gi)) libraries.add(decodeVdf(match[1]));
  }
  return [...libraries];
}
function installedGames() {
  const games = new Map();
  for (const library of libraryPaths()) {
    const dir = path.join(library, 'steamapps');
    if (!fs.existsSync(dir)) continue;
    for (const filename of fs.readdirSync(dir)) {
      const match = /^appmanifest_(\d+)\.acf$/i.exec(filename);
      if (!match) continue;
      try {
        const contents = fs.readFileSync(path.join(dir, filename), 'utf8');
        const name = vdfValue(contents, 'name');
        if (name && match[1] !== '228980') games.set(match[1], { appid: match[1], name, installed: true });
      } catch { /* Ignore an unreadable manifest. */ }
    }
  }
  return [...games.values()].sort((a, b) => a.name.localeCompare(b.name));
}
function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''; let failed = false;
    req.on('data', chunk => {
      body += chunk.toString('utf8');
      if (body.length > 32_000 && !failed) { failed = true; reject(new Error('Requisição grande demais.')); req.destroy(); }
    });
    req.on('end', () => { if (failed) return; try { resolve(JSON.parse(body)); } catch { reject(new Error('JSON inválido.')); } });
    req.on('error', reject);
  });
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (req.headers.host !== `127.0.0.1:${PORT}` || (req.headers.origin && req.headers.origin !== `http://127.0.0.1:${PORT}`)) return send(res, 403, { error: 'Origem não permitida.' });
  if (req.method === 'GET' && url.pathname === '/api/games') return send(res, 200, { games: installedGames() });
  if (req.method === 'GET' && url.pathname === '/api/capabilities') return send(res, 200, { experimentalWritesEnabled: ENABLE_EXPERIMENTAL_WRITES, method: 'external-steamworks', isGameMod: false });
  if (req.method === 'GET' && url.pathname === '/api/achievements') {
    const appid = url.searchParams.get('appid') || '';
    if (!/^\d{1,12}$/.test(appid)) return send(res, 400, { error: 'App ID inválido' });
    for (const steamPath of libraryPaths()) {
      try { const achievements = readSchema(steamPath, appid); if (achievements.length) return send(res, 200, { achievements, source: 'steam-local-cache' }); }
      catch { /* Try the next Steam installation. */ }
    }
    return send(res, 200, { achievements: [], source: 'none' });
  }
  if (req.method === 'GET' && url.pathname === '/api/public-achievements') {
    const appid = url.searchParams.get('appid') || '';
    if (!/^\d{1,12}$/.test(appid)) return send(res, 400, { error: 'App ID inválido' });
    getPublicCatalog(appid)
      .then(achievements => send(res, 200, { achievements, source: 'steam-public-percentages' }))
      .catch(error => send(res, 502, { error: error.message }));
    return;
  }
  if (req.method === 'POST' && (url.pathname === '/api/native-probe' || url.pathname === '/api/native-unlock')) {
    if (url.pathname === '/api/native-unlock' && !ENABLE_EXPERIMENTAL_WRITES) return send(res, 403, { error: 'Modo somente leitura ativo. O envio experimental precisa ser habilitado localmente.' });
    if (req.headers['content-type']?.split(';')[0] !== 'application/json') return send(res, 415, { error: 'Use application/json.' });
    if (nativeBusy) return send(res, 409, { error: 'Aguarde a operação anterior terminar.' });
    nativeBusy = true;
    const operation = randomUUID();
    const started = Date.now();
    let logContext = { operation, action: url.pathname === '/api/native-unlock' ? 'unlock' : 'probe' };
    readJson(req).then(async body => {
      const mode = url.pathname === '/api/native-unlock' ? 'unlock' : 'probe';
      if (mode === 'unlock') {
        const authorized = authorizeUnlock(body);
        logContext = { ...logContext, appid: authorized.appid, achievementId: authorized.ids[0] };
        activityLog.record({ ...logContext, stage: 'started' });
        await assertNoOtherSteamGame(authorized.appid, libraryPaths);
        const probe = recentProbes.get(authorized.appid);
        recentProbes.delete(authorized.appid);
        if (!probe || Date.now() - probe.time > PROBE_TTL_MS) throw new Error('Verifique a conta Steam novamente antes do envio.');
        const result = await runNative(mode, authorized.appid, authorized.ids, libraryPaths, probe.steamId);
        try { activityLog.record({ ...logContext, stage: 'submitted', count: result.submitted?.length || 0, elapsedMs: Date.now() - started }); }
        catch (logError) { console.error('Falha ao gravar log local:', logError.code || 'UNKNOWN'); }
        const verification = await verifyUnlock({
          appid: authorized.appid,
          steamId: probe.steamId,
          id: authorized.ids[0],
          readState: () => runNative('probe', authorized.appid, [], libraryPaths)
        });
        try { activityLog.record({ ...logContext, stage: 'finished', result: result.submitted?.length ? verification.status : 'already-unlocked', elapsedMs: Date.now() - started }); }
        catch (logError) { console.error('Falha ao gravar log local:', logError.code || 'UNKNOWN'); }
        return { ...result, verification };
      }
      if (!body || !/^\d{1,12}$/.test(String(body.appid))) throw new Error('App ID inválido.');
      const appid = String(body.appid);
      logContext = { ...logContext, appid };
      activityLog.record({ ...logContext, stage: 'started' });
      recentProbes.delete(appid);
      return runNative(mode, appid, [], libraryPaths).then(result => {
        if (!/^7656119\d{10}$/.test(result.steamId) || String(result.appId) !== appid) throw new Error('Não foi possível validar jogo e conta Steam.');
        recentProbes.set(appid, { steamId: result.steamId, time: Date.now() });
        activityLog.record({ ...logContext, stage: 'finished', count: result.total, elapsedMs: Date.now() - started });
        return { ...result, accountFingerprint: accountFingerprint(result.steamId) };
      });
    }).then(result => { const { steamId, ...publicResult } = result; send(res, 200, publicResult); }).catch(error => {
      try { activityLog.record({ ...logContext, stage: 'failed', errorCode: classifyError(error), elapsedMs: Date.now() - started }); }
      catch (logError) { console.error('Falha ao gravar log local:', logError.code || 'UNKNOWN'); }
      if (!res.destroyed) send(res, 400, { error: error.message });
    }).finally(() => { nativeBusy = false; });
    return;
  }
  if (req.method !== 'GET') return send(res, 405, { error: 'Método não permitido' });
  const files = { '/': 'index.html', '/index.html': 'index.html', '/app.js': 'app.js', '/styles.css': 'styles.css', '/icon.svg': 'icon.svg' };
  const filename = files[url.pathname];
  if (!filename) return send(res, 404, { error: 'Não encontrado' });
  const filepath = path.join(ROOT, filename);
  try { return send(res, 200, fs.readFileSync(filepath), MIME[path.extname(filepath)]); }
  catch { return send(res, 500, { error: 'Falha ao abrir arquivo' }); }
});
if (require.main === module) {
  server.listen(PORT, '127.0.0.1', () => {
    const address = `http://127.0.0.1:${PORT}`;
    console.log(`Interface disponível em ${address}`);
    const { execFile } = require('node:child_process');
    if (process.platform === 'win32') execFile('cmd', ['/c', 'start', '', address], { windowsHide: true });
  });
}
module.exports = { installedGames, libraryPaths, server, ENABLE_EXPERIMENTAL_WRITES };
