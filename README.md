# Atlas · Steam Achievements

[Português](#português) · [English](#english)

## Português

O Atlas é uma interface local para encontrar, organizar e revisar conquistas Steam. **Abre em modo somente leitura.** Não pede login nem senha; para consultar sua conta, usa a sessão Steam já aberta no computador.

### Instalar e abrir

1. Baixe o [ZIP do projeto](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip) e extraia a pasta.
2. No Windows, instale o [Node.js](https://nodejs.org/) 18 ou superior, se ainda não tiver.
3. Com a Steam aberta, execute `start.cmd`. Se o navegador não abrir, acesse `http://127.0.0.1:47621`.

### Usar

1. Escolha um jogo. **Jogo de demonstração** permite testar a interface sem acessar sua conta.
2. Busque e marque conquistas. Você pode indicar “servidor fechado”, “bug”, “save perdido” ou outro motivo. A seleção fica salva neste navegador.
3. Clique em **Verificar conta** somente quando quiser ver o progresso real e o filtro **Faltantes**. Para jogos reais, isso exige Steam aberta e jogo instalado.
4. Revise a seleção e, se quiser, exporte um JSON. O botão de desbloqueio fica desativado no modo padrão.

**Envio experimental:** para habilitar deliberadamente o botão, abra o PowerShell na pasta do projeto e execute `$env:ATLAS_ENABLE_EXPERIMENTAL_WRITES='1'; node server.js`. O Atlas exige nova verificação e confirmação para **cada conquista**. Feche com `Ctrl+C`; `start.cmd` sempre volta ao modo somente leitura.

**Risco:** desbloquear conquistas pode contrariar regras da Steam ou do jogo e resultar em punições, inclusive na conta. Não recomendamos uso em jogos competitivos online. Não há garantia de sucesso, compatibilidade ou ausência de banimento. Leia [riscos e relatos](RISCOS-E-RELATOS.md).

Execute `npm test` para rodar testes locais com dados simulados, sem consultar sua conta nem enviar conquistas. O Atlas não altera a data histórica das conquistas.

## English

Atlas is a local interface for finding, organizing, and reviewing Steam achievements. **It starts in read only mode.** Atlas does not ask for a login or password; account checks use the Steam session already open on your computer.

### Install and open

1. Download the [project ZIP](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip) and extract it.
2. On Windows, install [Node.js](https://nodejs.org/) 18 or newer if needed.
3. With Steam open, run `start.cmd`. If your browser does not open, visit `http://127.0.0.1:47621`.

### Use

1. Choose a game. **Demo game** lets you try the interface without accessing your account.
2. Search and mark achievements. You can add a reason such as “server closed,” “game bug,” or “lost save.” Your selection is saved in this browser.
3. Click **Verify account** only when you want to see real progress and the **Missing** filter. For real games, Steam must be open and the game installed.
4. Review your selection and optionally export a JSON file. Unlocking is disabled in the default mode.

**Experimental sending:** to deliberately enable the unlock button, open PowerShell in the project folder and run `$env:ATLAS_ENABLE_EXPERIMENTAL_WRITES='1'; node server.js`. Atlas requires a fresh verification and confirmation for **each achievement**. Stop with `Ctrl+C`; `start.cmd` always returns to read only mode.

**Risk:** unlocking achievements may violate Steam or game rules and lead to penalties, including on your account. We do not recommend competitive online games. There is no guarantee of success, compatibility, or freedom from bans. See [risks and reports](RISCOS-E-RELATOS.md) (Portuguese).

Run `npm test` for local tests with simulated data; they do not check your account or send achievements. Atlas does not change historical unlock dates.
