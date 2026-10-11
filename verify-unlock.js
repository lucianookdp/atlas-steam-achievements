const { setTimeout: delay } = require('node:timers/promises');

async function verifyUnlock({ appid, steamId, id, readState, wait = delay }) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) await wait(1000);
    try {
      const result = await readState();
      if (String(result.appId) !== appid || result.steamId !== steamId) throw new Error('A conta ou o jogo mudou durante a confirmação.');
      if (!result.achievements || typeof result.achievements[id] !== 'boolean') throw new Error('A conquista não apareceu na nova leitura.');
      if (result.achievements[id]) return { status: 'confirmed', attempts: attempt, achievements: result.achievements };
      if (attempt === 2) return { status: 'pending', attempts: attempt, achievements: result.achievements };
    } catch (error) {
      lastError = error;
      if (attempt === 2) break;
    }
  }
  return { status: 'unverified', attempts: 2, error: lastError?.message || 'Não foi possível consultar a Steam novamente.' };
}

module.exports = { verifyUnlock };
