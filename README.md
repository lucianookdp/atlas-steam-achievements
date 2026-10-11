# Atlas · Steam Achievements

[Português](#português) · [English](#english)

## Português

O Atlas é uma interface local para encontrar, organizar e revisar conquistas Steam. Não pede login nem senha; para consultar sua conta, usa a sessão Steam já aberta no computador. Abrir a interface não consulta a conta nem envia conquistas.

### Instalar e abrir

1. Baixe o [ZIP do projeto](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip) e extraia a pasta.
2. No Windows, instale o [Node.js](https://nodejs.org/) 18 ou superior, se ainda não tiver.
3. Com a Steam aberta, abra a pasta `steam-achievements` e dê **dois cliques em `Abrir Atlas.cmd` dentro dela**. Mantenha todos os arquivos juntos; se quiser abrir pela Área de Trabalho, crie um atalho para o `.cmd` em vez de copiar só ele. Se o navegador não abrir, acesse `http://127.0.0.1:47621`. Deixe a janela preta aberta enquanto usa o Atlas.

Se quiser apenas explorar a interface sem opção de envio, use `Somente leitura.cmd`. Feche qualquer janela antiga do Atlas antes de trocar de modo.

### Usar

1. Escolha um jogo. Use **Atualizar** para procurar instalações novas. **Jogo de demonstração** permite testar a interface sem acessar sua conta.
2. Busque e marque conquistas. A seleção fica salva neste navegador.
3. Clique em **Verificar conta** quando quiser ver o progresso real. Isso habilita o filtro **Faltantes** e **Selecionar todos faltantes**. Para jogos reais, é preciso ter a Steam aberta e o jogo instalado.
4. Revise sua seleção. O envio exige confirmação na interface. A fila aceita até **60 conquistas** por confirmação, faz uma operação por conquista, verifica o resultado e para se houver incerteza. Antes de confirmar, escolha uma pausa de 15 ou 30 segundos, 1, 2 ou 5 minutos, um tempo personalizado (1 a 3600 segundos) ou um intervalo aleatório entre limites definidos por você. O primeiro envio é imediato; a pausa ocorre entre tentativas. Use **Parar** durante a fila, inclusive na contagem regressiva.

No navegador, escolha o jogo, clique em **Verificar conta**, revise as faltantes e confirme somente a seleção que deseja enviar. O Atlas faz uma nova verificação antes de **cada conquista**. Feche a janela preta para encerrar o servidor.

Antes de cada envio, o Atlas verifica se outro jogo da Steam está em execução no Windows e recusa a operação se encontrar um. Feche jogos competitivos antes de testar. Essa verificação não garante ausência de punições.

**Logs locais:** tentativas de verificação e envio ficam em `logs/atlas-events.jsonl` (até 1 MB por arquivo, com duas cópias antigas). Cada linha contém horário, App ID, etapa, duração e resultado; a conquista é identificada por hash. O arquivo não registra Steam ID, senha, nomes ou respostas brutas e não é servido pela interface. Confira esse arquivo antes de compartilhá-lo.

**Risco:** desbloquear conquistas pode contrariar regras da Steam ou do jogo e resultar em punições, inclusive na conta. Não recomendamos uso em jogos competitivos online. Intervalos fixos ou aleatórios não garantem proteção contra banimentos. Não há garantia de sucesso ou compatibilidade. Leia [riscos e relatos](RISCOS-E-RELATOS.md).

O projeto usa o [SAM como referência técnica](SAM-REFERENCIA.md), sem alegar proteção contra banimentos.

Execute `npm test` para rodar testes locais com dados simulados, sem consultar sua conta nem enviar conquistas. O Atlas não altera a data histórica das conquistas.

## English

Atlas is a local interface for finding, organizing, and reviewing Steam achievements. Atlas does not ask for a login or password; account checks use the Steam session already open on your computer. Opening the interface does not check your account or send achievements.

### Install and open

1. Download the [project ZIP](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip) and extract it.
2. On Windows, install [Node.js](https://nodejs.org/) 18 or newer if needed.
3. With Steam open, open the `steam-achievements` folder and **double-click `Abrir Atlas.cmd` inside it**. Keep all project files together; to launch from the Desktop, create a shortcut instead of copying the `.cmd` alone. If your browser does not open, visit `http://127.0.0.1:47621`. Keep the console window open while using Atlas.

To explore without a send option, run `Somente leitura.cmd`. Close any older Atlas window before switching modes.

### Use

1. Choose a game. Use **Refresh** to find newly installed games. **Demo game** lets you try the interface without accessing your account.
2. Search and mark achievements. Your selection is saved in this browser.
3. Click **Verify account** when you want to see real progress. This enables the **Missing** filter and **Select all missing**. For real games, Steam must be open and the game installed.
4. Review your selection. Sending requires confirmation in the interface. The queue accepts up to **60 achievements** per confirmation, runs one operation per achievement, verifies the result, and stops on uncertainty. Before confirming, choose a 15 or 30 second pause, 1, 2, or 5 minutes, a custom time (1 to 3600 seconds), or a random interval between limits you set. The first send is immediate; the wait is between attempts. Use **Stop** during the queue, including the countdown.

In the browser, choose a game, click **Verify account**, review missing achievements, and confirm only the selection you want to send. Atlas checks the account again before **each achievement**. Close the console window to stop the server.

Before each send, Atlas checks whether another Steam game is running on Windows and refuses the operation if it finds one. Close competitive games before testing. This check does not guarantee freedom from penalties.

**Local logs:** probe and send attempts are saved in `logs/atlas-events.jsonl` (up to 1 MB per file, with two older copies). Each line contains time, App ID, stage, duration, and result; achievements use a hash. Steam ID, passwords, names, and raw connector responses are not logged. The interface does not serve this file. Review it before sharing.

**Risk:** unlocking achievements may violate Steam or game rules and lead to penalties, including on your account. We do not recommend competitive online games. Fixed or random intervals do not guarantee protection from bans. Success and compatibility are not guaranteed. See [risks and reports](RISCOS-E-RELATOS.md) (Portuguese).

The project uses [SAM as a technical reference](SAM-REFERENCIA.md), without claiming ban protection.

Run `npm test` for local tests with simulated data; they do not check your account or send achievements. Atlas does not change historical unlock dates.
