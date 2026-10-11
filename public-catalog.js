const CACHE_MS = 24 * 60 * 60 * 1000;
const MAX_ACHIEVEMENTS = 5000;
const MAX_RESPONSE_BYTES = 2_000_000;
const cache = new Map();
const pending = new Map();
let lastRemoteRequestAt = 0;

function normalizePublicAchievements(payload) {
  const rows = payload?.achievementpercentages?.achievements;
  if (!Array.isArray(rows)) throw new Error('A Steam não retornou uma lista de conquistas para este jogo.');
  if (rows.length > MAX_ACHIEVEMENTS) throw new Error('Catálogo público grande demais.');
  const ids = new Set();
  return rows.map(row => {
    const id = typeof row?.name === 'string' ? row.name.trim() : '';
    if (!id || ids.has(id)) return null;
    ids.add(id);
    return { id, name: id, description: '', globalPercent: Number(row.percent) || 0 };
  }).filter(Boolean);
}

async function getPublicCatalog(appid, fetcher = fetch, now = Date.now()) {
  if (!/^\d{1,12}$/.test(String(appid))) throw new Error('App ID inválido.');
  const hit = cache.get(appid);
  if (hit && hit.expiresAt > now) return hit.achievements;
  if (pending.has(appid)) return pending.get(appid);
  if (now - lastRemoteRequestAt < 3000) throw new Error('Aguarde alguns segundos antes de outra consulta à Steam.');
  lastRemoteRequestAt = now;
  const promise = (async () => {
    const url = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appid}`;
    const response = await fetcher(url, { signal: AbortSignal.timeout(6000), redirect: 'error', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Consulta à Steam falhou (${response.status}).`);
    const length = Number(response.headers?.get?.('content-length') || 0);
    if (length > MAX_RESPONSE_BYTES) throw new Error('Resposta da Steam grande demais.');
    const raw = await response.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_RESPONSE_BYTES) throw new Error('Resposta da Steam grande demais.');
    const achievements = normalizePublicAchievements(JSON.parse(raw));
    cache.set(appid, { achievements, expiresAt: Date.now() + CACHE_MS });
    return achievements;
  })();
  pending.set(appid, promise);
  try { return await promise; }
  finally { pending.delete(appid); }
}

module.exports = { getPublicCatalog, normalizePublicAchievements };
