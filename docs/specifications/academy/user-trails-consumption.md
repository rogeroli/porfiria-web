# Specification - Consumo de trilhas por usuario

## Objetivo

Permitir que usuarios autenticados com perfis diferentes de `ADMIN` acessem as trilhas configuradas para seu perfil e consumam os questionarios publicados.

## Fluxo

- Usuario autentica e acessa o dashboard.
- Usuario com perfil diferente de `ADMIN` visualiza uma chamada para iniciar as trilhas.
- Usuario acessa `/trails`.
- A tela lista os questionarios publicados associados ao perfil do usuario.
- A navegacao entre etapas da trilha deve ficar no topo em formato de passo a passo horizontal para priorizar a area de conteudo.
- Usuario seleciona um questionario da trilha.
- Usuario so pode avancar para a proxima etapa depois de acertar todas as perguntas da etapa atual.
- Ao concluir uma etapa, somente a proxima etapa imediata deve ser liberada.
- Ao acertar uma pergunta, a tela deve exibir uma animacao breve de comemoracao no card da pergunta.
- Ao errar uma pergunta, a tela deve exibir uma animacao breve informando que o usuario precisa revisar o conteudo e responder novamente.
- Quando uma nova etapa for liberada, a tela deve informar visualmente qual etapa ficou disponivel.
- Quando todas as perguntas da etapa atual estiverem corretas e existir uma proxima etapa, a tela deve exibir o botao `PROXIMA ETAPA` abaixo do questionario, alinhado a direita.
- A tela exibe o conteudo principal do questionario conforme o formato salvo: texto, HTML, video ou PDF.
- A tela exibe os itens de quiz do questionario.
- Quiz permite selecionar uma ou mais alternativas e validar a resposta localmente.
- Perguntas com apenas uma resposta correta devem permitir somente uma alternativa selecionada.
- Caso nao exista trilha publicada para o perfil, a tela informa que ainda nao ha conteudos disponiveis.

## Criterios de aceite

- Apenas usuarios autenticados podem acessar `/trails`.
- Usuarios sem sessao devem ser redirecionados para login.
- Conteudo em texto deve preservar quebras de linha.
- Conteudo em HTML deve ser renderizado na area de conteudo.
- Conteudo em HTML deve ficar isolado para nao alterar estilos fora da area interna de conteudo.
- Conteudo em video deve ser exibido com controles.
- Conteudo em PDF deve ser exibido em visualizador incorporado.
- A tela nao deve exibir o tipo/formato do conteudo como label visual para o usuario.
- Respostas corretas e incorretas devem apresentar feedback visual sem impedir a continuidade do uso da tela.
- A mensagem de proxima etapa liberada deve aparecer somente quando todas as perguntas da etapa atual estiverem corretas.
- O botao `PROXIMA ETAPA` deve aparecer somente quando todas as perguntas da etapa atual estiverem corretas e deve levar diretamente para a etapa seguinte liberada.
- O consumo deve usar a camada de services para buscar dados da API.
- A ordem dos questionarios deve respeitar a ordem definida em trilhas por perfil.
