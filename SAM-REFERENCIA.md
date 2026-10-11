# Referência técnica: Steam Achievement Manager

O [Steam Achievement Manager (SAM)](https://github.com/gibbed/SteamAchievementManager) é uma referência de arquitetura para o Atlas, **não uma garantia contra banimentos**. O repositório não implementa um mecanismo de proteção contra VAC ou punições da Steam.

## Como o SAM opera

- Requer o cliente Steam aberto e uma sessão autenticada; não pede senha na própria interface ([README](https://github.com/gibbed/SteamAchievementManager/blob/master/README.md)).
- Define o App ID, carrega `steamclient.dll` da instalação da Steam, cria uma conexão com o usuário já aberto e verifica o App ID retornado ([Client.cs](https://github.com/gibbed/SteamAchievementManager/blob/master/SAM.API/Client.cs), [Steam.cs](https://github.com/gibbed/SteamAchievementManager/blob/master/SAM.API/Steam.cs)).
- Lê o estado das conquistas, aplica mudanças selecionadas e chama `StoreStats` ([Manager.cs](https://github.com/gibbed/SteamAchievementManager/blob/master/SAM.Game/Manager.cs)). O SAM pode aplicar várias alterações antes de uma gravação.

## Decisões para o Atlas

- Manter sessão Steam local, checagem do App ID e identificação da conta antes de qualquer escrita.
- Manter uma conquista por operação, com releitura depois de cada envio, como solicitado para o Atlas.
- Não bloquear envios com base na lista de processos do Windows; a verificação anterior gerava falso positivo. O usuário decide quando testar e deve revisar os jogos abertos.
- Preservar logs locais sem Steam ID, senha ou respostas brutas.
- Avaliar um conector baseado em `steamclient64.dll` em implementação separada e desativada por padrão. O conector atual usa a DLL Steamworks do jogo; trocar o backend sem validação pode quebrar a leitura ou a gravação. A migração só deve substituir o conector atual depois de testes locais, com o usuário controlando qualquer teste real.

Nem o SAM nem o Atlas alteram as regras da Steam ou asseguram ausência de banimento. A [documentação do VAC](https://help.steampowered.com/en/faqs/view/571A-97DA-70E9-FF74) não oferece uma exceção para gerenciadores de conquistas.
