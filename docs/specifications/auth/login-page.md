# Especificação: Login e Dashboard Inicial

## Status
Aceito

## Contexto
Após realizar cadastro, a pessoa usuária precisa autenticar e acessar uma área inicial protegida da plataforma.

O backend emite um access token com validade de 30 minutos e um refresh token para renovação da sessão.

## Objetivo
Permitir login com email e senha, armazenar sessão no frontend e redirecionar a pessoa usuária para uma dashboard inicial mockada.

## Escopo
- Criar rota pública `/login`.
- Criar formulário com email e senha.
- Validar formulário com React Hook Form e Zod.
- Consumir `POST /api/auth/login` via service.
- Armazenar access token, refresh token, expiração e usuário.
- Criar rota `/dashboard` com conteúdo mockado.
- Redirecionar para `/dashboard` após login.
- Exibir menu de usuário com ações de alterar senha e logout.
- Executar logout removendo a sessão local e chamando a API quando houver refresh token.

## Fora de Escopo
- Alteração de senha funcional.
- Middleware SSR de autenticação.
- Dados reais da dashboard.
- Renovação automática silenciosa antes da expiração.

## Fluxo da Funcionalidade
1. A pessoa acessa `/login`.
2. A pessoa informa email e senha.
3. A Web envia os dados para `POST /api/auth/login`.
4. A API retorna access token, refresh token e dados públicos do usuário.
5. A Web salva a sessão localmente.
6. A pessoa é redirecionada para `/dashboard`.
7. A dashboard exibe dados mockados e menu de usuário.

## Estados da Interface
- Estado inicial: formulário vazio.
- Estado de carregamento: botão desabilitado durante envio.
- Estado de erro: mensagem da API para credenciais inválidas ou erro de comunicação.
- Estado autenticado: dashboard mockada.

## Regras de Negócio
- Access token tem validade de 30 minutos no backend.
- Refresh token deve ser preservado para renovação futura.
- Logout deve remover tokens locais.
- Dashboard sem sessão local deve redirecionar para `/login`.

## Contratos com a API
### Login
`POST /api/auth/login`

### Requisição
```json
{
  "email": "maria@example.com",
  "password": "Senha@123"
}
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "opaque-token",
    "expiresIn": 1800,
    "user": {
      "id": "uuid",
      "name": "Maria Silva",
      "profile": "PATIENT",
      "email": "maria@example.com",
      "createdAt": "2026-07-07T00:00:00.000Z"
    }
  }
}
```

## Acessibilidade
- Campos devem possuir label.
- Mensagens de erro devem ser claras.
- Ações do menu devem ser acessíveis por teclado.

## Responsividade
- Desktop: layout em duas colunas.
- Mobile: layout em coluna única.
- Dashboard deve se adaptar em grid responsivo.

## Critérios de Aceitação
- Dado um usuário cadastrado, quando informa email e senha corretos, então é redirecionado para `/dashboard`.
- Dado credenciais inválidas, quando tenta login, então a tela exibe erro.
- Dado usuário sem sessão local, quando acessa `/dashboard`, então é redirecionado para `/login`.
- Dado usuário autenticado, quando clica em logout, então a sessão local é removida e ele volta para `/login`.

## Testes Esperados
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## ADRs Relacionados
- `docs/adrs/0001-use-nextjs-app-router.md`
- `docs/adrs/0002-use-shadcn-tailwind-react-query-and-services.md`
