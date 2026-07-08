# Specification - Tela de esqueci senha

## Objetivo

Permitir que o usuario solicite recuperacao de senha informando o email cadastrado.

## Fluxo

- Usuario acessa `/forgot-password`.
- Usuario informa o email.
- A web envia a solicitacao para a API.
- A API retorna mensagem generica, sem expor se o email existe.
- A tela orienta o usuario a verificar o email.

## Criterios de aceite

- O formulario deve usar React Hook Form e Zod.
- A chamada deve ocorrer pela camada de services.
- A resposta deve ser generica para reduzir enumeracao de contas.
- A tela deve manter o padrao visual do login.
