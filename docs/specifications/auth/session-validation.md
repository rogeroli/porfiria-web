# Specification - Validacao de sessao autenticada

## Objetivo

Garantir que paginas autenticadas validem a sessao contra a API e renovem o access token quando possivel.

## Fluxo

- Dashboard le a sessao local somente apos montar no cliente.
- Dashboard chama `/auth/me` antes de exibir dados autenticados.
- Se `/auth/me` retornar `401`, a camada HTTP tenta renovar a sessao com refresh token.
- Se a renovacao funcionar, a chamada original e repetida.
- Se a renovacao falhar, a sessao local e removida e o usuario volta para login.

## Criterios de aceite

- A validacao deve ocorrer pela camada de services.
- O refresh automatico deve ser transparente para componentes.
- Sessao invalida deve limpar `localStorage`.
- Usuario `PENDING` deve ser redirecionado para login com mensagem de confirmacao de email.
