# Specification - Gerenciamento de trilhas por perfil

## Objetivo

Permitir que administradores definam quais questionarios compoem a trilha de cada perfil e em qual ordem.

## Fluxo

- Admin acessa `/admin/profile-trails`.
- Admin seleciona um perfil.
- A tela mostra questionarios ja associados ao perfil em ordem.
- A tela mostra questionarios disponiveis para adicionar.
- Admin pode adicionar, remover e reordenar questionarios.
- Admin salva a ordem final.
- Apos salvar, a tela exibe mensagem informando que a trilha por perfil foi salva com sucesso.

## Criterios de aceite

- Apenas usuarios `ADMIN` podem acessar a tela.
- A ordem salva deve ser preservada pelo backend.
- Salvamento bem-sucedido deve exibir feedback visual na propria tela.
- Questionarios desativados nao devem ficar disponiveis para associacao.
- A listagem de consumo dos usuarios deve respeitar a ordem definida para o perfil do usuario.
