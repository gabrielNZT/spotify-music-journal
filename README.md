# 🎵 Spotify Music Journal

**Agregador Musical Pessoal** - Uma aplicação para organizar e curar sua biblioteca musical do Spotify com categorias personalizadas, favoritos e comentários.

## 📋 Recursos

- 🔐 **Autenticação OAuth 2.0** com Spotify
- ❤️ **Sistema de Favoritos** para suas músicas
- 📂 **Categorias Personalizadas** para organizar sua biblioteca
- 💬 **Comentários** em suas músicas favoritas
- 🎮 **Controle de Player** integrado com Spotify
- 🔍 **Busca Avançada** por músicas, artistas e álbuns
- 📊 **Estatísticas** dos seus top tracks e artistas

## 🏗️ Arquitetura

### Backend (Node.js/Express.js)
- **Arquitetura em Camadas** (Layered Architecture)
- **MongoDB** com Mongoose ODM
- **JWT** para autenticação de sessão
- **Spotify Web API** integration
- **Docker** para containerização

### Estrutura do Projeto
```
/project-root
├── back-end/
│   ├── src/
│   │   ├── api/          # Rotas e controllers
│   │   ├── config/       # Configurações (DB, CORS)
│   │   ├── middlewares/  # Middlewares customizados
│   │   ├── models/       # Mongoose Schemas
│   │   ├── services/     # Lógica de negócio
│   │   └── utils/        # Funções utilitárias
│   ├── Dockerfile
│   └── package.json
├── scripts/              # Scripts de setup e deploy
├── docker-compose.yml    # Produção
├── docker-compose.dev.yml # Desenvolvimento
└── .env.example
```

## 🚀 Setup Rápido

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- Conta Spotify Developer

### 1. Clone o repositório
```bash
git clone <repository-url>
cd spotify-music-journal
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 3. Configure o Spotify App
1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie uma nova aplicação
3. Adicione `http://localhost:3001/api/auth/spotify/callback` nas Redirect URIs
4. Copie Client ID e Client Secret para o arquivo `.env`

### 4. Desenvolvimento
```bash
# Setup automático (instala dependências e inicia containers)
./scripts/dev-setup.sh

# OU manualmente
cd back-end && npm install && cd ..
docker-compose -f docker-compose.dev.yml up --build
```

### 5. Produção
```bash
./scripts/deploy.sh

# OU manualmente
docker-compose up --build -d
```

## 🔧 Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
# Servidor
NODE_ENV=development
PORT=3001

# Database
MONGO_URI=mongodb://localhost:27017/spotify-music-journal

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_EXPIRES_IN=15m

# Spotify API
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/spotify/callback

# Encryption (32 caracteres para AES-256)
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

## 📡 API Endpoints

### Autenticação
- `GET /api/auth/spotify` - Inicia fluxo OAuth
- `GET /api/auth/spotify/callback` - Callback OAuth
- `POST /api/auth/refresh` - Refresh token

### Curadoria
- `GET /api/curation/favorites` - Lista favoritos
- `POST /api/curation/favorites` - Adiciona favorito
- `DELETE /api/curation/favorites/:id` - Remove favorito
- `GET /api/curation/categories` - Lista categorias
- `POST /api/curation/categories` - Cria categoria
- `GET /api/curation/comments` - Lista comentários
- `POST /api/curation/comments` - Adiciona comentário

### Spotify Integration
- `GET /api/playlists` - Playlists do usuário
- `GET /api/tracks/search` - Busca faixas
- `GET /api/tracks/current` - Faixa atual
- `GET /api/tracks/top` - Top faixas

### Player Control
- `GET /api/player/current` - Estado atual do player
- `PUT /api/player/play` - Iniciar/retomar reprodução
- `PUT /api/player/pause` - Pausar reprodução
- `POST /api/player/next` - Próxima faixa
- `POST /api/player/previous` - Faixa anterior
- `PUT /api/player/volume` - Controlar volume

## 🐳 Docker

### Desenvolvimento
```bash
# Inicia ambiente de desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Services:
# - App: http://localhost:3001
# - MongoDB: localhost:27018
# - Mongo Express: http://localhost:8082
```

### Produção
```bash
# Inicia ambiente de produção
docker-compose up --build -d

# Services:
# - App: http://localhost:3000
# - MongoDB: localhost:27017
# - Mongo Express: http://localhost:8081 (com auth)
```

## 🔒 Segurança

- ✅ Tokens Spotify criptografados no banco
- ✅ JWT com tempo de expiração curto
- ✅ Middleware de autenticação em rotas protegidas
- ✅ Validação e sanitização de entrada
- ✅ Headers de segurança com helmet
- ✅ CORS configurado
- ✅ Rate limiting implementado

## 📊 Logging e Monitoramento

- **Winston** para logging estruturado
- **Health checks** em todos os containers
- **Error tracking** centralizado
- **Environment-specific** log levels

## 🧪 Testes

```bash
# Executar testes
cd back-end
npm test

# Coverage
npm run test:coverage
```

## 📝 Desenvolvimento

### Comandos Úteis
```bash
# Logs dos containers
docker-compose logs -f

# Reiniciar apenas a aplicação
docker-compose restart app

# Backup do banco
docker-compose exec mongo mongodump --db spotify-music-journal

# Acessar container da aplicação
docker-compose exec app sh
```

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Vitor Gabriel Nunes Cesarino**

---

> 🎵 *"Music is the universal language of mankind"* - Henry Wadsworth Longfellow