## 🧾 Visão Geral do Projeto

> Uma aplicação web com **React (Next.js)** integrada com a **API do Spotify**, permitindo autenticação, visualização de playlists, músicas favoritas e criação de **anotações personalizadas por faixa**, como se fosse um **diário musical**. Utiliza **MongoDB** para persistir dados personalizados.

---

## 🖥️ Telas da Aplicação

---

### 1. **Login com Spotify**

#### 🧩 Descrição:

Tela inicial com opção de login via **OAuth** com Spotify.

#### 🧱 Elementos:

* **Botão de Login** (`<LoginButton />`)
* Logo e nome da aplicação
* Instruções básicas sobre o uso

#### 🔁 Comportamento:

* Ao clicar no botão, o usuário é redirecionado para a autenticação OAuth.
* Após o login, é redirecionado para o Dashboard.

---

### 2. **Dashboard**

#### 🧩 Descrição:

Tela principal pós-login. Exibe as **playlists** e **faixas recentemente ouvidas**.

#### 🧱 Elementos:

* **<Navbar />** e **<Sidebar />**
* Lista de **<PlaylistCard />**
* Destaque com **últimas faixas reproduzidas**
* Ações para acessar uma playlist

---

### 3. **Página de Playlist**

#### 🧩 Descrição:

Tela com as **faixas de uma playlist específica**.

#### 🧱 Elementos:

* Nome da playlist, imagem de capa
* Lista de **<TrackItem />** (com botões para favoritar e anotar)
* Cada faixa pode abrir um **<NoteModal />** para escrever comentários
* Possibilidade de adicionar **<CategoryTag />**

---

### 4. **Página de Música Favorita**

#### 🧩 Descrição:

Tela dedicada a uma **faixa favorita**, com opção de adicionar **comentários** e **categorias**.

#### 🧱 Elementos:

* Dados da música (nome, artista, álbum, capa)
* Campo de comentário (acessado via `<NoteModal />` ou inline)
* Tags de categorias (`<CategoryTag />`), com opção de adicionar/remover

---

### 5. **Área de Categorias**

#### 🧩 Descrição:

Tela para visualizar as **categorias criadas pelo usuário** e suas **músicas associadas**.

#### 🧱 Elementos:

* Lista de categorias personalizadas (`<CategoryTag />`)
* Ao clicar em uma categoria, lista as faixas relacionadas
* Ações para renomear, excluir ou filtrar por categoria

---

### 6. **Perfil do Usuário**

#### 🧩 Descrição:

Tela com os **dados da conta Spotify** e opção para **logout**.

#### 🧱 Elementos:

* Avatar, nome, email e tipo de conta (Premium/Free)
* Botão de logout
* Informações de sessão (último login, token válido)

---

## 🧩 Componentes ReactJS Reutilizáveis

---

### `<LoginButton />`

> Botão estilizado que inicia o fluxo OAuth com Spotify.

**Props esperadas**:

* `onClick` → função que inicia o login
* `text` → texto opcional (ex: “Entrar com Spotify”)

---

### `<PlaylistCard />`

> Cartão visual para cada playlist.

**Informações exibidas**:

* Nome da playlist
* Imagem de capa
* Número de faixas

**Interações**:

* Clique no card leva à **Página de Playlist**

---

### `<TrackItem />`

> Item de lista representando uma faixa musical.

**Informações exibidas**:

* Nome da música, artista, álbum
* Botões para: 💚 Favoritar | 📝 Anotar
* Tags de categorias aplicadas

---

### `<NoteModal />`

> Modal que permite ao usuário escrever comentários/anotações sobre uma faixa.

**Campos esperados**:

* Texto da anotação
* Botão de salvar
* Opções para adicionar categorias

---

### `<CategoryTag />`

> Chip visual que representa uma categoria atribuída a uma faixa.

**Interações**:

* Clique pode filtrar faixas
* Pode conter botão de excluir (❌)

---

### `<Navbar />` e `<Sidebar />`

> Componentes de navegação para a aplicação.

**Navbar:**

* Nome/logo da aplicação
* Ícone de perfil
* Logout

**Sidebar:**

* Links para: Dashboard, Categorias, Favoritas
* Pode conter playlists fixadas

---