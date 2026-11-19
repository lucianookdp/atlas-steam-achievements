# Atlas · Steam Achievements

A local Windows app to see your achievement progress across your installed Steam
games, and to fix achievements a game failed to grant.

[English](#english) · [Português](#português)

## English

### Why it exists

Achievements break. A trigger never fires because of a bug, a patch resets them,
progress made offline or in another save never syncs, or a mod blocks them. Atlas
gives you a clear view of what is missing in each game and lets you restore those
achievements yourself, one at a time, instead of replaying hours of a game.

It is also useful for developers testing achievements in their own Steamworks
games.

### What it does

- Lists the Steam games installed on this PC, with search, plus any game you add by App ID.
- Shows every achievement in a game, which ones you have, which are pending, and
  how rare each one is (global unlock percentage from Steam's public data).
- Unlocks the achievements you select, one at a time, and checks each one with
  Steam before moving on. It stops if a result is uncertain.

### How it works, and what it does not do

- Runs only on your PC: a small local server on `127.0.0.1:47621` that rejects
  requests from any other origin. No account, no login, no data sent anywhere.
- Uses your open Steam session and the game's own `steam_api64.dll`, calling
  the official Steamworks functions (`SetAchievement` and `StoreStats`).
  Nothing is patched or injected into a running game.
- Does not change unlock dates, does not touch stats, playtime or inventory.
- **Read-only mode** (`Somente leitura.cmd`) opens the same interface with
  unlocking switched off, if you only want to track progress.
- Every action is logged locally in `logs/atlas-events.jsonl`.

### Getting started

1. Download and extract the [repository ZIP](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip),
   keeping all files together. Install [Node.js 18+](https://nodejs.org/) if needed, and open Steam.
2. Double-click **`Abrir Atlas.cmd`** (or **`Somente leitura.cmd`** for read-only).
   Keep the console open; the app opens at [127.0.0.1:47621](http://127.0.0.1:47621).
3. Pick a game, click **Verify account** to load your progress, select the
   achievements you want to restore and click **Unlock on Steam**. Review the
   selection and the interval between unlocks, then confirm.

Close the console to stop Atlas. `npm test` runs the test suite on simulated
data, without touching your Steam account.

### Use it responsibly

Use Atlas on your own account to recover progress, not to show achievements you
did not earn. Some games and Steam's rules do not allow changing achievements,
and penalties are possible, so stay away from competitive and online-ranked
games. No tool can guarantee there will be no consequences.

**License:** [zlib License](LICENSE.txt).

## Português

### Por que existe

Conquistas quebram. Um gatilho não dispara por bug, uma atualização zera o
progresso, o que você fez offline ou em outro save não sincroniza, ou um mod
bloqueia tudo. O Atlas mostra com clareza o que falta em cada jogo e deixa você
recuperar essas conquistas, uma por vez, sem precisar jogar horas de novo.

Também serve para desenvolvedores testarem as conquistas dos próprios jogos na Steamworks.

### O que faz

- Lista os jogos da Steam instalados no PC, com busca, e jogos adicionados pelo App ID.
- Mostra todas as conquistas de um jogo, quais você tem, quais faltam e o quanto
  cada uma é rara (porcentagem global, dos dados públicos da Steam).
- Desbloqueia as conquistas que você escolher, uma por vez, e confere cada uma
  com a Steam antes de seguir. Para se o resultado for incerto.

### Como funciona, e o que não faz

- Roda só no seu PC: um servidor local em `127.0.0.1:47621` que recusa pedidos
  de qualquer outra origem. Sem conta, sem login, nada é enviado para fora.
- Usa a sua sessão aberta da Steam e o próprio `steam_api64.dll` do jogo, com as
  funções oficiais da Steamworks (`SetAchievement` e `StoreStats`). Nada é
  alterado ou injetado em um jogo aberto.
- Não muda datas de desbloqueio, nem estatísticas, horas jogadas ou inventário.
- **Modo somente leitura** (`Somente leitura.cmd`): a mesma tela, com o
  desbloqueio desligado, para só acompanhar o progresso.
- Cada ação fica registrada localmente em `logs/atlas-events.jsonl`.

### Como usar

1. Baixe e extraia o [ZIP do repositório](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip),
   mantendo os arquivos juntos. Instale o [Node.js 18+](https://nodejs.org/) se necessário e abra a Steam.
2. Dê dois cliques em **`Abrir Atlas.cmd`** (ou **`Somente leitura.cmd`**).
   Deixe o terminal aberto; o app abre em [127.0.0.1:47621](http://127.0.0.1:47621).
3. Escolha um jogo, clique em **Verificar conta** para carregar seu progresso,
   selecione as conquistas que quer recuperar e clique em **Desbloquear na Steam**.
   Revise a seleção e o intervalo entre desbloqueios e confirme.

Feche o terminal para encerrar. `npm test` roda os testes com dados simulados,
sem acessar sua conta Steam.

### Use com responsabilidade

Use o Atlas na sua própria conta para recuperar progresso, não para exibir
conquistas que você não fez. Alguns jogos e as regras da Steam não permitem
alterar conquistas, e punições são possíveis, então evite jogos competitivos e
com ranking online. Nenhuma ferramenta garante que não haverá consequências.

**Licença:** [zlib License](LICENSE.txt).
