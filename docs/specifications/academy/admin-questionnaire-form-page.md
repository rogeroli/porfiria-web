# Specification - Gestao administrativa de questionarios

## Objetivo

Permitir que usuarios administradores gerenciem questionarios educacionais com conteudo principal e itens de quiz.

## Fluxo

- Administrador visualiza no dashboard uma chamada evidente para `Gerenciar questionarios`.
- Administrador acessa `/admin/questionnaires` para listar questionarios existentes.
- Administrador pode criar um novo questionario em `/admin/questionnaires/new`.
- Administrador pode editar um questionario existente em `/admin/questionnaires/:id`.
- Cria o questionario informando titulo, descricao, formato do conteudo e conteudo.
- O conteudo pode ser informado como texto, HTML, upload de video ou upload de PDF.
- O formato do conteudo deve ser salvo junto com o questionario.
- Uploads de video ou PDF devem exibir o arquivo selecionado antes de salvar e estado de carregamento durante o envio.
- Ao salvar conteudo em video ou PDF, a tela deve exibir loading central ate a API retornar sucesso ou erro.
- O botao de gravacao do formulario deve sempre exibir `Salvar`.
- Apos criar ou editar um questionario, administrador deve ser redirecionado para `/admin/questionnaires`.
- A listagem deve exibir mensagem informando que o questionario foi criado ou editado com sucesso.
- O questionario nasce como rascunho.
- Apos criar ou abrir o questionario, o administrador pode adicionar itens de quiz.
- Item quiz possui uma pergunta, alternativas e uma ou mais respostas corretas.
- Na edicao, administrador pode alterar a ordem dos itens/perguntas do questionario enquanto ela nao estiver desativada.
- Administrador pode publicar o questionario depois que existir ao menos um item, exceto quando o questionario estiver desativado.
- Depois de publicar um questionario, administrador deve ser redirecionado para `/admin/questionnaires`.
- Administrador pode desativar um questionario pela listagem, apos confirmacao.
- Questionarios desativados continuam aparecendo na listagem administrativa.

## Criterios de aceite

- A tela deve estar disponivel apenas para usuario com role `ADMIN`.
- A tela deve usar services para comunicacao com API.
- Formularios devem usar React Hook Form e Zod.
- Usuario sem sessao ou sem role admin deve ser redirecionado para dashboard ou login.
- Erros de publicacao devem aparecer na propria tela, sem abrir overlay de erro runtime.
- Dashboard de usuario `ADMIN` deve exibir a opcao `Gerenciar questionarios` de forma evidente.
- Listagem administrativa deve exibir labels coloridas para `Publicada`, `Rascunho` e `Desativada`.
- A associacao com perfis deve ocorrer na tela de trilhas por perfil.
