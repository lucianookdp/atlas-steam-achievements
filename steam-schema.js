const fs = require('node:fs');
const path = require('node:path');

function parseKeyValues(buffer) {
  let offset = 0;
  const decoder = new TextDecoder('utf-8');
  function bytes(count) { if (offset + count > buffer.length) throw new Error('Schema truncado'); const start = offset; offset += count; return start; }
  function cstring() { const start = offset; const end = buffer.indexOf(0, start); if (end < 0) throw new Error('String inválida'); offset = end + 1; return decoder.decode(buffer.subarray(start, end)); }
  function entries(depth) {
    if (depth > 30) throw new Error('Schema profundo demais');
    const result = {};
    while (offset < buffer.length) {
      const type = buffer.readUInt8(bytes(1));
      if (type === 8) return result;
      const key = cstring();
      let value;
      if (type === 0) value = entries(depth + 1);
      else if (type === 1) value = cstring();
      else if (type === 2) value = buffer.readInt32LE(bytes(4));
      else if (type === 3) value = buffer.readFloatLE(bytes(4));
      else if (type === 4 || type === 6) value = buffer.readUInt32LE(bytes(4));
      else if (type === 7) value = buffer.readBigUInt64LE(bytes(8)).toString();
      else throw new Error(`Tipo de schema desconhecido: ${type}`);
      result[key] = value;
    }
    throw new Error('Fim do schema ausente');
  }
  return entries(0);
}
function localized(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  const chosen = value.brazilian || value.portuguese || value.english || Object.values(value).find(x => typeof x === 'string' || typeof x === 'number');
  return chosen == null ? '' : String(chosen);
}
function achievementsFromSchema(root, appid) {
  const stats = root[String(appid)]?.stats;
  if (!stats || typeof stats !== 'object') return [];
  const result = [];
  const seen = new Set();
  for (const stat of Object.values(stats)) {
    const bits = stat?.bits;
    if (!bits || typeof bits !== 'object') continue;
    for (const bit of Object.values(bits)) {
      const id = typeof bit?.name === 'string' ? bit.name : '';
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push({ id, name: localized(bit.display?.name) || id, description: localized(bit.display?.desc), hidden: String(bit.display?.hidden || '0') === '1' });
    }
  }
  return result;
}
function readSchema(steamPath, appid) {
  if (!/^\d{1,12}$/.test(String(appid))) return [];
  const filename = path.join(steamPath, 'appcache', 'stats', `UserGameStatsSchema_${appid}.bin`);
  if (!fs.existsSync(filename)) return [];
  const buffer = fs.readFileSync(filename);
  if (buffer.length > 10_000_000) throw new Error('Schema grande demais');
  return achievementsFromSchema(parseKeyValues(buffer), appid);
}
module.exports = { parseKeyValues, achievementsFromSchema, readSchema };
