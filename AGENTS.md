# AGENTS.md

# Porfiria Academy - Frontend

## Objetivo

Este repositório contém a aplicação web do Porfiria Academy.

O objetivo é oferecer uma experiência moderna, acessível e responsiva para pacientes, médicos, pesquisadores e administradores.

A aplicação deve ser simples de manter, escalável e possuir boa experiência de usuário.

---

# Princípios

Antes de implementar qualquer tela:

1. Leia a Specification.
2. Entenda o fluxo da funcionalidade.
3. Identifique componentes reutilizáveis.
4. Só então implemente.

Nunca criar telas sem Specification.

---

# Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- React Hook Form
- Zod
- Axios

---

# Organização

Utilizar estrutura baseada em features.

Exemplo:

src/

app/

components/

features/

hooks/

services/

contexts/

types/

lib/

---

# Componentes

Criar componentes pequenos.

Evitar componentes com muitas responsabilidades.

Quando necessário, dividir componentes.

Preferir composição.

---

# Comunicação

Toda comunicação com backend deve ocorrer através da camada Services.

Nunca realizar chamadas HTTP diretamente em componentes React.

---

# Formulários

Sempre utilizar:

React Hook Form

+

Zod

Nunca realizar validações complexas manualmente.

---

# Estado

Para dados remotos:

React Query.

Para estado global:

Context API.

Evitar estados globais desnecessários.

---

# UI

Utilizar componentes do Shadcn sempre que possível.

Preferir Tailwind.

Evitar CSS customizado.

Evitar bibliotecas de componentes adicionais sem necessidade.

---

# Layout

Toda interface deve funcionar em:

Desktop

Tablet

Mobile

Responsividade faz parte da implementação.

---

# Rotas

Rotas protegidas devem validar autenticação.

Usuários não autenticados devem ser redirecionados para Login.

---

# Código

Não utilizar "any".

Priorizar legibilidade.

Evitar duplicação.

Componentes devem possuir responsabilidade única.

---

# Performance

Evitar renders desnecessários.

Lazy Loading quando fizer sentido.

Memoização apenas quando houver ganho real.

---

# Acessibilidade

Utilizar HTML semântico.

Sempre utilizar labels em formulários.

Garantir navegação por teclado.

---

# Qualidade

Sempre executar:

npm run lint

npm run build

antes de concluir qualquer implementação.

---

# Documentação

Toda tela implementada deve possuir Specification correspondente.

Nunca implementar funcionalidades sem Specification.

---

# Commits

Utilizar Conventional Commits.

Exemplos:

feat(login): create login page

fix(home): adjust responsive layout

refactor(profile): simplify form

---

# Pull Requests

Toda Pull Request deve:

seguir Specification

compilar

passar no lint

manter padrão visual

---

# Objetivo Final

O frontend deve permanecer consistente, reutilizável, acessível e preparado para crescer juntamente com os próximos módulos do Porfiria Academy.