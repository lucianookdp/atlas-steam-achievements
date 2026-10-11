const $ = (id) => document.getElementById(id);
const DEMO = { appid: 'demo', name: 'Jogo de demonstração', installed: false, demo: true };
const SUGGESTED_GAMES = [
  { appid: '234140', name: 'Mad Max' },
  { appid: '1086940', name: "Baldur's Gate 3" },
  { appid: '435150', name: 'Divinity: Original Sin 2' },
  { appid: '1091500', name: 'Cyberpunk 2077' },
  { appid: '799070', name: 'Zup! 8' }
];
const DEMO_ACHIEVEMENTS = [
  { id: 'FIRST_STEP', name: 'Primeiro passo', description: 'Conclua o capítulo de abertura.' },
  { id: 'EXPLORER', name: 'Explorador', description: 'Encontre todos os lugares secretos.' },
  { id: 'TEAM_WORK', name: 'Trabalho em equipe', description: 'Conclua uma partida cooperativa.' },
  { id: 'COLLECTOR', name: 'Colecionador', description: 'Reúna todos os itens especiais.' },
  { id: 'FINAL_CHAPTER', name: 'Último capítulo', description: 'Termine a história principal.' }
];
const COPY = {
  pt: {
    pageTitle: 'Atlas · Conquistas Steam', brandSubtitle: 'Conquistas Steam', selection: 'Seleção', localManager: 'GERENCIADOR LOCAL', heroTitle: 'Suas conquistas, em um só lugar.', heroText: 'Escolha um jogo, selecione conquistas e revise antes de qualquer envio.', riskTitle: 'Uso por sua conta e risco', riskShort: 'Há risco de punição no jogo ou na Steam.', details: 'Detalhes', riskNotice: 'O uso em jogos competitivos online não é recomendado. Desbloquear conquistas pode contrariar regras da Steam ou do jogo e causar punições, inclusive na conta Steam. Não há garantia contra banimentos. O envio requer verificação da conta e confirmação explícita.',
    libraryStep: '01 · BIBLIOTECA', games: 'Jogos', addGame: '+ Adicionar', refreshGames: '↻ Atualizar', refreshing: 'Procurando...', refreshResult: '{count} jogos instalados encontrados.', refreshFailed: 'Não foi possível atualizar os jogos.', searchGame: 'Buscar jogo ou App ID', searchGameLabel: 'Buscar jogo', addExample: 'Adicionar jogo de exemplo', exampleWarning: 'Exemplos não foram avaliados como seguros.', achievementsStep: '02 · CONQUISTAS', chooseAchievements: 'Escolha o que precisa', consultSteam: '↻ Consultar Steam', verifyAccount: 'Verificar conta', all: 'Todas', missing: 'Faltantes', marked: 'Marcadas', searchAchievement: 'Buscar conquista ou ID', searchAchievementLabel: 'Buscar conquista', selectAllMissing: 'Selecionar todos faltantes', clear: 'Limpar', reviewStep: '03 · REVISÃO', yourSelection: 'Sua seleção', savedHint: 'Sua seleção fica salva neste navegador.', unlockSteam: 'Desbloquear na Steam', copyright: '© 2026 Atlas. Todos os direitos reservados.', githubLink: 'GitHub', cancel: 'Cancelar', close: 'Fechar', help: 'Ajuda', switchLanguage: 'Switch to English', readOnly: 'Somente leitura', experimentalMode: 'Envio experimental',
    gameCount: '{count} {count,plural,jogo,jogos}', noGames: 'Nenhum jogo encontrado.', demoGame: 'Jogo de demonstração', demoCard: 'Exemplo interativo', installed: 'Instalado', added: 'Adicionado', appId: 'App ID {id}', sourceDemo: 'Demonstração', sourceLocal: 'Cache local da Steam', sourceMixedPublic: 'Cache local + consulta Steam', sourcePublic: 'Consulta pública Steam · IDs', sourceMixedNative: 'Cache local + API Steam', sourceNative: 'API local da Steam · IDs', sourceSaved: 'Catálogo salvo', progressUnknown: 'Progresso não verificado', progressKnown: '{unlocked} de {total} desbloqueadas', progressHint: 'Use Verificar conta para ver as faltantes', missingCount: '{count} faltantes', unknownCount: '{count} sem leitura', progressLabel: 'Progresso das conquistas',
    noCatalogTitle: 'Catálogo indisponível', noCatalogText: 'Use “Consultar Steam” para buscar IDs públicos ou abra o jogo para preencher o cache local.', noMissingTitle: 'Faltantes ainda não verificadas', noMissingText: 'Use “Verificar conta” quando quiser consultar o estado real na Steam. Sua seleção salva continua disponível em “Marcadas”.', noMatchTitle: 'Nenhuma conquista encontrada', noMatchText: 'Tente outro termo ou filtro.', noDescription: 'Sem descrição', hiddenAchievement: 'conquista oculta', statusUnlocked: 'JÁ DESBLOQUEADA', statusMarked: 'MARCADA', statusUnmarked: 'NÃO MARCADA', showMore: 'Mostrar mais · {visible} de {total}', reviewEmpty: 'Suas conquistas selecionadas aparecerão aqui.', reviewMore: 'E mais {count} selecionadas.', riskDetail: 'Sem garantia contra punições no jogo ou na Steam', readOnlyStatus: 'Modo somente leitura. Nenhum desbloqueio pode ser enviado.', oneAtATime: 'Fila sequencial: uma conquista por operação, até 60 por confirmação.', tooManySelected: 'Selecione no máximo 60 conquistas por fila.', alreadyUnlocked: 'Esta conquista já aparece como desbloqueada.', verifiedStatus: 'Conta verificada nesta sessão. O envio depende da Steam e do jogo.', verifyBeforeSend: 'Verifique a conta antes do envio. O Atlas usa a sessão Steam já aberta.',
    addGameTitle: 'Adicionar jogo', addGameText: 'Informe o App ID da Steam e um nome para identificá-lo na biblioteca.', gameName: 'Nome do jogo', gameNameExample: 'Ex.: Meu jogo', appIdExample: 'Ex.: 292030', add: 'Adicionar', invalidGame: 'Informe um App ID numérico e um nome.', consulting: 'Consultando...', publicUnavailable: 'Consulta à Steam indisponível.', publicEmpty: 'Este jogo não retornou conquistas públicas.', consultFailed: 'Consulta indisponível', operationUnavailable: 'Operação da Steam indisponível.', verifying: 'Verificando...', probeSuccessTitle: 'Conta verificada', probeSuccess: 'Jogo {appId} e conta Steam confirmados. {total} conquistas encontradas pela API local. Para iniciar uma fila, esta verificação vale por cinco minutos. Cada item será verificado novamente antes do envio.', understood: 'Entendi', probeFailed: 'Verificação indisponível',
    unlockTitle: 'Confirmar desbloqueio', unlockWarning: 'Você está prestes a enviar {count} conquista(s) de {game} para a Steam. A fila envia uma por vez e para se o resultado for incerto. Isso pode contrariar regras da Steam ou do jogo e resultar em punições, inclusive na conta. Não há garantia de ausência de banimento.', acceptRisk: 'Li o aviso e assumo os riscos desta ação.', sendSteam: 'Enviar à Steam', riskRequired: 'Marque a confirmação para continuar.', sending: 'Enviando {current} de {total}; confirmado(s): {confirmed}.', stopQueue: 'Parar após a operação atual', queueDone: '{confirmed} de {total} conquistas confirmadas. Consulte também seu perfil Steam.', queueStoppedTitle: 'Fila interrompida', queueStopped: 'Fila interrompida após {confirmed} de {total} confirmações. Confira o perfil Steam antes de tentar novamente.', queueUncertain: 'A conquista {id} não foi confirmada. Fila interrompida após {confirmed} confirmação(ões). Confira o perfil Steam.', confirmedTitle: 'Conquista confirmada', pendingTitle: 'Conquista ainda pendente', unverifiedTitle: 'Resultado não confirmado', confirmedText: 'Uma nova leitura da Steam confirmou {id} como desbloqueada. Verifique também seu perfil.', pendingText: 'O envio foi aceito, mas a releitura ainda mostra {id} como pendente. Confira o perfil Steam antes de tentar novamente.', unverifiedText: 'O envio foi solicitado, mas a releitura falhou: {error}. Confira o perfil Steam antes de tentar novamente.', stateUnavailable: 'estado indisponível', failedTitle: 'Falha ou resultado incerto', failedText: '{error} Confira o estado na Steam antes de tentar novamente.', helpTitle: 'Como usar', helpText: 'Selecione um jogo e marque as conquistas que quer acompanhar. Sua seleção fica salva neste navegador. O progresso e as faltantes exigem “Verificar conta”; o exemplo funciona sem Steam. O Atlas inicia em modo somente leitura. O envio é experimental, por sua conta e risco, sem garantia contra banimentos.', demoFirstName: 'Primeiro passo', demoFirstDesc: 'Conclua o capítulo de abertura.', demoExplorerName: 'Explorador', demoExplorerDesc: 'Encontre todos os lugares secretos.', demoTeamName: 'Trabalho em equipe', demoTeamDesc: 'Conclua uma partida cooperativa.', demoCollectorName: 'Colecionador', demoCollectorDesc: 'Reúna todos os itens especiais.', demoFinalName: 'Último capítulo', demoFinalDesc: 'Termine a história principal.'
  },
  en: {
    pageTitle: 'Atlas · Steam Achievements', brandSubtitle: 'Steam Achievements', selection: 'Selected', localManager: 'LOCAL MANAGER', heroTitle: 'Your achievements, all in one place.', heroText: 'Choose a game, mark achievements, and review before sending anything.', riskTitle: 'Use at your own risk', riskShort: 'Your game or Steam account may be penalized.', details: 'Details', riskNotice: 'We do not recommend using this with competitive online games. Unlocking achievements may violate Steam or game rules and could lead to penalties, including on your Steam account. There is no ban protection guarantee. Sending requires account verification and explicit confirmation.',
    libraryStep: '01 · LIBRARY', games: 'Games', addGame: '+ Add', refreshGames: '↻ Refresh', refreshing: 'Searching...', refreshResult: '{count} installed games found.', refreshFailed: 'Could not refresh games.', searchGame: 'Search game or App ID', searchGameLabel: 'Search games', addExample: 'Add an example game', exampleWarning: 'Examples have not been assessed as safe.', achievementsStep: '02 · ACHIEVEMENTS', chooseAchievements: 'Choose what you need', consultSteam: '↻ Check Steam', verifyAccount: 'Verify account', all: 'All', missing: 'Missing', marked: 'Marked', searchAchievement: 'Search achievement or ID', searchAchievementLabel: 'Search achievements', selectAllMissing: 'Select all missing', clear: 'Clear', reviewStep: '03 · REVIEW', yourSelection: 'Your selection', savedHint: 'Your selection is saved in this browser.', unlockSteam: 'Unlock on Steam', copyright: '© 2026 Atlas. All rights reserved.', githubLink: 'GitHub', cancel: 'Cancel', close: 'Close', help: 'Help', switchLanguage: 'Mudar para português', readOnly: 'Read only', experimentalMode: 'Experimental sending',
    gameCount: '{count} {count,plural,game,games}', noGames: 'No games found.', demoGame: 'Demo game', demoCard: 'Interactive example', installed: 'Installed', added: 'Added', appId: 'App ID {id}', sourceDemo: 'Demo', sourceLocal: 'Local Steam cache', sourceMixedPublic: 'Local cache + Steam lookup', sourcePublic: 'Public Steam lookup · IDs', sourceMixedNative: 'Local cache + Steam API', sourceNative: 'Local Steam API · IDs', sourceSaved: 'Saved catalog', progressUnknown: 'Progress not verified', progressKnown: '{unlocked} of {total} unlocked', progressHint: 'Use Verify account to see missing achievements', missingCount: '{count} missing', unknownCount: '{count} not checked', progressLabel: 'Achievement progress',
    noCatalogTitle: 'Catalog unavailable', noCatalogText: 'Use “Check Steam” for public IDs or open the game to populate the local cache.', noMissingTitle: 'Missing achievements not verified yet', noMissingText: 'Use “Verify account” when you want to check the real state on Steam. Your saved selection remains under “Marked”.', noMatchTitle: 'No achievements found', noMatchText: 'Try a different search or filter.', noDescription: 'No description', hiddenAchievement: 'hidden achievement', statusUnlocked: 'UNLOCKED', statusMarked: 'MARKED', statusUnmarked: 'NOT MARKED', showMore: 'Show more · {visible} of {total}', reviewEmpty: 'Your marked achievements will appear here.', reviewMore: 'And {count} more selected.', riskDetail: 'No guarantee against penalties in the game or on Steam', readOnlyStatus: 'Read only mode. No unlock can be sent.', oneAtATime: 'Sequential queue: one achievement per operation, up to 60 per confirmation.', tooManySelected: 'Select no more than 60 achievements per queue.', alreadyUnlocked: 'This achievement is already shown as unlocked.', verifiedStatus: 'Account verified in this session. Sending depends on Steam and the game.', verifyBeforeSend: 'Verify your account before sending. Atlas uses the Steam session already open.',
    addGameTitle: 'Add game', addGameText: 'Enter the Steam App ID and a name for your library.', gameName: 'Game name', gameNameExample: 'E.g. My game', appIdExample: 'E.g. 292030', add: 'Add', invalidGame: 'Enter a numeric App ID and a name.', consulting: 'Checking...', publicUnavailable: 'Steam lookup unavailable.', publicEmpty: 'This game returned no public achievements.', consultFailed: 'Lookup unavailable', operationUnavailable: 'Steam operation unavailable.', verifying: 'Verifying...', probeSuccessTitle: 'Account verified', probeSuccess: 'Game {appId} and Steam account confirmed. The local API found {total} achievements. This verification lasts five minutes. Each item is checked again before sending.', understood: 'Got it', probeFailed: 'Verification unavailable',
    unlockTitle: 'Confirm unlock', unlockWarning: 'You are about to send {count} achievement(s) for {game} to Steam. The queue sends one at a time and stops if the result is uncertain. This may violate Steam or game rules and lead to penalties, including on your account. Freedom from bans is not guaranteed.', acceptRisk: 'I have read the warning and accept the risks of this action.', sendSteam: 'Send to Steam', riskRequired: 'Check the confirmation box to continue.', sending: 'Sending {current} of {total}; confirmed: {confirmed}.', stopQueue: 'Stop after the current operation', queueDone: '{confirmed} of {total} achievements confirmed. Check your Steam profile too.', queueStoppedTitle: 'Queue stopped', queueStopped: 'Queue stopped after {confirmed} of {total} confirmations. Check your Steam profile before trying again.', queueUncertain: 'Achievement {id} was not confirmed. Queue stopped after {confirmed} confirmation(s). Check your Steam profile.', confirmedTitle: 'Achievement confirmed', pendingTitle: 'Achievement still pending', unverifiedTitle: 'Result not confirmed', confirmedText: 'A new Steam read confirmed {id} as unlocked. Check your profile too.', pendingText: 'The send was accepted, but a new read still shows {id} as pending. Check your Steam profile before trying again.', unverifiedText: 'The send was requested, but verification failed: {error}. Check your Steam profile before trying again.', stateUnavailable: 'state unavailable', failedTitle: 'Failed or uncertain result', failedText: '{error} Check the state on Steam before trying again.', helpTitle: 'How to use', helpText: 'Choose a game and mark achievements to track. Your selection is saved in this browser. Progress and missing achievements require “Verify account”; the demo works without Steam. Atlas starts in read only mode. Sending is experimental, at your own risk, with no ban protection guarantee.', demoFirstName: 'First step', demoFirstDesc: 'Complete the opening chapter.', demoExplorerName: 'Explorer', demoExplorerDesc: 'Find all secret locations.', demoTeamName: 'Teamwork', demoTeamDesc: 'Complete a cooperative match.', demoCollectorName: 'Collector', demoCollectorDesc: 'Collect all special items.', demoFinalName: 'Final chapter', demoFinalDesc: 'Finish the main story.'
  }
};
const PROBE_TTL_MS = 5 * 60 * 1000;
const MAX_QUEUE = 60;
const state = { language: 'pt', games: [DEMO], gameId: 'demo', catalogs: { demo: DEMO_ACHIEVEMENTS }, catalogSources: { demo: 'Demonstração' }, selected: {}, native: { demo: { FIRST_STEP: true, EXPLORER: false, TEAM_WORK: false, COLLECTOR: false, FINAL_CHAPTER: false } }, probeReady: {}, accountFingerprint: {}, queueRunning: false, writeEnabled: false, search: '', achievementSearch: '', filter: 'all', visibleLimit: 100 };

function tr(key, values = {}) {
  const template = COPY[state.language][key] ?? COPY.pt[key] ?? key;
  return template.replace(/\{(\w+)(?:,plural,([^,{}]+),([^{}]+))?\}/g, (_, name, singular, plural) => singular ? (Number(values[name]) === 1 ? singular : plural) : String(values[name] ?? ''));
}
function applyLanguage() {
  document.documentElement.lang = state.language === 'pt' ? 'pt-BR' : 'en';
  document.title = tr('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = tr(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', tr(el.dataset.i18nAria)); });
  $('helpButton').title = tr('help');
  $('helpButton').setAttribute('aria-label', tr('help'));
  $('languageButton').textContent = state.language === 'pt' ? 'EN' : 'PT';
  $('languageButton').title = tr('switchLanguage');
  $('languageButton').setAttribute('aria-label', tr('switchLanguage'));
  $('modeBadge').textContent = tr(state.writeEnabled ? 'experimentalMode' : 'readOnly');
}

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem('atlas-state') || '{}');
    if (saved.catalogs && typeof saved.catalogs === 'object') state.catalogs = { ...state.catalogs, ...saved.catalogs };
    if (saved.catalogSources && typeof saved.catalogSources === 'object') state.catalogSources = { ...state.catalogSources, ...saved.catalogSources };
    if (saved.selected && typeof saved.selected === 'object') state.selected = saved.selected;
    if (saved.language === 'en' || saved.language === 'pt') state.language = saved.language;
    if (Array.isArray(saved.customGames)) state.customGames = saved.customGames.filter(g => /^\d+$/.test(String(g.appid)) && typeof g.name === 'string');
    if (typeof saved.gameId === 'string') state.gameId = saved.gameId;
  } catch { /* A corrupted browser cache should not prevent launch. */ }
}
function persist() {
  try { localStorage.setItem('atlas-state', JSON.stringify({ language: state.language, catalogs: state.catalogs, catalogSources: state.catalogSources, selected: state.selected, customGames: state.customGames || [], gameId: state.gameId })); }
  catch { /* Private browsing can disable local storage. */ }
}
function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function game() { return state.games.find(g => g.appid === state.gameId); }
function achievements() { return state.catalogs[state.gameId] || []; }
const DEMO_COPY = { FIRST_STEP: ['demoFirstName', 'demoFirstDesc'], EXPLORER: ['demoExplorerName', 'demoExplorerDesc'], TEAM_WORK: ['demoTeamName', 'demoTeamDesc'], COLLECTOR: ['demoCollectorName', 'demoCollectorDesc'], FINAL_CHAPTER: ['demoFinalName', 'demoFinalDesc'] };
function achievementName(a) { return state.gameId === 'demo' && DEMO_COPY[a.id] ? tr(DEMO_COPY[a.id][0]) : a.name; }
function achievementDescription(a) { return state.gameId === 'demo' && DEMO_COPY[a.id] ? tr(DEMO_COPY[a.id][1]) : a.description; }
async function loadLocalSchema(appid) {
  if (appid === 'demo' || state.catalogs[appid]) return;
  try {
    const response = await fetch(`/api/achievements?appid=${encodeURIComponent(appid)}`);
    const data = await response.json();
    if (Array.isArray(data.achievements) && data.achievements.length) {
      state.catalogs[appid] = data.achievements;
      state.catalogSources[appid] = 'Cache local da Steam';
      persist();
      if (state.gameId === appid) render();
    }
  } catch { /* Local cache may be absent. */ }
}
function selectedIds() { return new Set(state.selected[state.gameId] || []); }
function sourceLabel(source) {
  const sources = { 'Demonstração': 'sourceDemo', 'Cache local da Steam': 'sourceLocal', 'Cache local + consulta Steam': 'sourceMixedPublic', 'Consulta pública Steam · IDs': 'sourcePublic', 'Cache local + API Steam': 'sourceMixedNative', 'API local da Steam · IDs': 'sourceNative' };
  return tr(sources[source] || 'sourceSaved');
}
function knownState(appid, id) { const native = state.native[appid]; return native && Object.prototype.hasOwnProperty.call(native, id) ? native[id] : null; }
function totalSelected() { return Object.values(state.selected).reduce((sum, ids) => sum + (Array.isArray(ids) ? ids.length : 0), 0); }
function coverTone(id) { return [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) % 4; }
function probeIsFresh(appid) {
  const time = state.probeReady[appid];
  if (typeof time !== 'number') return false;
  if (Date.now() - time < PROBE_TTL_MS) return true;
  delete state.probeReady[appid];
  return false;
}

function renderGames() {
  const q = state.search.toLocaleLowerCase('pt-BR');
  const visible = state.games.filter(g => (g.demo ? tr('demoGame') : g.name).toLocaleLowerCase('pt-BR').includes(q) || g.appid.includes(q));
  $('gameTotal').textContent = tr('gameCount', { count: visible.length });
  $('gameList').innerHTML = visible.length ? visible.map(g => { const name = g.demo ? tr('demoGame') : g.name; return `<button class="game-card ${g.appid === state.gameId ? 'active' : ''}" data-id="${escapeHTML(g.appid)}"><span class="game-cover tone-${coverTone(g.appid)}">${escapeHTML(name.charAt(0).toUpperCase())}</span><span><strong>${escapeHTML(name)}</strong><small>${g.demo ? tr('demoCard') : `${escapeHTML(tr('appId', { id: g.appid }))} · ${tr(g.installed ? 'installed' : 'added')}`}</small></span><span class="arrow">›</span></button>`; }).join('') : `<div class="empty-state">${tr('noGames')}</div>`;
  $('gameList').querySelectorAll('.game-card').forEach(button => button.addEventListener('click', () => { state.gameId = button.dataset.id; state.visibleLimit = 100; persist(); render(); loadLocalSchema(state.gameId); }));
}
function selectOrAddGame(appid, name) {
  if (!state.games.some(g => g.appid === appid)) {
    const item = { appid, name, installed: false };
    state.games.push(item);
    state.customGames = [...(state.customGames || []), item];
    state.games.sort((a, b) => a.name.localeCompare(b.name));
  }
  state.gameId = appid;
  state.visibleLimit = 100;
  persist(); render(); loadLocalSchema(appid);
}
function renderSuggestions() {
  $('suggestedGames').innerHTML = SUGGESTED_GAMES.map(g => `<button type="button" data-id="${g.appid}">${escapeHTML(g.name)}</button>`).join('');
  $('suggestedGames').querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    const suggestion = SUGGESTED_GAMES.find(g => g.appid === button.dataset.id);
    selectOrAddGame(suggestion.appid, suggestion.name);
  }));
}
function filteredAchievements() {
  const q = state.achievementSearch.toLocaleLowerCase('pt-BR');
  const ids = selectedIds();
  return achievements().filter(a => (String(achievementName(a) ?? '').toLocaleLowerCase('pt-BR').includes(q) || String(achievementDescription(a) ?? '').toLocaleLowerCase('pt-BR').includes(q) || String(a.id ?? '').toLocaleLowerCase('pt-BR').includes(q)) && (state.filter === 'all' || (state.filter === 'selected' ? ids.has(a.id) : knownState(state.gameId, a.id) === false)));
}
function renderAchievements() {
  const g = game(); const list = achievements(); const ids = selectedIds();
  $('gameBanner').classList.toggle('hidden', !g);
  const unlocked = list.filter(a => knownState(state.gameId, a.id) === true).length;
  const pending = list.filter(a => knownState(state.gameId, a.id) === false).length;
  const unknown = list.length - unlocked - pending;
  if (g) $('gameBanner').innerHTML = `<div><strong>${escapeHTML(g.demo ? tr('demoGame') : g.name)}</strong><small>${escapeHTML(sourceLabel(state.catalogSources[state.gameId]))}</small></div><div class="game-progress"><strong>${unknown === list.length && !g.demo ? tr('progressUnknown') : tr('progressKnown', { unlocked, total: list.length })}</strong><span>${unknown && unknown !== list.length ? `${tr('unknownCount', { count: unknown })} · ` : ''}${unknown === list.length && !g.demo ? tr('progressHint') : tr('missingCount', { count: pending })}</span><progress max="${Math.max(list.length, 1)}" value="${unlocked}" aria-label="${tr('progressLabel')}"></progress></div>`;
  $('publicButton').disabled = state.gameId === 'demo';
  $('probeButton').disabled = state.gameId === 'demo';
  $('selectMissing').disabled = pending === 0;
  $('countAll').textContent = list.length; $('countPending').textContent = unknown === list.length && !g?.demo ? '—' : pending; $('countSelected').textContent = list.filter(a => ids.has(a.id)).length;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.filter === state.filter));
  const matches = filteredAchievements();
  const visible = matches.slice(0, state.visibleLimit);
  if (!list.length) {
    $('achievementList').innerHTML = `<div class="empty-state"><div class="empty-icon">◇</div><strong>${tr('noCatalogTitle')}</strong><p>${tr('noCatalogText')}</p></div>`;
    return;
  }
  if (!visible.length) { $('achievementList').innerHTML = state.filter === 'pending' && unknown === list.length && !g?.demo ? `<div class="empty-state"><strong>${tr('noMissingTitle')}</strong><p>${tr('noMissingText')}</p></div>` : `<div class="empty-state"><div class="empty-icon">⌕</div><strong>${tr('noMatchTitle')}</strong><p>${tr('noMatchText')}</p></div>`; return; }
  $('achievementList').innerHTML = visible.map(a => { const status = knownState(state.gameId, a.id) === true ? 'unlocked' : ids.has(a.id) ? 'selected' : 'unselected'; return `<div class="achievement-row"><label class="achievement"><input type="checkbox" data-id="${escapeHTML(a.id)}" ${ids.has(a.id) ? 'checked' : ''}><span class="achievement-info"><strong>${escapeHTML(achievementName(a))}</strong><span>${escapeHTML(achievementDescription(a) || tr('noDescription'))}${a.hidden ? ` · ${tr('hiddenAchievement')}` : ''}</span></span><span class="achievement-status is-${status}">${tr(status === 'unlocked' ? 'statusUnlocked' : status === 'selected' ? 'statusMarked' : 'statusUnmarked')}</span></label></div>`; }).join('') + (matches.length > visible.length ? `<button class="load-more" id="loadMore" type="button">${tr('showMore', { visible: visible.length, total: matches.length })}</button>` : '');
  $('achievementList').querySelectorAll('.achievement input').forEach(input => input.addEventListener('change', () => { const next = selectedIds(); input.checked ? next.add(input.dataset.id) : next.delete(input.dataset.id); state.selected[state.gameId] = [...next]; persist(); renderAchievements(); renderReview(); }));
  $('loadMore')?.addEventListener('click', () => { state.visibleLimit += 100; renderAchievements(); });
}
function renderReview() {
  const ids = selectedIds(); const list = achievements().filter(a => ids.has(a.id));
  $('reviewCount').textContent = list.length; $('navCount').textContent = totalSelected();
  const verified = probeIsFresh(state.gameId);
  const alreadyUnlocked = list.length === 1 && knownState(state.gameId, list[0].id) === true;
  const pendingSelection = list.filter(a => knownState(state.gameId, a.id) === false);
  $('unlockButton').disabled = !state.writeEnabled || state.queueRunning || !verified || pendingSelection.length === 0 || pendingSelection.length > MAX_QUEUE;
  $('riskTitle').textContent = tr('riskTitle');
  $('riskDetail').textContent = tr('riskDetail');
  $('nativeStatus').textContent = tr(!state.writeEnabled ? 'readOnlyStatus' : pendingSelection.length > MAX_QUEUE ? 'tooManySelected' : list.length > 1 ? 'oneAtATime' : alreadyUnlocked ? 'alreadyUnlocked' : verified ? 'verifiedStatus' : 'verifyBeforeSend');
  $('reviewItems').innerHTML = list.length ? list.slice(0, 25).map(a => `<div class="review-item"><span>${escapeHTML(achievementName(a))}</span></div>`).join('') + (list.length > 25 ? `<div class="review-empty">${tr('reviewMore', { count: list.length - 25 })}</div>` : '') : `<div class="review-empty">${tr('reviewEmpty')}</div>`;
}
function render() { renderGames(); renderAchievements(); renderReview(); }
function showModal(title, text, fields, submitLabel, onSubmit) {
  $('modalTitle').textContent = title; $('modalText').textContent = text; $('modalFields').innerHTML = fields; $('modalSubmit').textContent = submitLabel;
  const modal = $('modal'); const form = modal.querySelector('form');
  $('modalSubmit').disabled = false;
  modal.querySelectorAll('[value="cancel"]').forEach(button => { button.disabled = false; });
  form.onsubmit = event => { if (event.submitter?.value === 'cancel') return; event.preventDefault(); onSubmit?.(modal); };
  modal.showModal();
}
function error(message) { let el = $('modalFields').querySelector('.modal-error'); if (!el) { el = document.createElement('div'); el.className = 'modal-error'; $('modalFields').append(el); } el.textContent = message; }
function addGame() {
  showModal(tr('addGameTitle'), tr('addGameText'), `<label for="appid">App ID</label><input id="appid" inputmode="numeric" placeholder="${tr('appIdExample')}" required><label for="gameName">${tr('gameName')}</label><input id="gameName" placeholder="${tr('gameNameExample')}" required>`, tr('add'), modal => {
    const appid = $('appid').value.trim(); const name = $('gameName').value.trim();
    if (!/^\d{1,12}$/.test(appid) || !name) return error(tr('invalidGame'));
    selectOrAddGame(appid, name); modal.close();
  });
}
async function consultPublicCatalog() {
  const appid = state.gameId;
  if (appid === 'demo') return;
  const button = $('publicButton');
  button.disabled = true;
  button.textContent = tr('consulting');
  try {
    const response = await fetch(`/api/public-achievements?appid=${encodeURIComponent(appid)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(state.language === 'en' ? tr('publicUnavailable') : data.error || tr('publicUnavailable'));
    if (!Array.isArray(data.achievements) || !data.achievements.length) throw new Error(tr('publicEmpty'));
    const previous = state.catalogs[appid] || [];
    const byId = new Map(previous.map(a => [a.id, a]));
    for (const achievement of data.achievements) {
      const old = byId.get(achievement.id);
      byId.set(achievement.id, old ? { ...old, globalPercent: achievement.globalPercent } : achievement);
    }
    state.catalogs[appid] = [...byId.values()];
    state.catalogSources[appid] = previous.length ? 'Cache local + consulta Steam' : 'Consulta pública Steam · IDs';
    persist();
    if (state.gameId === appid) render();
  } catch (err) {
    showModal(tr('consultFailed'), err.message, '', tr('close'), modal => modal.close());
  } finally {
    button.disabled = state.gameId === 'demo';
    button.textContent = tr('consultSteam');
  }
}
async function nativeRequest(route, payload) {
  const response = await fetch(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok) throw new Error(state.language === 'en' ? tr('operationUnavailable') : data.error || tr('operationUnavailable'));
  return data;
}
async function probeAccount() {
  const appid = state.gameId; const button = $('probeButton');
  button.disabled = true; button.textContent = tr('verifying');
  try {
    const result = await nativeRequest('/api/native-probe', { appid });
    state.native[appid] = result.achievements;
    state.accountFingerprint[appid] = result.accountFingerprint;
    state.probeReady[appid] = Date.now();
    setTimeout(() => { if (state.gameId === appid) renderReview(); }, PROBE_TTL_MS);
    const known = new Set((state.catalogs[appid] || []).map(a => a.id));
    const discovered = Object.keys(result.achievements).filter(id => !known.has(id)).map(id => ({ id, name: id, description: '' }));
    if (discovered.length) {
      state.catalogs[appid] = [...(state.catalogs[appid] || []), ...discovered];
      state.catalogSources[appid] = known.size ? 'Cache local + API Steam' : 'API local da Steam · IDs';
      persist();
    }
    if (state.gameId === appid) { render(); showModal(tr('probeSuccessTitle'), tr('probeSuccess', { appId: result.appId, total: result.total }), '', tr('understood'), modal => modal.close()); }
  } catch (err) { delete state.native[appid]; delete state.probeReady[appid]; delete state.accountFingerprint[appid]; if (state.gameId === appid) { render(); showModal(tr('probeFailed'), err.message, '', tr('close'), modal => modal.close()); } }
  finally { button.disabled = state.gameId === 'demo'; button.textContent = tr('verifyAccount'); }
}
function confirmUnlock() {
  const appid = state.gameId;
  const ids = achievements().filter(a => selectedIds().has(a.id) && knownState(appid, a.id) === false).map(a => a.id);
  if (state.queueRunning || !probeIsFresh(appid) || !ids.length || ids.length > MAX_QUEUE || !state.accountFingerprint[appid]) { renderReview(); return; }
  showModal(tr('unlockTitle'), tr('unlockWarning', { count: ids.length, game: game()?.name }), `<label class="risk-confirm"><input type="checkbox" id="acceptRisk"> ${tr('acceptRisk')}</label><button class="text-btn hidden" type="button" id="stopQueue">${tr('stopQueue')}</button>`, tr('sendSteam'), async modal => {
    if (!$('acceptRisk').checked) return error(tr('riskRequired'));
    state.queueRunning = true;
    $('modalSubmit').disabled = true;
    modal.querySelectorAll('[value="cancel"]').forEach(button => { button.disabled = true; });
    const stopButton = $('stopQueue'); stopButton.classList.remove('hidden');
    let stop = false; let confirmed = 0; let uncertainId = '';
    stopButton.addEventListener('click', () => { stop = true; stopButton.disabled = true; });
    try {
      const fingerprint = state.accountFingerprint[appid];
      for (let i = 0; i < ids.length && !stop; i++) {
        $('modalText').textContent = tr('sending', { current: i + 1, total: ids.length, confirmed });
        const probe = await nativeRequest('/api/native-probe', { appid });
        if (stop) break;
        if (probe.accountFingerprint !== fingerprint) throw new Error(state.language === 'en' ? 'Steam account changed. Queue stopped.' : 'A conta Steam mudou. Fila interrompida.');
        state.native[appid] = probe.achievements;
        if (probe.achievements[ids[i]] === true) { state.selected[appid] = (state.selected[appid] || []).filter(id => id !== ids[i]); persist(); continue; }
        if (probe.achievements[ids[i]] !== false) throw new Error(state.language === 'en' ? 'Achievement not found in Steam.' : 'Conquista não encontrada na Steam.');
        const result = await nativeRequest('/api/native-unlock', { appid, ids: [ids[i]], confirmation: 'ASSUMO O RISCO' });
        delete state.probeReady[appid];
        if (result.verification?.achievements) state.native[appid] = result.verification.achievements;
        if (result.verification?.status !== 'confirmed') { uncertainId = ids[i]; break; }
        confirmed++;
        state.selected[appid] = (state.selected[appid] || []).filter(id => id !== ids[i]);
        persist();
        if (state.gameId === appid) render();
      }
      modal.close();
      const message = uncertainId ? tr('queueUncertain', { id: uncertainId, confirmed }) : stop ? tr('queueStopped', { confirmed, total: ids.length }) : tr('queueDone', { confirmed, total: ids.length });
      showModal(uncertainId ? tr('unverifiedTitle') : stop ? tr('queueStoppedTitle') : tr('confirmedTitle'), message, '', tr('understood'), dialog => dialog.close());
    } catch (err) { modal.close(); showModal(tr('failedTitle'), tr('failedText', { error: err.message }), '', tr('close'), dialog => dialog.close()); }
    finally { state.queueRunning = false; delete state.probeReady[appid]; if (state.gameId === appid) render(); }
  });
}
async function refreshGames(showStatus = true) {
  const button = $('refreshGames');
  button.disabled = true;
  button.textContent = tr('refreshing');
  try {
    const response = await fetch('/api/games');
    if (!response.ok) throw new Error('Local game scan failed');
    const data = await response.json();
    if (!Array.isArray(data.games)) throw new Error('Invalid local game list');
    const previous = game();
    const installed = data.games;
    const games = [...installed, ...(state.customGames || []).filter(g => !installed.some(d => d.appid === g.appid)), DEMO];
    if (previous && !games.some(g => g.appid === previous.appid)) games.push({ ...previous, installed: false });
    state.games = games.sort((a, b) => a.name.localeCompare(b.name));
    if (!state.games.some(g => g.appid === state.gameId)) state.gameId = 'demo';
    if (showStatus) $('libraryStatus').textContent = tr('refreshResult', { count: installed.length });
  } catch {
    state.games = [...state.games.filter(g => !g.demo), ...(state.customGames || []).filter(g => !state.games.some(d => d.appid === g.appid)), DEMO];
    if (showStatus) $('libraryStatus').textContent = tr('refreshFailed');
  } finally {
    button.disabled = false;
    button.textContent = tr('refreshGames');
    render();
  }
}
async function start() {
  readSaved();
  applyLanguage();
  try { const response = await fetch('/api/capabilities'); const data = await response.json(); state.writeEnabled = data.experimentalWritesEnabled === true; } catch { state.writeEnabled = false; }
  applyLanguage();
  await refreshGames(false);
  renderSuggestions();
  loadLocalSchema(state.gameId);
  $('languageButton').addEventListener('click', () => { state.language = state.language === 'pt' ? 'en' : 'pt'; persist(); $('libraryStatus').textContent = ''; applyLanguage(); render(); renderSuggestions(); });
  $('gameSearch').addEventListener('input', e => { state.search = e.target.value; renderGames(); });
  $('achievementSearch').addEventListener('input', e => { state.achievementSearch = e.target.value; state.visibleLimit = 100; renderAchievements(); });
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { state.filter = t.dataset.filter; state.visibleLimit = 100; renderAchievements(); }));
  $('selectMissing').addEventListener('click', () => { const ids = selectedIds(); achievements().filter(a => knownState(state.gameId, a.id) === false).forEach(a => ids.add(a.id)); state.selected[state.gameId] = [...ids]; persist(); renderAchievements(); renderReview(); });
  $('clearSelection').addEventListener('click', () => { state.selected[state.gameId] = []; persist(); renderAchievements(); renderReview(); });
  $('addGame').addEventListener('click', addGame);
  $('refreshGames').addEventListener('click', () => refreshGames());
  $('publicButton').addEventListener('click', consultPublicCatalog);
  $('probeButton').addEventListener('click', probeAccount);
  $('unlockButton').addEventListener('click', confirmUnlock);
  $('helpButton').addEventListener('click', () => showModal(tr('helpTitle'), tr('helpText'), '', tr('understood'), modal => modal.close()));
  $('navQueue').addEventListener('click', () => document.querySelector('.review-panel').scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
if (typeof module !== 'undefined') module.exports = { COPY };
if (typeof document !== 'undefined') start();

