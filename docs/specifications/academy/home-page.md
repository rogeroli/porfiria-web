# Especificação: Página Inicial Institucional

## Status
Aceito

## Contexto
O frontend do Porfiria Academy precisa de uma primeira página para apresentar o objetivo do sistema antes do desenvolvimento dos fluxos autenticados.

A página deve seguir a identidade visual observada no site público da Porfiria Brasil, usando verde como cor principal, azul escuro como cor institucional, Montserrat como fonte e composição baseada em navegação simples, hero e blocos de conteúdo.

## Objetivo
Apresentar o Porfiria Academy como uma plataforma educacional para apoiar pacientes, médicos, pesquisadores e administradores na jornada de conhecimento, diagnóstico, acompanhamento e colaboração sobre porfirias.

## Perfis Atendidos
- Pacientes: entender que a plataforma oferecerá conteúdos e orientação educacional.
- Médicos: identificar o espaço como base de atualização, cursos e apoio à prática clínica.
- Pesquisadores: perceber oportunidades de colaboração, produção científica e comunidade.
- Administradores: reconhecer uma base preparada para gestão dos próximos módulos.

## Escopo
- Página inicial pública em `/`.
- Conteúdo institucional do sistema.
- Navegação superior simples.
- Hero com mensagem principal.
- Blocos resumindo pilares do sistema.
- Chamada para o futuro fluxo de login.

## Fora de Escopo
- Login funcional.
- Cadastro funcional.
- Listagem real de cursos.
- Consumo de API.
- Rotas protegidas.

## Fluxo da Funcionalidade
1. A pessoa acessa `/`.
2. A página apresenta a marca e a proposta do Porfiria Academy.
3. A pessoa visualiza os pilares do sistema.
4. A pessoa encontra a chamada para acessar a plataforma, que será implementada no próximo fluxo.

## Estados da Interface
- Estado inicial: página renderizada com conteúdo institucional.
- Estado de carregamento: não aplicável nesta etapa.
- Estado de sucesso: conteúdo visível.
- Estado de erro: não aplicável nesta etapa.
- Estado vazio: não aplicável nesta etapa.

## Regras de Negócio
- A página não deve depender de autenticação.
- A página não deve realizar chamadas HTTP.
- A página deve deixar claro que a plataforma será usada para educação, comunidade, acompanhamento e gestão.

## Contratos com a API
Não há contratos com a API nesta etapa.

## Componentes Reutilizáveis
- Estrutura de navegação pública.
- Cards de pilares.
- Bloco de chamada para ação.

## Acessibilidade
- Utilizar HTML semântico.
- Garantir contraste adequado.
- Usar textos claros em links e botões.
- Garantir navegação por teclado nos links.

## Responsividade
- Desktop: hero em duas colunas e cards em grade.
- Tablet: hero adaptado e grade com duas colunas quando houver espaço.
- Mobile: conteúdo em uma coluna, navegação simplificada e CTAs empilhados.

## Critérios de Aceitação
- Dado que a pessoa acessa `/`, quando a página carrega, então ela visualiza a descrição do Porfiria Academy.
- Dado que a pessoa usa um dispositivo mobile, quando acessa a página, então o conteúdo permanece legível e sem sobreposição.
- Dado que a pessoa navega por teclado, quando passa pelos links, então o foco fica visível.
- Dado que a página inicial é pública, quando renderizada, então nenhuma chamada HTTP é realizada.

## Testes Esperados
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## ADRs Relacionados
- `docs/adrs/0001-use-nextjs-app-router.md`
- `docs/adrs/0002-use-shadcn-tailwind-react-query-and-services.md`
