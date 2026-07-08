# Specification - Tela de confirmacao de email

## Objetivo

Permitir que o usuario confirme o email apos clicar no link recebido no cadastro.

## Fluxo

- Usuario acessa `/confirm-email?token=...`.
- A tela envia o token para a API.
- Em caso de sucesso, informa que o email foi confirmado.
- Em caso de erro, informa que o link esta invalido ou expirado.
- A tela oferece caminho para login.

## Criterios de aceite

- A tela deve funcionar em desktop, tablet e mobile.
- A chamada deve ocorrer pela camada de services.
- O estado de carregamento deve ser visivel.
- O usuario nao deve precisar estar autenticado.
