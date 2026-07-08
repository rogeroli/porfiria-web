# Specification - Tela de troca obrigatoria de senha

## Objetivo

Obrigar usuarios com status `CHANGE_PASSWORD` a criarem uma nova senha antes de usar a plataforma.

## Fluxo

- Usuario realiza login com senha temporaria.
- A sessao retorna `mustChangePassword`.
- A web redireciona para `/change-password`.
- Usuario informa email, senha temporaria, nova senha e confirmacao.
- A nova senha deve cumprir a politica de senha forte.
- Apos sucesso, a sessao e atualizada e o usuario segue para dashboard.

## Criterios de aceite

- O formulario deve usar React Hook Form e Zod.
- A validacao de senha deve ocorrer na web antes de enviar.
- A chamada deve ocorrer pela camada de services.
- Usuario sem sessao deve ser redirecionado para login.
