const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const MAX_BYTES = 1024 * 1024;
const MAX_BACKUPS = 2;
const ACTIONS = new Set(['probe', 'unlock']);
const STAGES = new Set(['started', 'submitted', 'finished', 'failed']);
const RESULTS = new Set(['confirmed', 'pending', 'unverified', 'already-unlocked']);

function safeEvent(event) {
  if (!ACTIONS.has(event.action) || !STAGES.has(event.stage)) throw new Error('Evento de log inválido.');
  const entry = {
    time: new Date().toISOString(),
    operation: String(event.operation || '').slice(0, 36),
    action: event.action,
    stage: event.stage
  };
  if (/^\d{1,12}$/.test(String(event.appid))) entry.appid = String(event.appid);
  if (typeof event.achievementId === 'string' && event.achievementId) {
    entry.achievementHash = crypto.createHash('sha256').update(event.achievementId).digest('hex').slice(0, 16);
  }
  if (RESULTS.has(event.result)) entry.result = event.result;
  if (Number.isSafeInteger(event.elapsedMs) && event.elapsedMs >= 0) entry.elapsedMs = event.elapsedMs;
  if (Number.isSafeInteger(event.count) && event.count >= 0) entry.count = event.count;
  if (typeof event.errorCode === 'string' && /^[A-Z_]{1,40}$/.test(event.errorCode)) entry.errorCode = event.errorCode;
  return entry;
}

function classifyError(error) {
  const message = String(error?.message || '');
  if (/tempo|time.?out/i.test(message)) return 'TIMEOUT';
  if (/biblioteca Steamworks|carregar a biblioteca/i.test(message)) return 'DLL_UNAVAILABLE';
  if (/conta.*mudou|conta mudou/i.test(message)) return 'ACCOUNT_CHANGED';
  if (/App ID.*corresponde/i.test(message)) return 'APP_MISMATCH';
  if (/StoreStats/i.test(message)) return 'STORE_FAILED';
  if (/conquista desconhecida/i.test(message)) return 'UNKNOWN_ACHIEVEMENT';
  if (/Verifique a conta|verificação/i.test(message)) return 'PROBE_REQUIRED';
  if (/inválido|confirmação|uma conquista/i.test(message)) return 'INVALID_REQUEST';
  if (/SteamAPI_Init/i.test(message)) return 'STEAM_INIT_FAILED';
  return 'NATIVE_FAILURE';
}

function createActivityLog(root = __dirname) {
  const directory = path.join(root, 'logs');
  const file = path.join(directory, 'atlas-events.jsonl');
  function record(event) {
    const line = JSON.stringify(safeEvent(event)) + '\n';
    fs.mkdirSync(directory, { recursive: true });
    try {
      if (fs.statSync(file).size + Buffer.byteLength(line) > MAX_BYTES) {
        for (let i = MAX_BACKUPS; i >= 1; i--) {
          const current = i === 1 ? file : path.join(directory, `atlas-events.${i - 1}.jsonl`);
          const next = path.join(directory, `atlas-events.${i}.jsonl`);
          if (fs.existsSync(current)) fs.renameSync(current, next);
        }
      }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    fs.appendFileSync(file, line, { encoding: 'utf8', mode: 0o600 });
  }
  return { file, record };
}

module.exports = { createActivityLog, safeEvent, classifyError };
