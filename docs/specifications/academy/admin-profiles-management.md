# Specification - Gerenciamento administrativo de perfis

## Objetivo

Permitir que usuarios administradores cadastrem, editem e desativem perfis de usuarios.

## Fluxo

- Admin acessa `/admin/profiles`.
- A tela lista todos os perfis, incluindo desativados.
- Admin pode cadastrar um novo perfil informando nome e descricao.
- Admin pode editar nome e descricao de perfis existentes.
- Admin pode desativar um perfil apos confirmacao.

## Criterios de aceite

- Apenas usuarios `ADMIN` podem acessar a tela.
- Formulario deve usar React Hook Form e Zod.
- Perfis desativados devem continuar na listagem.
- Perfis ativos devem poder ser usados no cadastro de usuario e na associacao de trilhas.
