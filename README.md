# 🎵 Spotify Music Journal

**Diário Musical Inteligente** - Uma aplicação web completa que integra com Spotify para oferecer gerenciamento de favoritos, recomendações baseadas em IA e diferenciação entre usuários Premium e Free.

## ✨ Principais Funcionalidades

- 🔐 **Autenticação OAuth 2.0** com Spotify
- ❤️ **Sistema de Favoritos** para suas músicas preferidas
- 🤖 **Recomendações IA** personalizadas usando Google Gemini
- 🎮 **Player Integrado** com controles completos do Spotify
- 📱 **Interface Responsiva** otimizada para desktop e mobile
- � **Diferenciação Premium/Free** com restrições inteligentes
- 📊 **Histórico de Recomendações** com sistema de avaliação
- 🔍 **Exploração de Playlists** com paginação infinita

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend**: React.js 18 + Vite + CSS Modules
- **Backend**: Node.js + Express.js + JWT
- **Database**: MongoDB com Mongoose ODM
- **APIs**: Spotify Web API + Google Gemini AI
- **Deploy**: Docker + Docker Compose

### Estrutura do Projeto
```
spotify-music-journal/
├── front-end/           # React.js Frontend
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── context/     # Context Providers (Estado global)
│   │   ├── hooks/       # Custom Hooks
│   │   ├── services/    # Serviços de API
│   │   └── utils/       # Utilitários e formatadores
│   ├── public/
│   └── package.json
├── back-end/            # Node.js Backend
│   ├── src/
│   │   ├── api/         # Rotas e controllers
│   │   ├── config/      # Configurações (DB, CORS)
│   │   ├── middlewares/ # Middlewares customizados
│   │   ├── models/      # Mongoose Schemas
│   │   ├── services/    # Lógica de negócio
│   │   └── utils/       # Funções utilitárias
│   └── package.json
├── docs/                # Documentação
├── API_DOCUMENTATION.md
├── DATABASE_DOCUMENTATION.md
├── TECHNICAL_REPORT.md
└── README.md
```

## 🚀 Setup e Instalação

### Pré-requisitos
- Node.js 18+
- MongoDB
- Conta Spotify Developer
- Conta Google Cloud (para Gemini AI)

### 1. Clone o repositório
```bash
git clone https://github.com/gabrielNZT/spotify-music-journal.git
cd spotify-music-journal
```

### 2. Configure as APIs necessárias

#### Spotify Developer App
1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie uma nova aplicação
3. Adicione as seguintes Redirect URIs:
   - `http://localhost:3001/api/auth/spotify/callback` (desenvolvimento)
   - `http://localhost:5173/auth/success` (frontend desenvolvimento)
4. Copie Client ID e Client Secret

#### Google Gemini AI
1. Acesse [Google AI Studio](https://aistudio.google.com)
2. Crie um projeto e obtenha uma API Key
3. Habilite a API do Gemini

### 3. Configure as variáveis de ambiente

#### Backend (.env)
```bash
cd back-end
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Servidor
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/spotify-music-journal

# Spotify
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback

# JWT
JWT_SECRET=sua_chave_secreta_muito_forte_aqui

# Google Gemini
GEMINI_API_KEY=sua_api_key_do_gemini_aqui

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend
Não requer configuração adicional - as URLs da API são configuradas automaticamente.

### 4. Instalação e Execução

#### Desenvolvimento (Recomendado)
```bash
# Terminal 1: Backend
cd back-end
npm install
npm run dev

# Terminal 2: Frontend  
cd front-end
npm install
npm run dev

# Terminal 3: MongoDB (se não usando Docker)
mongod
```

#### Usando Docker
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Produção
docker-compose up --build -d
```

### 5. Acesso à Aplicação
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Configurações Específicas

#### MongoDB
```bash
# Local
MONGODB_URI=mongodb://localhost:27017/spotify-music-journal

# Docker
MONGODB_URI=mongodb://mongo:27017/spotify-music-journal

# MongoDB Atlas (produção)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spotify-music-journal
```

#### Spotify Scopes Necessários
A aplicação utiliza os seguintes escopos do Spotify:
- `user-read-private` - Informações do perfil
- `user-read-email` - Email do usuário
- `playlist-read-private` - Playlists privadas
- `playlist-read-collaborative` - Playlists colaborativas
- `user-modify-playback-state` - Controle de reprodução
- `user-read-playback-state` - Estado de reprodução
- `user-read-currently-playing` - Música atual

## 📡 Documentação da API

### Principais Endpoints

#### Autenticação
- `GET /api/auth/login` - Inicia fluxo OAuth com Spotify
- `GET /api/auth/callback` - Callback do OAuth
- `GET /api/auth/me` - Informações do usuário autenticado

#### Playlists
- `GET /api/playlists` - Lista playlists do usuário
- `GET /api/playlists/:id` - Detalhes de uma playlist
- `GET /api/playlists/:id/tracks` - Faixas de uma playlist

#### Favoritos
- `GET /api/tracks/favorites` - Lista favoritos do usuário
- `POST /api/tracks/favorites` - Adiciona música aos favoritos
- `DELETE /api/tracks/favorites/:trackId` - Remove dos favoritos

#### Recomendações IA
- `POST /api/curation/discover` - Gera recomendações com IA
- `GET /api/curation/history` - Histórico de recomendações
- `POST /api/curation/rate` - Avalia uma recomendação

#### Player Control
- `POST /api/player/play` - Reproduzir música/playlist
- `POST /api/player/pause` - Pausar reprodução
- `POST /api/player/next` - Próxima faixa
- `POST /api/player/previous` - Faixa anterior
- `PUT /api/player/volume` - Ajustar volume
- `GET /api/player/current-track` - Faixa atual

> Para documentação completa da API, consulte [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
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
## 🎯 Funcionalidades Premium vs Free

### Usuários Premium
- ✅ Reprodução completa de músicas
- ✅ Controles de player (play, pause, skip, volume)
- ✅ Todas as funcionalidades de favoritos
- ✅ Recomendações IA ilimitadas
- ✅ Badge Premium no perfil

### Usuários Free
- ✅ Visualização de playlists e músicas
- ✅ Sistema de favoritos completo
- ✅ Recomendações IA (limitadas)
- ❌ Reprodução controlada (apenas preview)
- ❌ Controles avançados de player
- 💡 Modal educativo para upgrade

## 🔒 Segurança e Performance

### Segurança
- ✅ Autenticação JWT com expiração
- ✅ Tokens Spotify criptografados
- ✅ Validação de entrada em todas as rotas
- ✅ CORS configurado adequadamente
- ✅ Rate limiting implementado
- ✅ Sanitização de dados do usuário

### Performance
- ✅ Paginação em todas as listas
- ✅ Lazy loading de componentes
- ✅ Cache de consultas frequentes
- ✅ Otimização de imagens
- ✅ Bundling otimizado com Vite

### Monitoramento
- 📊 Logs estruturados com Winston
- 🔍 Error tracking centralizado
- ⚡ Health checks em todos os serviços
- 📈 Métricas de uso da API

## 🧪 Testes e Desenvolvimento

### Executar Testes
```bash
# Backend
cd back-end
npm test
npm run test:coverage

# Frontend
cd front-end
npm test
npm run test:ui
```

### Comandos de Desenvolvimento
```bash
# Logs em tempo real
docker-compose logs -f

# Reiniciar serviços específicos
docker-compose restart backend
docker-compose restart frontend

# Backup do banco
docker-compose exec mongo mongodump --db spotify-music-journal

# Acessar container
docker-compose exec backend sh
```

## 📚 Documentação Adicional

- 📖 [API Documentation](./API_DOCUMENTATION.md) - Documentação completa da API
- 🗃️ [Database Documentation](./DATABASE_DOCUMENTATION.md) - Estrutura do banco de dados
- 🔧 [Technical Report](./TECHNICAL_REPORT.md) - Relatório técnico detalhado

## 🤝 Contribuição

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação de código
refactor: refatoração de código
test: adição/correção de testes
chore: tarefas de manutenção
```

### Guidelines de Desenvolvimento
1. Siga os padrões ESLint configurados
2. Mantenha a cobertura de testes acima de 80%
3. Documente APIs e componentes complexos
4. Use commits semânticos
5. Teste em múltiplos navegadores

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 🆘 Suporte

### Problemas Comuns

**Erro de CORS:**
```bash
# Verifique se CORS_ORIGIN está configurado corretamente
CORS_ORIGIN=http://localhost:5173
```

**MongoDB não conecta:**
```bash
# Verifique se MongoDB está rodando
docker-compose logs mongo
```

**Spotify API errors:**
```bash
# Verifique se as credenciais estão corretas e os escopos configurados
# Redirect URI deve estar exatamente igual no Spotify Dashboard
```

### Contato
- 📧 Email: gabrielnzt@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/gabrielNZT/spotify-music-journal/issues)
- 📱 Social: [@gabrielNZT](https://github.com/gabrielNZT)

---

**Desenvolvido com ❤️ por Gabriel** - Transformando a experiência musical com tecnologia
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