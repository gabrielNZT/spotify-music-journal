# **Proposta de Arquitetura de Backend e DevOps: Agregador Musical Pessoal**

  * **Autor:** Engenheiro DevOps
  * **Stack Principal:** Node.js, Express.js, MongoDB (com Mongoose), Docker
  * **Data:** 14 de julho de 2025

## 1\. Arquitetura da Aplicação (Express.js)

Para garantir a organização e facilitar a manutenção, adotaremos uma arquitetura em camadas (Layered Architecture), separando as responsabilidades de rota, controle, serviço e acesso a dados.

### 1.1. Estrutura de Diretórios

A estrutura de pastas do projeto será organizada da seguinte forma para promover a separação de conceitos:

```
/project-root
├── /src
│   ├── /api
│   │   ├── /auth            # Rotas e controllers de autenticação
│   │   ├── /playlists       # Rotas e controllers de playlists
│   │   ├── /tracks          # Rotas e controllers de faixas/player
│   │   └── /curation        # Rotas e controllers de favoritos, categorias, etc.
│   ├── /config              # Configurações (DB, .env, cors)
│   ├── /middlewares         # Middlewares customizados (auth, error handling)
│   ├── /models              # Mongoose Schemas (User, Favorite, Category)
│   ├── /services            # Lógica de negócio e comunicação com APIs externas
│   └── /utils               # Funções utilitárias (logger, etc.)
├── .env                     # Variáveis de ambiente
├── .dockerignore
├── .gitignore
├── Dockerfile               # Definição do container da aplicação
├── docker-compose.yml       # Orquestração local (app + db)
├── package.json
└── server.js                # Ponto de entrada da aplicação
```

### 1.2. Fluxo de uma Requisição

1.  **Rota (`/api/**/*.js`):** Define o endpoint (ex: `POST /api/curation/favorites`). Valida os dados de entrada (usando `express-validator` ou `joi`) e chama o Controller correspondente.
2.  **Middleware (`/middlewares`):** Funções que interceptam a requisição, como o middleware de autenticação que verifica o token JWT.
3.  **Controller (`/api/**/*.controller.js`):** Orquestra o fluxo. Recebe a requisição, extrai os dados necessários (body, params) e chama a camada de Serviço. Formata a resposta a ser enviada ao cliente.
4.  **Serviço (`/services`):** Contém a lógica de negócio principal. Ex: `spotify.service.js` para interagir com a API do Spotify, `favorite.service.js` para gerenciar a lógica de favoritar uma música.
5.  **Model (`/models`):** Define o schema e interage com o banco de dados MongoDB através do Mongoose.

## 2\. Arquitetura de Dados (MongoDB)

Usaremos o Mongoose como ODM para modelar os dados da aplicação. As relações serão feitas através de referências (`ref`).

### 2.1. Modelagem de Schemas (Mongoose)

  * **User (`user.model.js`):** Armazena informações do usuário.
    ```javascript
    const userSchema = new mongoose.Schema({
        spotifyId: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        profileImageUrl: { type: String },
        accessToken: { type: String, required: true }, // Encrypted
        refreshToken: { type: String, required: true }, // Encrypted
    }, { timestamps: true });
    ```
  * **Favorite (`favorite.model.js`):** As músicas favoritadas por um usuário.
    ```javascript
    const favoriteSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        spotifyTrackId: { type: String, required: true },
        // Optional: Cache de metadados para evitar chamadas à API
        trackName: String,
        artistName: String,
        albumImageUrl: String,
    }, { timestamps: true });
    ```
  * **Category (`category.model.js`):** Categorias criadas pelos usuários.
    ```javascript
    const categorySchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }] // Array de favoritos
    }, { timestamps: true });
    ```
  * **Comment (`comment.model.js`):** Comentários em músicas favoritadas.
    ```javascript
    const commentSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        favorite: { type: mongoose.Schema.Types.ObjectId, ref: 'Favorite', required: true },
        text: { type: String, required: true },
    }, { timestamps: true });
    ```

## 3\. Autenticação e Autorização

O fluxo de autenticação será robusto para proteger tanto os dados do usuário quanto a nossa aplicação.

1.  **Spotify OAuth 2.0:** O frontend iniciará o fluxo. O backend receberá o código de autorização no endpoint de callback (`/api/auth/spotify/callback`).
2.  **Troca de Tokens:** O backend troca o código pelos `accessToken` e `refreshToken` do Spotify. Estes tokens serão **criptografados** antes de serem salvos no documento do usuário no MongoDB.
3.  **Geração de JWT:** Após autenticar o usuário via Spotify, nosso backend gerará um **JSON Web Token (JWT)** próprio, com um tempo de expiração curto (ex: 15 minutos). Este JWT será enviado ao frontend.
4.  **Requisições Autenticadas:** Para todas as chamadas subsequentes à nossa API (ex: favoritar uma música), o frontend enviará o JWT no cabeçalho `Authorization`.
5.  **Middleware de Proteção:** Um middleware (`auth.middleware.js`) em nosso backend irá validar o JWT em todas as rotas protegidas.

## 4\. Estratégia de DevOps e Infraestrutura

### 4.1. Ambientes

Manteremos 3 ambientes para garantir a estabilidade:

  * **Desenvolvimento (Local):** Usando `docker-compose` para subir a aplicação e um container do MongoDB.
  * **Homologação (Staging):** Ambiente idêntico ao de produção para testes finais. Deploy automatizado a partir de merges na branch `develop`.
  * **Produção (Production):** Ambiente acessível ao usuário final. Deploy automatizado a partir de merges na branch `main`.

### 4.2. Containerização (Docker)

  * **`Dockerfile`:** Criaremos um `Dockerfile` multi-stage otimizado para produção, resultando em uma imagem leve e segura.
    ```dockerfile
    # Stage 1: Build
    FROM node:18-alpine AS builder
    WORKDIR /usr/src/app
    COPY package*.json ./
    RUN npm install
    COPY . .

    # Stage 2: Production
    FROM node:18-alpine
    WORKDIR /usr/src/app
    COPY --from=builder /usr/src/app ./
    EXPOSE 3000
    CMD [ "node", "server.js" ]
    ```
  * **`docker-compose.yml` (para ambiente local):**
    ```yaml
    version: '3.8'
    services:
      app:
        build: .
        ports:
          - "3000:3000"
        environment:
          - MONGO_URI=mongodb://mongo:27017/agregador-musical
          - SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
          - SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
        depends_on:
          - mongo
      mongo:
        image: mongo:latest
        ports:
          - "27017:27017"
        volumes:
          - mongo-data:/data/db

    volumes:
      mongo-data:
    ```

### 4.3. CI/CD (Integração e Deploy Contínuo)

Utilizaremos **GitHub Actions** para automatizar o pipeline.

  * **Workflow (`on push` para `main` e `develop`):**
    1.  **Checkout:** Baixa o código.
    2.  **Setup Node.js:** Configura o ambiente Node.
    3.  **Install Dependencies:** Roda `npm install`.
    4.  **Lint & Test:** Roda `npm run lint` e `npm run test` para garantir a qualidade do código.
    5.  **Build Docker Image:** Constrói a imagem Docker.
    6.  **Login to Registry:** Faz login em um registro de container (Docker Hub, AWS ECR, etc.).
    7.  **Push Docker Image:** Envia a imagem para o registro.
    8.  **Deploy:** Dispara o deploy na plataforma de hospedagem (ex: Heroku, Render, AWS).

### 4.4. Hospedagem (Cloud)

  * **Recomendação:** **Render** ou **Heroku**. Ambas as plataformas são "developer-friendly", se integram bem com GitHub Actions e gerenciam a complexidade da infraestrutura (balanceamento de carga, SSL). Elas oferecem add-ons para bancos de dados MongoDB, simplificando o setup.
  * **Alternativa Escalável:** **AWS App Runner** ou **AWS ECS Fargate**. Para maior controle e escalabilidade, podemos hospedar os containers na AWS, usando o Amazon DocumentDB como nosso MongoDB.

## 5\. Segurança, Logging e Monitoramento

  * **Segurança:**
      * Uso de variáveis de ambiente para todas as chaves e segredos.
      * Uso da biblioteca `helmet` no Express para adicionar cabeçalhos de segurança HTTP.
      * Configuração de `cors` para permitir requisições apenas do nosso frontend.
      * Validação e sanitização de todas as entradas do usuário.
  * **Logging:** Implementação de um logger robusto (como `winston` ou `pino`) para registrar eventos da aplicação e erros em diferentes níveis (info, warn, error).
  * **Monitoramento:** Integração com um serviço de monitoramento de performance e erros como **Sentry** ou **New Relic** para capturar exceções em tempo real no ambiente de produção.