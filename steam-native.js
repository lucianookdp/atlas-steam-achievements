const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const MAX_IDS = 1;
const MAX_OUTPUT = 1_000_000;
const TIMEOUT_MS = 20_000;

function findNativeDll(appid, libraryPaths) {
  if (!/^\d{1,12}$/.test(String(appid))) throw new Error('App ID inválido.');
  for (const library of libraryPaths()) {
    const manifest = path.join(library, 'steamapps', `appmanifest_${appid}.acf`);
    let contents;
    try { contents = fs.readFileSync(manifest, 'utf8'); } catch { continue; }
    const match = contents.match(/"installdir"\s+"([^"\r\n]+)"/i);
    if (!match || match[1].includes('..') || /[\\/:]/.test(match[1])) continue;
    const root = path.join(library, 'steamapps', 'common', match[1]);
    for (const relative of ['steam_api64.dll', 'bin/steam_api64.dll', 'bin/x64/steam_api64.dll', 'bin/Win64/steam_api64.dll', 'Bin/steam_api64.dll', 'DefEd/bin/steam_api64.dll', 'binaries/steam_api64.dll', 'Binaries/Win64/steam_api64.dll', 'Engine/Binaries/ThirdParty/Steamworks/Steamv153/Win64/steam_api64.dll', 'Launcher/steam_api64.dll', 'steam_api.dll', 'bin/steam_api.dll', 'Bin/steam_api.dll']) {
      const file = path.join(root, relative);
      try { if (fs.statSync(file).isFile()) return file; } catch { /* Try next known location. */ }
    }
  }
  throw new Error('Não foi encontrada a biblioteca Steamworks deste jogo. Instale-o pela Steam ou use outro jogo compatível.');
}

function validateIds(ids) {
  if (!Array.isArray(ids) || ids.length !== MAX_IDS) throw new Error('O envio experimental aceita uma conquista por confirmação.');
  if (ids.some(id => typeof id !== 'string' || !id || id.length > 256 || /[\x00-\x1f]/.test(id))) throw new Error('ID de conquista inválido.');
  if (new Set(ids).size !== ids.length) throw new Error('Há conquistas repetidas na seleção.');
  return ids;
}

function authorizeUnlock(body) {
  if (!body || !/^\d{1,12}$/.test(String(body.appid))) throw new Error('App ID inválido.');
  if (body.confirmation !== 'ASSUMO O RISCO') throw new Error('Confirmação de risco ausente.');
  return { appid: String(body.appid), ids: validateIds(body.ids) };
}

function runNative(mode, appid, ids, libraryPaths, expectedSteamId = '', spawnProcess = spawn) {
  if (!['probe', 'unlock'].includes(mode)) return Promise.reject(new Error('Ação inválida.'));
  let dll;
  try {
    dll = findNativeDll(appid, libraryPaths);
    if (mode === 'unlock') {
      validateIds(ids);
      if (!/^7656119\d{10}$/.test(expectedSteamId)) throw new Error('Verifique a conta Steam antes do envio.');
    }
  }
  catch (error) { return Promise.reject(error); }
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, 'steam-native.ps1');
    const shell = path.basename(dll).toLowerCase() === 'steam_api.dll'
      ? path.join(process.env.WINDIR || 'C:\Windows', 'SysWOW64', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
      : 'powershell.exe';
    const child = spawnProcess(shell, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', script, '-Mode', mode, '-DllPath', dll, '-AppId', String(appid)], {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, SteamAppId: String(appid), SteamGameId: String(appid) }
    });
    let stdout = ''; let stderr = ''; let settled = false;
    const finish = (error, value) => { if (settled) return; settled = true; clearTimeout(timer); error ? reject(error) : resolve(value); };
    const timer = setTimeout(() => { child.kill(); finish(new Error('A Steam não respondeu a tempo.')); }, TIMEOUT_MS);
    child.stdout.on('data', chunk => { stdout += chunk.toString('utf8'); if (stdout.length > MAX_OUTPUT) { child.kill(); finish(new Error('Resposta da Steam grande demais.')); } });
    child.stderr.on('data', chunk => { stderr += chunk.toString('utf8'); if (stderr.length > 4000) stderr = stderr.slice(-4000); });
    child.on('error', error => finish(new Error(`Não foi possível iniciar o conector: ${error.message}`)));
    child.on('close', code => {
      if (settled) return;
      try {
        const result = JSON.parse(stdout.trim());
        if (code !== 0 || !result.ok) return finish(new Error(result.error || 'A Steam recusou a operação.'));
        finish(null, result);
      } catch { finish(new Error(`O conector falhou${stderr ? `: ${stderr.trim()}` : '.'}`)); }
    });
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify({ ids: mode === 'unlock' ? ids : [], expectedSteamId }));
  });
}

module.exports = { findNativeDll, validateIds, authorizeUnlock, runNative };
