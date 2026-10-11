# Atlas — protótipo de conquistas Steam

Versão experimental para Windows. Permite selecionar e consultar conquistas pela Steam. **Inicia em modo somente leitura**, sem envio de desbloqueios. O conector externo de envio continua no código para testes optativos, com ativação local explícita. **O uso é por conta e risco da pessoa usuária; não há garantia contra banimentos nem de compatibilidade com todos os jogos.**

## Iniciar

1. Use a sessão Steam que já está aberta no computador. O Atlas não tem tela de login e não pede usuário, senha ou código. Para consultar ou alterar conquistas da conta, a Steam precisa estar aberta e autenticada; o jogo precisa estar instalado pela Steam.
2. Dê dois cliques em `start.cmd`. Nesta versão de desenvolvimento, é necessário ter Node.js 18 ou superior instalado. O inicializador também aceita um `node.exe` portátil colocado em `runtime/` para uma futura distribuição sem instalação.
3. O navegador deve abrir automaticamente. Acesse `http://127.0.0.1:47621` se não abrir.
4. Escolha o jogo, clique em **Verificar conta** e selecione conquistas para revisar ou exportar. O botão **Desbloquear na Steam** fica desativado no modo padrão.

O servidor escuta apenas em `127.0.0.1` e não instala pacotes. **Consultar Steam** usa a API pública, envia apenas o App ID, não usa senha ou chave de API, aplica intervalo mínimo de 3 segundos entre consultas e guarda o resultado em memória por 24 horas. **Verificar conta** e **Desbloquear na Steam** usam a sessão já aberta no aplicativo Steam. O Atlas não inicia a Steam automaticamente. Feche a janela do terminal para encerrar.

## O que já funciona

- Detecta jogos instalados pelas bibliotecas locais da Steam.
- Lê automaticamente nomes, descrições e conquistas ocultas do cache local `UserGameStatsSchema_<AppID>.bin`, quando disponível.
- Permite adicionar um jogo por App ID e importar um catálogo JSON.
- Permite consultar, sob demanda, a API pública da Steam. A resposta contém IDs e percentuais globais, que podem não incluir nomes e descrições legíveis.
- Permite buscar, filtrar, selecionar, limpar e exportar a seleção para JSON.
- Interface compacta e adaptável, organizada em Biblioteca, Conquistas e Seleção, com tema grafite e azul discreto, ícone de troféu próprio e rodapé com link para o GitHub do autor. Em janelas estreitas, os painéis se empilham sem rolagem horizontal.
- Verifica o estado real das conquistas pela API local Steamworks do jogo instalado. Confere o App ID devolvido pela Steam e identifica a conta ativa antes de ler ou enviar. Conquistas já desbloqueadas são identificadas e ignoradas no envio.
- O conector experimental envia **uma conquista por confirmação** por `SetAchievement` e `StoreStats`, após ativação local e confirmação explícita na interface. Exige uma verificação da mesma conta nos cinco minutos anteriores; ela é consumida pelo envio. A seleção e a exportação podem conter várias conquistas. Não altera estatísticas do jogo nem remove conquistas.
- Após um envio aceito, lê novamente o estado da mesma conta e do mesmo jogo. Mostra **confirmada** se a conquista aparecer desbloqueada, **ainda pendente** se continuar bloqueada após uma segunda consulta, ou **resultado não confirmado** se a releitura falhar. Antes de outro envio, exige nova verificação da conta.
- Guarda catálogos importados e seleções no armazenamento local do navegador.
- Inclui um jogo de demonstração para experimentar a interface.
- Oferece atalhos para Mad Max, Baldur's Gate 3, Divinity: Original Sin 2 e Cyberpunk 2077 como exemplos de uso. Os atalhos não indicam que esses jogos foram avaliados como seguros.

O JSON importado pode ser um array de objetos `{ "id": "ID", "name": "Nome", "description": "Descrição" }`, um objeto com campo `achievements`, ou uma resposta `GetSchemaForGame` da Steam.

## Limites desta versão

- O desbloqueio só fica disponível quando a pessoa inicia `node server.js` com `ATLAS_ENABLE_EXPERIMENTAL_WRITES=1`, **Verificar conta** conclui com sucesso e há uma seleção. O botão fica indisponível para o jogo de demonstração. `start.cmd` sempre limpa a opção e inicia em modo somente leitura.
- O conector atual requer Windows, uma sessão Steam aberta, jogo instalado e `steam_api64.dll` ou `steam_api.dll` em um dos locais comuns da instalação. Alguns jogos usam versões ou locais diferentes, ou administram conquistas no servidor; nesses casos a operação pode falhar.
- `StoreStats` informa que a solicitação foi aceita localmente. A releitura automática confirma o estado retornado pela API local naquele momento; confira também o perfil Steam. O aplicativo não promete que a conquista aparecerá nem que o jogo aceitará a alteração.
- Só detecta automaticamente jogos instalados. Jogos fora da instalação podem ser adicionados por App ID.
- O cache de conquistas pode não existir para todos os jogos. Nesses casos, use **Consultar Steam** ou a importação JSON. A consulta pública pode falhar ou não retornar conquistas para alguns jogos.
- **Uso por conta e risco da pessoa usuária.** O desbloqueio poderá resultar em punições no jogo ou na conta Steam. O projeto não promete evitar banimentos nem garante segurança para qualquer jogo.
- O uso em jogos competitivos online não é recomendado. A interface não bloqueia jogos específicos: permite selecionar e exportar conquistas de qualquer App ID cujo catálogo esteja disponível.
- Antes de cada envio, a interface apresenta o aviso e exige confirmação explícita. Um aviso não impede punições nem substitui a avaliação dos riscos pela pessoa usuária.
- Risco de punição aplicada pelo jogo deve ser considerado separadamente. Um *game ban* pode aparecer na conta Steam; portanto, a distinção não pode ser feita apenas pelo nome do banimento.
- Nenhum programa pode prometer risco zero de banimento. As regras da Steam e de cada jogo podem afetar o resultado.
- O [Acordo de Assinatura da Steam, seção 4](https://store.steampowered.com/subscriber_agreement/) restringe trapaças e automação e prevê restrição ou encerramento de conta ou assinatura em certas violações. Um teste bem-sucedido não significa autorização da Valve nem risco zero.
- No teste controlado de Zup! 8 (App ID 799070), uma conquista pendente foi enviada com o jogo fechado e apareceu desbloqueada em uma nova leitura. Isso valida esse caso específico; não estabelece segurança para a conta nem compatibilidade com outros jogos.
- A [Steamworks](https://partner.steamgames.com/doc/api/ISteamUserStats) oferece leitura do horário de desbloqueio, mas `SetAchievement` não aceita um horário arbitrário. Este projeto não altera datas históricas de conquistas.

## Como o aplicativo deve funcionar sem ocultar sua atividade

O Atlas roda como uma interface local no navegador, com servidor ligado somente a `127.0.0.1`. Ele lê arquivos de instalação e cache da Steam. A operação de desbloqueio roda em um processo separado e usa a biblioteca Steamworks de 64 bits instalada com o jogo. Ela não pede senha, não inicia o jogo, não injeta código no processo do jogo, não troca DLLs e não tenta contornar sistemas de proteção. O servidor exige JSON e recusa origens de navegador diferentes da interface local.

Nenhum jogo tem seleção ou exportação bloqueada por categoria. O aviso de risco fica visível na interface, inclusive para jogos competitivos online. O conector não garante suporte universal. Código aberto e execução transparente ajudam a auditar o comportamento, mas não garantem ausência de punição.

## Mod do jogo e conector externo

O método testado com Zup! 8 é uma **ferramenta externa** que usa a DLL Steamworks do jogo. Ele não é um mod carregado pelo jogo. A [documentação do Steam Workshop](https://partner.steamgames.com/doc/features/workshop) descreve integrações que dependem de o próprio jogo aceitar conteúdo ou mods; isso não cria uma permissão universal para desbloquear conquistas. Chamar o conector externo de “mod” não muda seu funcionamento ou seus riscos.

Uma futura integração classificada como **mod do jogo** deverá usar um caminho de modificação suportado por aquele jogo, operar dentro dele e informar quais APIs e permissões usa. Isso exige implementação e avaliação por jogo. Mesmo um mod aceito pelo jogo não é garantia de ausência de punição da Steam ou de serviços de terceiros.

### Ativação experimental do envio

Para testes deliberados, abra um terminal na pasta do projeto e execute `set ATLAS_ENABLE_EXPERIMENTAL_WRITES=1` seguido de `node server.js` no mesmo terminal. No PowerShell, use `$env:ATLAS_ENABLE_EXPERIMENTAL_WRITES='1'` seguido de `node server.js`. O servidor só lê essa opção ao iniciar. Desative fechando o servidor e abrindo normalmente com `start.cmd`. A confirmação de risco continua obrigatória para cada envio.

### Referência específica: Cyberpunk 2077

O [Achievement Unlocker](https://www.nexusmods.com/cyberpunk2077/mods/12183) indicado pelo usuário exige Cyber Engine Tweaks, funciona dentro do jogo e oferece desbloqueio individual ou total. Seu código chama o sistema de conquistas do próprio Cyberpunk. A página do Nexus o classifica com a tag “Cheating”. Ele serviu apenas para análise de funcionamento; **o Atlas não depende dele nem de uma engine de mod**. A página informa que modificações nos arquivos do autor exigem permissão.

## Ideias aproveitadas do SAM

O [Steam Achievement Manager](https://github.com/gibbed/SteamAchievementManager) separa a escolha do jogo da gestão de conquistas. Ele lê o schema de conquistas no cache local, consulta o estado na Steam e permite marcar ou desmarcar conquistas e editar estatísticas antes de gravar as alterações. O Atlas usa a ideia de leitura local do catálogo e seleção revisável. Como proteção inspirada na verificação de jogo do SAM, o conector agora compara o App ID real retornado pela Steam com o selecionado. Também compara a conta ativa com a da verificação imediatamente anterior, limita o envio a uma conquista e inicia sempre em modo somente leitura.

O SAM é distribuído sob [licença zlib](https://github.com/gibbed/SteamAchievementManager/blob/master/LICENSE.txt), que permite uso e modificação do código com preservação dos avisos exigidos. Esta versão do Atlas implementa seu próprio conector e não incorpora arquivos de código do SAM.

## Arquivos

Execute `npm test` para verificar parsing de schema, validação de envio, proteção HTTP, releitura e cache com dados simulados. A suíte força o modo somente leitura e não consulta a sessão Steam, não acessa a conta e não envia conquistas.

- `server.js`: servidor local e descoberta de jogos.
- `steam-schema.js`: leitura do cache binário de conquistas.
- `steam-native.js`, `steam-native.ps1`: conector local Steamworks, isolado por processo.
- `verify-unlock.js`: confirmação por releitura após cada envio.
- `index.html`, `styles.css`, `app.js`: interface.
- `start.cmd`: inicializador Windows.
- `RISCOS-E-RELATOS.md`: fontes oficiais e relatos de fóruns, separados por tipo de punição.

## Base técnica

A [documentação da Steamworks](https://partner.steamgames.com/doc/api/ISteamUserStats) descreve `GetAchievement`, `SetAchievement` e `StoreStats`. O [cabeçalho oficial da API plana](https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/public/steam/steam_api_flat.h) lista as funções usadas pelo conector. A leitura e o envio foram implementados neste projeto; nenhum código do SAM ou do mod citado foi copiado.
