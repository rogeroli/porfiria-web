# ADR-0002: Usar Shadcn UI, Tailwind, React Query e Services

## Status
Aceito

## Contexto
O frontend precisa manter consistência visual, acessibilidade, responsividade e integração previsível com a API.

Também é necessário evitar chamadas HTTP diretas em componentes React, manter formulários consistentes e padronizar o tratamento de dados remotos.

## Decisão
O projeto usará Tailwind CSS para estilos, Shadcn UI como base de componentes, React Query para dados remotos, Axios na camada de services, React Hook Form para formulários e Zod para validação.

Toda comunicação com backend deve passar por `src/services`. Componentes React não devem chamar Axios diretamente.

## Alternativas Consideradas
- Biblioteca de componentes completa: aceleraria algumas telas, mas reduziria controle visual e poderia criar dependências desnecessárias.
- Fetch direto em componentes: simples no início, mas espalha detalhes HTTP pela interface e dificulta testes e manutenção.
- Validação manual de formulários: reduz dependências, mas aumenta duplicação e inconsistência.

## Consequências
- Componentes devem permanecer pequenos e compostos.
- Formulários devem usar React Hook Form com schemas Zod.
- Dados remotos devem ser coordenados com React Query.
- A camada de services será a fronteira padrão para comunicação com a API.

## Especificações Relacionadas
- Nenhuma.
