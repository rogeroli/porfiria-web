# Especificação: Tela de Cadastro

## Status
Aceito

## Contexto
O Porfiria Academy precisa permitir que pacientes, médicos e pesquisadores criem uma conta inicial na plataforma.

Esta tela é o primeiro fluxo integrado entre Web e API e deve consumir o endpoint público de cadastro.

## Objetivo
Permitir o cadastro de uma pessoa usuária informando nome, perfil, email, senha e confirmação de senha.

## Perfis Atendidos
- Paciente: criar conta selecionando o perfil de paciente.
- Médico: criar conta selecionando o perfil de médico.
- Pesquisador: criar conta selecionando o perfil de pesquisador.

## Escopo
- Criar rota pública `/register`.
- Criar formulário com os campos nome, perfil, email, senha e confirmar senha.
- Validar formulário com React Hook Form e Zod.
- Validar política forte de senha na Web.
- Validar se a confirmação de senha confere.
- Enviar cadastro para a API usando service.
- Redirecionar para `/` após cadastro com sucesso.
- Exibir mensagem de sucesso na página inicial após o redirecionamento.
- Exibir erros de validação e erro de email já cadastrado.

## Fora de Escopo
- Login automático após cadastro.
- Persistência de sessão.
- Redirecionamento para dashboard.
- Verificação de email.

## Fluxo da Funcionalidade
1. A pessoa acessa `/register`.
2. A pessoa informa nome, perfil, email, senha e confirmação de senha.
3. A Web valida os campos.
4. A Web envia os dados para `POST /api/auth/register`.
5. A API cria a conta.
6. A Web redireciona para `/?registered=success`.
7. A página inicial exibe uma mensagem informando que o cadastro foi realizado.

## Estados da Interface
- Estado inicial: formulário vazio.
- Estado de carregamento: botão desabilitado durante envio.
- Estado de sucesso: redirecionamento para a página inicial com mensagem de cadastro realizado.
- Estado de erro: mensagem retornada pela API ou erro genérico de comunicação.

## Regras de Negócio
- O perfil deve aceitar apenas `PATIENT`, `DOCTOR` e `RESEARCHER`.
- A senha deve ter mais de 8 caracteres.
- A senha deve conter pelo menos uma letra maiúscula.
- A senha deve conter pelo menos uma letra minúscula.
- A senha deve conter pelo menos um número.
- A senha deve conter pelo menos um caractere especial.
- A confirmação de senha deve ser igual à senha.
- O email deve ser válido.
- Componentes React não devem chamar Axios diretamente.

## Contratos com a API
### Endpoint
`POST /api/auth/register`

### Requisição
```json
{
  "name": "Maria Silva",
  "profile": "PATIENT",
  "email": "maria@example.com",
  "password": "Senha@123",
  "confirmPassword": "Senha@123"
}
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Maria Silva",
    "profile": "PATIENT",
    "email": "maria@example.com",
    "createdAt": "2026-07-07T00:00:00.000Z"
  }
}
```

### Respostas de Erro
- `400 Bad Request`: destacar campos inválidos, senha fraca ou confirmação divergente.
- `409 Conflict`: informar que o email já está cadastrado.

## Componentes Reutilizáveis
- Formulário de cadastro em `features/auth`.
- Service de autenticação em `services/auth`.
- Tipos compartilhados de autenticação.

## Acessibilidade
- Todos os campos devem possuir label.
- Mensagens de erro devem ser associadas aos campos.
- O formulário deve funcionar por teclado.
- O estado de envio deve ser anunciado visualmente.

## Responsividade
- Desktop: layout em duas colunas, com conteúdo institucional ao lado do formulário.
- Tablet: layout ajustado mantendo boa leitura.
- Mobile: layout em coluna única.

## Critérios de Aceitação
- Dado que a pessoa preenche dados válidos, quando envia o formulário, então a conta é criada na API.
- Dado que a conta é criada com sucesso, quando a API responde, então a pessoa é redirecionada para a tela inicial.
- Dado que a pessoa chega à tela inicial após cadastro, então uma mensagem informa que o cadastro foi realizado.
- Dado que a pessoa informa senha curta ou fraca, quando tenta enviar, então a Web exibe erro antes da chamada.
- Dado que a confirmação de senha é diferente, quando tenta enviar, então a Web exibe erro antes da chamada.
- Dado que a API retorna email duplicado, quando o envio falha, então a Web informa que o email já está cadastrado.
- Dado que a pessoa usa teclado, quando navega pelo formulário, então todos os campos e botões recebem foco visível.

## Testes Esperados
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## ADRs Relacionados
- `docs/adrs/0001-use-nextjs-app-router.md`
- `docs/adrs/0002-use-shadcn-tailwind-react-query-and-services.md`
