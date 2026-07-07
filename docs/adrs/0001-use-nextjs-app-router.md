# ADR-0001: Usar Next.js com App Router

## Status
Aceito

## Contexto
O frontend precisa oferecer uma experiência moderna, acessível e responsiva para diferentes perfis de uso do Porfiria Academy, mantendo uma base simples de evoluir.

Também precisamos de uma estrutura compatível com renderização eficiente, separação clara por rotas e suporte a crescimento por módulos sem acoplar todas as telas em uma única área do projeto.

## Decisão
O projeto web será implementado com Next.js, React, TypeScript e App Router.

A organização seguirá uma estrutura baseada em features, com `src/app` para rotas, `src/features` para funcionalidades, `src/components` para componentes compartilhados, `src/services` para comunicação com backend, `src/hooks`, `src/contexts`, `src/types` e `src/lib`.

## Alternativas Consideradas
- React com Vite: simples e rápido, mas exigiria definir manualmente padrões de roteamento, estrutura de aplicação e otimizações oferecidas pelo Next.js.
- Pages Router do Next.js: maduro, mas menos alinhado ao modelo atual do framework para novas aplicações.

## Consequências
- Telas e fluxos devem nascer a partir de Specifications aprovadas.
- Rotas protegidas deverão validar autenticação e redirecionar pessoas não autenticadas para Login.
- O projeto deve manter separação entre interface, estado, validação e services.
- O App Router será o padrão para novas rotas.

## Especificações Relacionadas
- Nenhuma.
