# Atlas · Steam Achievements

[Português](#português) · [English](#english)

## Português

O Atlas é uma interface local para encontrar, organizar e revisar conquistas Steam. **Abre em modo somente leitura.** Não pede login nem senha; para consultar sua conta, usa a sessão Steam já aberta no computador.

### Instalar e abrir

1. Baixe o [ZIP do projeto](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip) e extraia a pasta.
2. No Windows, instale o [Node.js](https://nodejs.org/) 18 ou superior, se ainda não tiver.
3. Com a Steam aberta, execute `start.cmd`. Se o navegador não abrir, acesse `http://127.0.0.1:47621`.

### Usar

1. Escolha um jogo. Use **Atualizar** para procurar instalações novas. **Jogo de demonstração** permite testar a interface sem acessar sua conta.
2. Busque e marque conquistas. A seleção fica salva neste navegador.
3. Clique em **Verificar conta** quando quiser ver o progresso real. Isso habilita o filtro **Faltantes** e **Selecionar todos faltantes**. Para jogos reais, é preciso ter a Steam aberta e o jogo instalado.
4. Revise sua seleção. O envio experimental fica desativado no modo padrão. Quando habilitado, a fila aceita até **60 conquistas** por confirmação, faz uma operação por conquista, verifica o resultado e para se houver incerteza. Use **Parar** durante a fila para interromper após a operação atual.

**Para testar pela interface quando quiser:** feche qualquer janela antiga do Atlas e execute `testar-na-interface.cmd`. Abrir a página não consulta sua conta nem envia conquistas. No navegador, escolha 9 Kings, clique em **Verificar conta**, revise as faltantes e confirme somente a seleção que deseja enviar. O Atlas faz uma nova verificação antes de **cada conquista**. Feche a janela do programa para encerrar o servidor. `start.cmd` abre em modo somente leitura.

Antes de cada envio, o Atlas verifica se outro jogo da Steam está em execução no Windows e recusa a operação se encontrar um. Feche jogos competitivos antes de testar. Essa verificação não garante ausência de punições.

**Logs locais:** tentativas de verificação e envio ficam em `logs/atlas-events.jsonl` (até 1 MB por arquivo, com duas cópias antigas). Cada linha contém horário, App ID, etapa, duração e resultado; a conquista é identificada por hash. O arquivo não registra Steam ID, senha, nomes ou respostas brutas e não é servido pela interface. Confira esse arquivo antes de compartilhá-lo.

**Risco:** desbloquear conquistas pode contrariar regras da Steam ou do jogo e resultar em punições, inclusive na conta. Não recomendamos uso em jogos competitivos online. Não há garantia de sucesso, compatibilidade ou ausência de banimento. Leia [riscos e relatos](RISCOS-E-RELATOS.md).

Execute `npm test` para rodar testes locais com dados simulados, sem consultar sua conta nem enviar conquistas. O Atlas não altera a data histórica das conquistas.

## English

Atlas is a local interface for finding, organizing, and reviewing Steam achievements. **It starts in read only mode.** Atlas does not ask for a login or password; account checks use the Steam session already open on your computer.

### Install and open

1. Download the [project ZIP](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip) and extract it.
2. On Windows, install [Node.js](https://nodejs.org/) 18 or newer if needed.
3. With Steam open, run `start.cmd`. If your browser does not open, visit `http://127.0.0.1:47621`.

### Use

1. Choose a game. Use **Refresh** to find newly installed games. **Demo game** lets you try the interface without accessing your account.
2. Search and mark achievements. Your selection is saved in this browser.
3. Click **Verify account** when you want to see real progress. This enables the **Missing** filter and **Select all missing**. For real games, Steam must be open and the game installed.
4. Review your selection. Experimental sending is disabled by default. When enabled, the queue accepts up to **60 achievements** per confirmation, runs one operation per achievement, verifies the result, and stops on uncertainty. Use **Stop** during the queue to stop after the current operation.

**To test through the interface when ready:** close any older Atlas window and run `testar-na-interface.cmd`. Opening the page does not check your account or send achievements. In the browser, choose 9 Kings, click **Verify account**, review the missing achievements, and confirm only the selection you want to send. Atlas checks the account again before **each achievement**. Close the program window to stop the server. `start.cmd` opens in read only mode.

Before each send, Atlas checks whether another Steam game is running on Windows and refuses the operation if it finds one. Close competitive games before testing. This check does not guarantee freedom from penalties.

**Local logs:** probe and send attempts are saved in `logs/atlas-events.jsonl` (up to 1 MB per file, with two older copies). Each line contains time, App ID, stage, duration, and result; achievements use a hash. Steam ID, passwords, names, and raw connector responses are not logged. The interface does not serve this file. Review it before sharing.

**Risk:** unlocking achievements may violate Steam or game rules and lead to penalties, including on your account. We do not recommend competitive online games. There is no guarantee of success, compatibility, or freedom from bans. See [risks and reports](RISCOS-E-RELATOS.md) (Portuguese).

Run `npm test` for local tests with simulated data; they do not check your account or send achievements. Atlas does not change historical unlock dates.
