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
const REASONS = { unavailable: 'Servidor fechado', bug: 'Bug no jogo', save: 'Save perdido', other: 'Outro motivo' };
const PROBE_TTL_MS = 5 * 60 * 1000;
const state = { games: [DEMO], gameId: 'demo', catalogs: { demo: DEMO_ACHIEVEMENTS }, catalogSources: { demo: 'Demonstração' }, selected: {}, reasons: {}, native: { demo: { FIRST_STEP: true, EXPLORER: false, TEAM_WORK: false, COLLECTOR: false, FINAL_CHAPTER: false } }, probeReady: {}, writeEnabled: false, search: '', achievementSearch: '', filter: 'all', visibleLimit: 100 };

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem('atlas-state') || '{}');
    if (saved.catalogs && typeof saved.catalogs === 'object') state.catalogs = { ...state.catalogs, ...saved.catalogs };
    if (saved.catalogSources && typeof saved.catalogSources === 'object') state.catalogSources = { ...state.catalogSources, ...saved.catalogSources };
    if (saved.selected && typeof saved.selected === 'object') state.selected = saved.selected;
    if (saved.reasons && typeof saved.reasons === 'object') state.reasons = saved.reasons;
    if (Array.isArray(saved.customGames)) state.customGames = saved.customGames.filter(g => /^\d+$/.test(String(g.appid)) && typeof g.name === 'string');
    if (typeof saved.gameId === 'string') state.gameId = saved.gameId;
  } catch { /* A corrupted browser cache should not prevent launch. */ }
}
function persist() {
  try { localStorage.setItem('atlas-state', JSON.stringify({ catalogs: state.catalogs, catalogSources: state.catalogSources, selected: state.selected, reasons: state.reasons, customGames: state.customGames || [], gameId: state.gameId })); }
  catch { /* Private browsing can disable local storage. */ }
}
function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function game() { return state.games.find(g => g.appid === state.gameId); }
function achievements() { return state.catalogs[state.gameId] || []; }
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
  } catch { /* Import remains available when the cache is absent. */ }
}
function selectedIds() { return new Set(state.selected[state.gameId] || []); }
function reasonFor(appid, id) { return REASONS[state.reasons[appid]?.[id]] || ''; }
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
  const visible = state.games.filter(g => g.name.toLocaleLowerCase('pt-BR').includes(q) || g.appid.includes(q));
  $('gameTotal').textContent = `${visible.length} ${visible.length === 1 ? 'jogo' : 'jogos'}`;
  $('gameList').innerHTML = visible.length ? visible.map(g => `<button class="game-card ${g.appid === state.gameId ? 'active' : ''}" data-id="${escapeHTML(g.appid)}"><span class="game-cover tone-${coverTone(g.appid)}">${escapeHTML(g.name.charAt(0).toUpperCase())}</span><span><strong>${escapeHTML(g.name)}</strong><small>${g.demo ? 'Exemplo interativo' : `App ID ${escapeHTML(g.appid)} · ${g.installed ? 'Instalado' : 'Adicionado'}`}</small></span><span class="arrow">›</span></button>`).join('') : '<div class="empty-state">Nenhum jogo encontrado.</div>';
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
  return achievements().filter(a => (String(a.name ?? '').toLocaleLowerCase('pt-BR').includes(q) || String(a.description ?? '').toLocaleLowerCase('pt-BR').includes(q) || String(a.id ?? '').toLocaleLowerCase('pt-BR').includes(q)) && (state.filter === 'all' || (state.filter === 'selected' ? ids.has(a.id) : knownState(state.gameId, a.id) === false)));
}
function renderAchievements() {
  const g = game(); const list = achievements(); const ids = selectedIds();
  $('gameBanner').classList.toggle('hidden', !g);
  const unlocked = list.filter(a => knownState(state.gameId, a.id) === true).length;
  const pending = list.filter(a => knownState(state.gameId, a.id) === false).length;
  const unknown = list.length - unlocked - pending;
  if (g) $('gameBanner').innerHTML = `<div><strong>${escapeHTML(g.name)}</strong><small>${escapeHTML(state.catalogSources[state.gameId] || 'Catálogo salvo')}</small></div><div class="game-progress"><strong>${unknown === list.length && !g.demo ? 'Progresso não verificado' : `${unlocked} de ${list.length} desbloqueadas`}</strong><span>${unknown && unknown !== list.length ? `${unknown} sem leitura · ` : ''}${unknown === list.length && !g.demo ? 'Use Verificar conta para ver as faltantes' : `${pending} faltantes`}</span><progress max="${Math.max(list.length, 1)}" value="${unlocked}" aria-label="Progresso das conquistas"></progress></div>`;
  $('publicButton').disabled = state.gameId === 'demo';
  $('probeButton').disabled = state.gameId === 'demo';
  $('countAll').textContent = list.length; $('countPending').textContent = unknown === list.length && !g?.demo ? '—' : pending; $('countSelected').textContent = list.filter(a => ids.has(a.id)).length;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.filter === state.filter));
  const matches = filteredAchievements();
  const visible = matches.slice(0, state.visibleLimit);
  if (!list.length) {
    $('achievementList').innerHTML = '<div class="empty-state"><div class="empty-icon">◇</div><strong>Catálogo indisponível</strong><p>Use “Consultar Steam” para buscar IDs públicos, abra o jogo para preencher o cache local ou importe um JSON.</p></div>';
    return;
  }
  if (!visible.length) { $('achievementList').innerHTML = state.filter === 'pending' && unknown === list.length && !g?.demo ? '<div class="empty-state"><strong>Faltantes ainda não verificadas</strong><p>Use “Verificar conta” quando quiser consultar o estado real na Steam. Sua seleção salva continua disponível em “Marcadas”.</p></div>' : '<div class="empty-state"><div class="empty-icon">⌕</div><strong>Nenhuma conquista encontrada</strong><p>Tente outro termo ou filtro.</p></div>'; return; }
  $('achievementList').innerHTML = visible.map(a => { const status = knownState(state.gameId, a.id) === true ? 'unlocked' : ids.has(a.id) ? 'selected' : 'unselected'; const savedReason = state.reasons[state.gameId]?.[a.id] || ''; const reasonOptions = Object.entries(REASONS).map(([value, label]) => `<option value="${value}" ${savedReason === value ? 'selected' : ''}>${label}</option>`).join(''); return `<div class="achievement-row"><label class="achievement"><input type="checkbox" data-id="${escapeHTML(a.id)}" ${ids.has(a.id) ? 'checked' : ''}><span class="achievement-info"><strong>${escapeHTML(a.name)}</strong><span>${escapeHTML(a.description || 'Sem descrição')}${a.hidden ? ' · conquista oculta' : ''}</span></span><span class="achievement-status is-${status}">${status === 'unlocked' ? 'JÁ DESBLOQUEADA' : status === 'selected' ? 'MARCADA' : 'NÃO MARCADA'}</span></label>${ids.has(a.id) ? `<div class="reason-row"><span>Motivo</span><select class="reason-select" data-id="${escapeHTML(a.id)}" aria-label="Motivo para ${escapeHTML(a.name)}"><option value="">Escolha se quiser</option>${reasonOptions}</select></div>` : ''}</div>`; }).join('') + (matches.length > visible.length ? `<button class="load-more" id="loadMore" type="button">Mostrar mais · ${visible.length} de ${matches.length}</button>` : '');
  $('achievementList').querySelectorAll('.achievement input').forEach(input => input.addEventListener('change', () => { const next = selectedIds(); input.checked ? next.add(input.dataset.id) : next.delete(input.dataset.id); state.selected[state.gameId] = [...next]; if (!input.checked && state.reasons[state.gameId]) delete state.reasons[state.gameId][input.dataset.id]; persist(); renderAchievements(); renderReview(); }));
  $('achievementList').querySelectorAll('.reason-select').forEach(select => select.addEventListener('change', () => { state.reasons[state.gameId] ||= {}; if (select.value in REASONS) state.reasons[state.gameId][select.dataset.id] = select.value; else delete state.reasons[state.gameId][select.dataset.id]; persist(); renderReview(); }));
  $('loadMore')?.addEventListener('click', () => { state.visibleLimit += 100; renderAchievements(); });
}
function renderReview() {
  const ids = selectedIds(); const list = achievements().filter(a => ids.has(a.id));
  $('reviewCount').textContent = list.length; $('navCount').textContent = totalSelected();
  const verified = probeIsFresh(state.gameId);
  const alreadyUnlocked = list.length === 1 && knownState(state.gameId, list[0].id) === true;
  $('exportButton').disabled = !list.length; $('unlockButton').disabled = !state.writeEnabled || list.length !== 1 || !verified || alreadyUnlocked;
  $('riskTitle').textContent = 'Uso por sua conta e risco';
  $('riskDetail').textContent = 'Sem garantia contra punições no jogo ou na Steam';
  $('nativeStatus').textContent = !state.writeEnabled ? 'Modo somente leitura. Nenhum desbloqueio pode ser enviado.' : list.length > 1 ? 'Envio experimental limitado a uma conquista por confirmação.' : alreadyUnlocked ? 'Esta conquista já aparece como desbloqueada.' : verified ? 'Conta verificada nesta sessão. O envio depende da Steam e do jogo.' : 'Verifique a conta antes de cada envio. O Atlas usa a sessão Steam já aberta.';
  $('reviewItems').innerHTML = list.length ? list.map(a => `<div class="review-item"><span>${escapeHTML(a.name)}${reasonFor(state.gameId, a.id) ? `<small>${escapeHTML(reasonFor(state.gameId, a.id))}</small>` : ''}</span></div>`).join('') : '<div class="review-empty">Suas conquistas selecionadas aparecerão aqui.</div>';
}
function render() { renderGames(); renderAchievements(); renderReview(); }
function showModal(title, text, fields, submitLabel, onSubmit) {
  $('modalTitle').textContent = title; $('modalText').textContent = text; $('modalFields').innerHTML = fields; $('modalSubmit').textContent = submitLabel;
  const modal = $('modal'); const form = modal.querySelector('form');
  form.onsubmit = event => { if (event.submitter?.value === 'cancel') return; event.preventDefault(); onSubmit?.(modal); };
  modal.showModal();
}
function error(message) { let el = $('modalFields').querySelector('.modal-error'); if (!el) { el = document.createElement('div'); el.className = 'modal-error'; $('modalFields').append(el); } el.textContent = message; }
function addGame() {
  showModal('Adicionar jogo', 'Informe o App ID da Steam e um nome para identificá-lo na biblioteca.', '<label for="appid">App ID</label><input id="appid" inputmode="numeric" placeholder="Ex.: 292030" required><label for="gameName">Nome do jogo</label><input id="gameName" placeholder="Ex.: Meu jogo" required>', 'Adicionar', modal => {
    const appid = $('appid').value.trim(); const name = $('gameName').value.trim();
    if (!/^\d{1,12}$/.test(appid) || !name) return error('Informe um App ID numérico e um nome.');
    selectOrAddGame(appid, name); modal.close();
  });
}
function normalizeCatalog(raw) {
  const root = raw?.game?.availableGameStats?.achievements || raw?.availableGameStats?.achievements || raw?.achievements || raw;
  if (!Array.isArray(root)) throw new Error('O JSON precisa conter um array de conquistas ou um schema GetSchemaForGame da Steam.');
  const ids = new Set();
  const result = root.map(item => {
    if (!item || typeof item !== 'object') return null;
    const id = String(item.name ?? item.apiname ?? item.id ?? '').trim();
    const name = String(item.displayName ?? item.display_name ?? item.title ?? item.name ?? '').trim();
    const description = String(item.description ?? item.desc ?? '').trim();
    if (!id || !name || ids.has(id)) return null;
    ids.add(id); return { id, name, description };
  }).filter(Boolean);
  if (!result.length) throw new Error('Nenhuma conquista válida foi encontrada no JSON.');
  return result;
}
async function importCatalog(file) {
  if (file.size > 5_000_000) throw new Error('O arquivo deve ter até 5 MB.');
  const raw = JSON.parse(await file.text());
  const catalog = normalizeCatalog(raw);
  const schemaAppid = String(raw?.game?.steam_appid ?? raw?.appid ?? '');
  if (schemaAppid && state.gameId !== 'demo' && schemaAppid !== state.gameId) throw new Error(`O catálogo é do App ID ${schemaAppid}, mas o jogo selecionado é ${state.gameId}.`);
  state.catalogs[state.gameId] = catalog;
  state.catalogSources[state.gameId] = 'JSON importado';
  state.selected[state.gameId] = (state.selected[state.gameId] || []).filter(id => catalog.some(a => a.id === id));
  if (state.reasons[state.gameId]) for (const id of Object.keys(state.reasons[state.gameId])) if (!catalog.some(a => a.id === id)) delete state.reasons[state.gameId][id];
  persist(); render();
}
async function consultPublicCatalog() {
  const appid = state.gameId;
  if (appid === 'demo') return;
  const button = $('publicButton');
  button.disabled = true;
  button.textContent = 'Consultando...';
  try {
    const response = await fetch(`/api/public-achievements?appid=${encodeURIComponent(appid)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Consulta à Steam indisponível.');
    if (!Array.isArray(data.achievements) || !data.achievements.length) throw new Error('Este jogo não retornou conquistas públicas.');
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
    showModal('Consulta indisponível', err.message, '', 'Fechar', modal => modal.close());
  } finally {
    button.disabled = state.gameId === 'demo';
    button.textContent = 'Consultar Steam';
  }
}
async function nativeRequest(route, payload) {
  const response = await fetch(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Operação da Steam indisponível.');
  return data;
}
async function probeAccount() {
  const appid = state.gameId; const button = $('probeButton');
  button.disabled = true; button.textContent = 'Verificando...';
  try {
    const result = await nativeRequest('/api/native-probe', { appid });
    state.native[appid] = result.achievements;
    state.probeReady[appid] = Date.now();
    setTimeout(() => { if (state.gameId === appid) renderReview(); }, PROBE_TTL_MS);
    const known = new Set((state.catalogs[appid] || []).map(a => a.id));
    const discovered = Object.keys(result.achievements).filter(id => !known.has(id)).map(id => ({ id, name: id, description: '' }));
    if (discovered.length) {
      state.catalogs[appid] = [...(state.catalogs[appid] || []), ...discovered];
      state.catalogSources[appid] = known.size ? 'Cache local + API Steam' : 'API local da Steam · IDs';
      persist();
    }
    if (state.gameId === appid) { render(); showModal('Conta verificada', `Jogo ${result.appId} e conta Steam confirmados. ${result.total} conquistas encontradas pela API local. Para enviar uma conquista, esta verificação vale por cinco minutos e será consumida após a tentativa.`, '', 'Entendi', modal => modal.close()); }
  } catch (err) { delete state.native[appid]; delete state.probeReady[appid]; if (state.gameId === appid) { render(); showModal('Verificação indisponível', err.message, '', 'Fechar', modal => modal.close()); } }
  finally { button.disabled = state.gameId === 'demo'; button.textContent = 'Verificar conta'; }
}
function confirmUnlock() {
  const appid = state.gameId; const ids = achievements().filter(a => selectedIds().has(a.id)).map(a => a.id);
  if (ids.length !== 1 || !probeIsFresh(appid) || knownState(appid, ids[0]) === true) { renderReview(); return; }
  const pending = ids.filter(id => !state.native[appid][id]).length;
  showModal('Confirmar desbloqueio', `Você está prestes a enviar ${pending} conquista(s) de ${game()?.name} para a Steam. Isso pode contrariar regras da Steam ou do jogo e resultar em punições, inclusive na conta. O uso é por sua conta e risco. Não recomendamos uso em jogos competitivos online. Não há garantia de sucesso ou de ausência de banimento.`, '<label class="risk-confirm"><input type="checkbox" id="acceptRisk"> Li o aviso e assumo os riscos desta ação.</label>', 'Enviar à Steam', async modal => {
    if (!$('acceptRisk').checked) return error('Marque a confirmação para continuar.');
    $('modalSubmit').disabled = true;
    try {
      $('modalText').textContent = 'Enviando a conquista e consultando novamente a Steam...';
      const result = await nativeRequest('/api/native-unlock', { appid, ids, confirmation: 'ASSUMO O RISCO' });
      modal.close(); delete state.probeReady[appid];
      if (result.verification?.achievements) state.native[appid] = result.verification.achievements;
      else delete state.native[appid];
      if (state.gameId === appid) render();
      const status = result.verification?.status;
      const title = status === 'confirmed' ? 'Conquista confirmada' : status === 'pending' ? 'Conquista ainda pendente' : 'Resultado não confirmado';
      const message = status === 'confirmed'
        ? `Uma nova leitura da Steam confirmou ${ids[0]} como desbloqueada. Verifique também seu perfil.`
        : status === 'pending'
          ? `O envio foi aceito, mas a releitura ainda mostra ${ids[0]} como pendente. Confira o perfil Steam antes de tentar novamente.`
          : `O envio foi solicitado, mas a releitura falhou: ${result.verification?.error || 'estado indisponível'}. Confira o perfil Steam antes de tentar novamente.`;
      showModal(title, message, '', 'Entendi', dialog => dialog.close());
    } catch (err) { modal.close(); delete state.probeReady[appid]; delete state.native[appid]; if (state.gameId === appid) render(); showModal('Falha ou resultado incerto', `${err.message} Verifique o estado na Steam antes de tentar novamente.`, '', 'Fechar', dialog => dialog.close()); }
    finally { $('modalSubmit').disabled = false; }
  });
}
function exportSelection() {
  const ids = selectedIds(); const data = { format: 'atlas-selection-v1', game: { appid: state.gameId, name: game()?.name }, achievements: achievements().filter(a => ids.has(a.id)).map(a => ({ id: a.id, name: a.name, ...(reasonFor(state.gameId, a.id) ? { reason: reasonFor(state.gameId, a.id) } : {}) })), exportedAt: new Date().toISOString(), appliedToSteam: false };
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); link.download = `atlas-selecao-${state.gameId}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
async function start() {
  readSaved();
  try { const response = await fetch('/api/capabilities'); const data = await response.json(); state.writeEnabled = data.experimentalWritesEnabled === true; } catch { state.writeEnabled = false; }
  $('modeBadge').textContent = state.writeEnabled ? 'Envio experimental' : 'Somente leitura';
  try { const response = await fetch('/api/games'); const data = await response.json(); state.games = [...data.games, ...(state.customGames || []).filter(g => !data.games.some(d => d.appid === g.appid)), DEMO].sort((a,b) => a.name.localeCompare(b.name)); }
  catch { state.games = [...(state.customGames || []), DEMO]; }
  if (!state.games.some(g => g.appid === state.gameId)) state.gameId = state.games[0]?.appid || 'demo';
  render();
  renderSuggestions();
  loadLocalSchema(state.gameId);
  $('gameSearch').addEventListener('input', e => { state.search = e.target.value; renderGames(); });
  $('achievementSearch').addEventListener('input', e => { state.achievementSearch = e.target.value; state.visibleLimit = 100; renderAchievements(); });
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { state.filter = t.dataset.filter; state.visibleLimit = 100; renderAchievements(); }));
  $('selectVisible').addEventListener('click', () => { const ids = selectedIds(); filteredAchievements().slice(0, state.visibleLimit).forEach(a => ids.add(a.id)); state.selected[state.gameId] = [...ids]; persist(); renderAchievements(); renderReview(); });
  $('clearSelection').addEventListener('click', () => { state.selected[state.gameId] = []; delete state.reasons[state.gameId]; persist(); renderAchievements(); renderReview(); });
  $('addGame').addEventListener('click', addGame);
  $('importButton').addEventListener('click', () => $('fileInput').click());
  $('publicButton').addEventListener('click', consultPublicCatalog);
  $('probeButton').addEventListener('click', probeAccount);
  $('unlockButton').addEventListener('click', confirmUnlock);
  $('fileInput').addEventListener('change', async e => { const file = e.target.files?.[0]; if (!file) return; try { await importCatalog(file); } catch (err) { showModal('Falha na importação', err.message, '', 'Fechar', modal => modal.close()); } e.target.value = ''; });
  $('exportButton').addEventListener('click', exportSelection);
  $('helpButton').addEventListener('click', () => showModal('Como usar', 'Selecione um jogo ou adicione um App ID. O Atlas lê o cache local; se ele não estiver disponível, consulte a Steam ou importe um JSON. O inicializador abre em modo somente leitura. O conector externo de desbloqueio é experimental e pode ser habilitado localmente conforme o README. Ele não é um mod do jogo. O uso é por sua conta e risco, sem garantia contra banimentos.', '', 'Entendi', modal => modal.close()));
  $('navQueue').addEventListener('click', () => document.querySelector('.review-panel').scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
start();
