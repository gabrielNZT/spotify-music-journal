# **Documento de Requisitos de Produto: Agregador Musical Pessoal**

* **Versão:** 1.1
* **Data:** 13 de julho de 2025
* **Autor:** Vitor Gabriel Nunes Cesarino

## 1. Visão Geral e Objetivos Estratégicos

### 1.1. Visão do Produto
Criar uma plataforma web/mobile que enriquece a experiência de audição do Spotify, permitindo que os usuários organizem, anotem e redescubram suas músicas favoritas de maneira pessoal e significativa. O produto não substitui o Spotify, mas atua como uma camada de curadoria pessoal sobre ele.

### 1.2. Objetivos Estratégicos
* **Engajamento:** Aumentar o engajamento do usuário com sua própria biblioteca musical, transformando a audição passiva em uma experiência ativa de curadoria.
* **Retenção:** Criar um "cofre" de valor pessoal (comentários, categorias, histórico) que incentive o uso contínuo da plataforma.
* **Diferenciação:** Oferecer funcionalidades de organização e anotação que não existem nativamente no Spotify.

## 2. Requisitos Gerais do Sistema

Esta seção descreve os Requisitos Não-Funcionais (RNFs) que são aplicáveis a toda a plataforma, servindo como princípios norteadores para o design e desenvolvimento.

### 2.1. Requisitos Não-Funcionais Globais

* **RNF-G-01: Responsividade de Interface (Responsive Design)**
    * **Descrição:** A aplicação deve ser totalmente responsiva, proporcionando uma experiência de visualização e interação otimizada em uma vasta gama de dispositivos, desde smartphones (telas pequenas) até monitores desktop (telas grandes). O layout, a navegação e o conteúdo devem se adaptar de forma fluida à resolução, ao tamanho e à orientação da tela do dispositivo do usuário.
    * **Critérios de Aceite:**
        * **Abordagem Mobile-First:** O desenvolvimento deve priorizar a experiência em dispositivos móveis como base, expandindo e adaptando a interface para telas maiores subsequentemente.
        * **Pontos de Interrupção (Breakpoints):** O layout deve se ajustar em pontos de interrupção (breakpoints) padrão para garantir a melhor apresentação em:
            * **Mobile:** Largura de tela < 768px
            * **Tablet:** Largura de tela entre 768px e 1024px
            * **Desktop:** Largura de tela > 1024px
        * **Legibilidade e Interação:** Em nenhum dispositivo o usuário deve precisar usar zoom horizontal para ler o conteúdo. Todos os elementos interativos (botões, links, campos de formulário) devem ter um tamanho e espaçamento adequados para serem facilmente tocados em telas sensíveis ao toque.
        * **Navegação Adaptativa:** Em telas menores (mobile), o menu de navegação principal deve ser colapsado em um menu "hambúrguer" ou padrão similar.
        * **Conteúdo Fluido:** Layouts em múltiplas colunas (ex: em desktops) devem ser reorganizados para uma única coluna em telas de celular. Imagens e outros elementos de mídia devem ser redimensionados proporcionalmente para não quebrar o layout.

## 3. Escopo de Funcionalidades

### 3.1. Módulo 1: Autenticação e Integração com Spotify

**História de Usuário 1.1:** `Como um novo usuário, eu quero me conectar de forma segura com minha conta do Spotify para que o aplicativo possa acessar minhas playlists e músicas.`

**Requisitos Funcionais (RF):**
* **RF1.1.1:** O sistema deve apresentar um botão "Entrar com Spotify".
* **RF1.1.2:** Ao clicar, o usuário deve ser redirecionado para a página de autorização oficial do Spotify (Fluxo OAuth 2.0).
* **RF1.1.3:** A aplicação deve solicitar os escopos de autorização necessários: `user-read-private`, `user-read-email`, `playlist-read-private`, `playlist-read-collaborative`, `user-modify-playback-state`.
* **RF1.1.4:** Após a autorização bem-sucedida, o sistema deve salvar o token de acesso e de atualização de forma segura, associado ao perfil do usuário na aplicação.
* **RF1.1.5:** Em caso de falha ou negação de autorização, o sistema deve exibir uma mensagem clara informando o usuário sobre o ocorrido e a necessidade da permissão.
* **RF1.1.6:** O sistema deve implementar a lógica para renovar o token de acesso usando o token de atualização quando o original expirar.

**Requisitos Não-Funcionais (RNF):**
* **RNF1.1 (Segurança):** Tokens de acesso e de atualização devem ser criptografados e armazenados de forma segura no backend, nunca expostos no frontend.

**Critérios de Aceite:**
* Dado que um usuário clica em "Entrar com Spotify", ele é levado para a tela de login do Spotify.
* Quando o usuário autoriza com sucesso, ele é redirecionado de volta para a aplicação e sua sessão é iniciada.
* Quando o usuário nega a autorização, ele é redirecionado de volta com uma mensagem de erro amigável.

---

### 3.2. Módulo 2: Navegação e Player

**História de Usuário 2.1:** `Como um usuário conectado, eu quero ver todas as minhas playlists do Spotify, explorar suas faixas e buscar por novas músicas para que eu possa encontrar e ouvir o que desejo.`

**História de Usuário 2.2:** `Como um usuário Premium do Spotify, eu quero poder tocar e pausar uma música diretamente do aplicativo para controlar a reprodução sem precisar trocar de tela.`

**Requisitos Funcionais (RF):**
* **RF2.1.1:** O sistema deve fazer uma chamada à API do Spotify para buscar e exibir uma lista de todas as playlists (privadas e colaborativas) do usuário autenticado.
* **RF2.1.2:** A lista de playlists deve exibir o nome e a imagem de capa de cada uma.
* **RF2.1.3:** Ao selecionar uma playlist, o sistema deve buscar e exibir a lista de faixas contidas nela, mostrando o nome da faixa, artista(s) e a imagem de capa do álbum.
* **RF2.1.4:** O sistema deve prover um campo de busca que utilize a API do Spotify para pesquisar por faixas. Os resultados devem ser exibidos de forma clara.
* **RF2.1.5:** Ao clicar em uma faixa (em qualquer lista), o sistema deve verificar se o usuário é Premium e se há um dispositivo Spotify ativo.
* **RF2.1.6:** Se as condições do RF2.1.5 forem atendidas, o sistema deve enviar um comando de "play" para a API do Spotify, iniciando a reprodução da faixa no dispositivo ativo.
* **RF2.1.7:** O sistema deve exibir controles de "Tocar/Pausar" que reflitam o estado atual da reprodução.
* **RF2.1.8 (Tratamento de Erro):** Se o usuário não for Premium, o sistema deve exibir uma notificação informativa ("Funcionalidade exclusiva para assinantes Premium").
* **RF2.1.9 (Tratamento de Erro):** Se nenhum dispositivo ativo for encontrado, o sistema deve instruir o usuário a iniciar a reprodução em um de seus dispositivos Spotify primeiro.

**Requisitos Não-Funcionais (RNF):**
* **RNF2.1 (Desempenho):** As listas de playlists e faixas devem carregar em menos de 3 segundos em uma conexão de internet padrão. A busca deve retornar resultados em menos de 2 segundos.
* **RNF2.2 (Usabilidade):** A interface de busca e navegação deve ser intuitiva.

**Critérios de Aceite:**
* Dado que estou logado, eu vejo minhas playlists do Spotify listadas.
* Quando eu clico em uma playlist, vejo todas as suas músicas.
* Quando eu busco por "Daft Punk", uma lista de músicas relevantes é exibida.
* Dado que sou Premium e tenho o Spotify aberto no meu celular, ao clicar em "Tocar" em uma música, ela começa a tocar no meu celular.
* Dado que não sou Premium, ao clicar em "Tocar", uma mensagem sobre a limitação é exibida.

---

### 3.3. Módulo 3: Curadoria Pessoal (CRUD com MongoDB)

**História de Usuário 3.1:** `Como um usuário, eu quero salvar minhas músicas preferidas do Spotify no aplicativo para criar uma biblioteca pessoal de favoritos.`

**História de Usuário 3.2:** `Como um usuário organizado, eu quero criar categorias personalizadas (ex: "Foco", "Academia") para agrupar minhas músicas favoritas.`

**História de Usuário 3.3:** `Como um usuário expressivo, eu quero adicionar comentários a uma música favorita para me lembrar por que gosto dela ou de um momento associado a ela.`

**Requisitos Funcionais (RF):**
* **RF3.1.1:** Em cada faixa exibida na interface, deve haver um ícone de "Favoritar" (ex: coração).
* **RF3.1.2:** Ao clicar em "Favoritar", o sistema deve salvar uma referência daquela música na base de dados MongoDB. O registro deve conter, no mínimo, o `ID da Faixa do Spotify`, a `ID do Usuário` e a data (`timestamp`).
* **RF3.1.3:** O ícone deve mudar de estado para refletir se a música está ou não favoritada. Clicar novamente deve remover o favorito.
* **RF3.2.1:** O sistema deve permitir ao usuário criar, renomear e excluir categorias. Cada categoria pertence a um único usuário.
* **RF3.2.2:** O usuário deve poder associar uma ou mais músicas de sua lista de favoritos a uma ou mais de suas categorias.
* **RF3.3.1:** Em uma música favoritada, o usuário deve ter a opção de adicionar um ou mais comentários em texto.
* **RF3.3.2:** Cada comentário deve ser salvo no MongoDB, associado ao `ID da Faixa do Spotify` e à `ID do Usuário`.

**Critérios de Aceite:**
* Quando eu clico no ícone de coração de uma música, ele fica preenchido e a música aparece na minha lista de "Favoritos".
* Eu consigo criar uma categoria chamada "Músicas para Correr".
* Eu consigo adicionar 3 músicas da minha lista de favoritos à categoria "Músicas para Correr".
* Na música "Eye of the Tiger" na minha lista de favoritos, eu consigo adicionar o comentário "Lembrete para nunca desistir".

---

### 3.4. Módulo 4: Histórico e Visualização

**História de Usuário 4.1:** `Como um usuário, eu quero ter uma tela onde eu possa ver todas as minhas músicas favoritas, as categorias que criei e os comentários que fiz, tudo em um só lugar.`

**Requisitos Funcionais (RF):**
* **RF4.1.1:** O sistema deve ter uma seção "Minha Curadoria" ou "Meus Favoritos".
* **RF4.1.2:** Nesta seção, o sistema deve exibir a lista completa de músicas que o usuário favoritou, buscando os dados do MongoDB.
* **RF4.1.3:** O sistema deve permitir filtrar a lista de favoritos por categorias criadas pelo usuário.
* **RF4.1.4:** Ao visualizar uma música favorita, o sistema deve exibir os comentários que o usuário fez para aquela faixa.
* **RF4.1.5:** A interface deve permitir a edição ou exclusão de comentários e a reorganização de músicas entre categorias.

**Critérios de Aceite:**
* Ao acessar a tela "Minha Curadoria", eu vejo a lista de todas as 50 músicas que favoritei.
* Quando eu clico no filtro "Músicas para Correr", a lista é reduzida para as 3 músicas que adicionei a essa categoria.
* Ao selecionar uma música, vejo o comentário que fiz sobre ela anteriormente.