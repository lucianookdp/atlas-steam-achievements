# Riscos e relatos sobre desbloqueio de conquistas

Pesquisa feita em 10 de outubro de 2026. Relatos de fóruns são evidência limitada: nem sempre é possível verificar o motivo real de uma punição ou separar o uso de um gerenciador de conquistas de outras atividades da conta.

## O que foi encontrado

| Tipo | Evidência | O que permite concluir |
| --- | --- | --- |
| Banimento ligado a um jogo/comunidade | [Relato em primeira pessoa no fórum de PAYDAY 2](https://www.reddit.com/r/paydaytheheist/comments/nbgbj2/): usuário afirma ter perdido acesso a recursos online, ao grupo e às discussões após usar SAM para desbloquear todas as conquistas; depois relatou reversão do bloqueio. | Houve uma alegação concreta de punição ligada ao jogo/comunidade. Não comprova banimento geral da Steam nem isola tecnicamente a causa. |
| Rankings de terceiros | [Relato no fórum Exophase](https://forums.exophase.com/threads/removal-of-restrictions.69546/): usuário afirma ter perdido posições em rankings após usar SAM em um jogo; administrador confirmou reintegração no Exophase e disse que outra plataforma exigia recurso separado. A [política do TrueSteamAchievements](https://truesteamachievements.com/help/cheatpolicy) prevê excluir de rankings quem usa software para obter conquistas sem jogar. | Esses serviços podem punir o perfil **neles**. Eles não são a Steam e não controlam a conta Steam. |
| VAC/conta Steam | [Discussão no repositório do SAM](https://github.com/gibbed/SteamAchievementManager/issues/169): o mantenedor respondeu que não é a Valve e não pode garantir ausência de VAC ban. [Outra discussão](https://github.com/gibbed/SteamAchievementManager/issues/82) cita uma suposta resposta de suporte, sem constituir política pública verificável. Fóruns Steam contêm respostas contraditórias. | Esta pesquisa não encontrou prova verificável de banimento geral da conta Steam causado **somente** pelo desbloqueio via SAM. Também não encontrou garantia oficial de que isso nunca ocorrerá. |

## Regras e conclusão para o Atlas

O [Acordo de Assinatura da Steam, seção 4](https://store.steampowered.com/subscriber_agreement/) restringe trapaças e automação e prevê medidas sobre conta ou assinatura. A [documentação do Steam Workshop](https://partner.steamgames.com/doc/features/workshop) descreve mods integrados pelos jogos; ela não transforma toda ferramenta externa em mod nem autoriza universalmente alterar conquistas.

O teste do Atlas com **uma** conquista de Zup! 8 mostrou que o envio pela API Steamworks funcionou com o jogo fechado. Não mede a chance de punição futura. Por isso, o projeto inicia em **modo somente leitura**, identifica o método externo com clareza e não promete segurança para a conta.
