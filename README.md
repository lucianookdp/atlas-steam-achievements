# Atlas · Steam Achievements

A local Windows app to browse installed Steam games, review achievement progress, and unlock selected achievements. It uses your open Steam session; Atlas has no separate login.

[English](#english) · [Português](#português)

## English

1. Download and extract the [repository ZIP](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip). Keep all files together. Install [Node.js 18+](https://nodejs.org/) if needed, and open Steam.
2. Double-click **`Abrir Atlas.cmd`** inside the extracted folder. Keep the console open. If needed, open [localhost:47621](http://127.0.0.1:47621). To browse without sending, use **`Somente leitura.cmd`**. Create a shortcut if you want to launch it from the Desktop; do not move the `.cmd` file alone.
3. Choose a game, click **Verify account**, and select achievements. **Refresh** rescans installed games; **Add** accepts an App ID. Click **Unlock on Steam**, review the interval and selection, open **Learn more** for the risk notice, then confirm if you wish. Atlas handles one achievement at a time and stops on an uncertain result.

Close the console to stop Atlas. The default interval is one minute; other presets, custom times, and a random range are available. Atlas cannot set past unlock timestamps. Local logs are in `logs/atlas-events.jsonl` and should be reviewed before sharing. `npm test` runs simulated tests without accessing your Steam account.

**Risk:** Steam or game rules may prohibit this use and penalties are possible. Avoid competitive online games. No interval or tool guarantees protection from bans.

**License:** [zlib License](LICENSE.txt).

## Português

1. Baixe e extraia o [ZIP do repositório](https://github.com/lucianookdp/atlas-steam-achievements/archive/refs/heads/main.zip). Mantenha os arquivos juntos. Instale o [Node.js 18+](https://nodejs.org/) se necessário e abra a Steam.
2. Dê dois cliques em **`Abrir Atlas.cmd`** dentro da pasta extraída. Deixe o terminal aberto. Se preciso, acesse [localhost:47621](http://127.0.0.1:47621). Para navegar sem enviar, use **`Somente leitura.cmd`**. Para abrir pela Área de Trabalho, crie um atalho; não mova o `.cmd` sozinho.
3. Escolha um jogo, clique em **Verificar conta** e selecione conquistas. **Atualizar** procura jogos instalados; **Adicionar** aceita um App ID. Clique em **Desbloquear na Steam**, revise o intervalo e a seleção, abra **Ver mais** para ler o aviso de risco e confirme se desejar. O Atlas processa uma conquista por vez e para se o resultado for incerto.

Feche o terminal para encerrar. O intervalo padrão é um minuto; há tempos prontos, personalizado e aleatório. O Atlas não altera datas históricas. Os logs locais ficam em `logs/atlas-events.jsonl`; revise antes de compartilhar. `npm test` usa dados simulados e não acessa sua conta Steam.

**Risco:** regras da Steam ou do jogo podem proibir esse uso e resultar em punições. Evite jogos competitivos online. Nenhum intervalo ou ferramenta garante proteção contra banimentos.

**Licença:** [zlib License](LICENSE.txt).