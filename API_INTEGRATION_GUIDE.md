# 🎵 API Integration Guide - Spotify Music Journal

## 📋 Visão Geral

Esta é a documentação completa da API do **Agregador Musical Pessoal**, um backend construído em Express.js que integra com a API do Spotify para fornecer funcionalidades de curadoria musical, gerenciamento de favoritos, categorias e controle de player.

### Base URL
```
http://localhost:3001/api
```

### Autenticação

A maioria das rotas requer autenticação via **Bearer Token (JWT)**. O token deve ser incluído no cabeçalho de todas as requisições autenticadas:

```http
Authorization: Bearer <seu_jwt_token>
```

### Estrutura de Resposta Padrão

**Sucesso:**
```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Tipo do erro",
  "message": "Descrição detalhada do erro"
}
```

---

## 🔐 Autenticação (`/api/auth`)

### `GET` `/api/auth/spotify/url`

**Descrição:** Gera a URL para iniciar o fluxo de autenticação OAuth com o Spotify.

**Autenticação:** Pública (não requer token)

**Parâmetros de URL:** Nenhum.

**Query Parameters:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "authUrl": "https://accounts.spotify.com/authorize?client_id=...&response_type=code&redirect_uri=..."
}
```

**Possíveis Erros:**
- `500` - Falha ao gerar URL de autenticação

---

### `GET` `/api/auth/spotify/callback`

**Descrição:** Processa o callback do OAuth do Spotify e gera o JWT token para o usuário.

**Autenticação:** Pública (não requer token)

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `code` (string): Código de autorização retornado pelo Spotify
- `state` (string, opcional): Parâmetro de estado para validação
- `error` (string, opcional): Erro retornado pelo Spotify

**Corpo da Requisição:** Nenhum.

**Resposta:** Redirecionamento para o frontend com token ou erro.

---

### `GET` `/api/auth/me`

**Descrição:** Retorna as informações do usuário autenticado.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "user": {
    "id": "60f7b1b3e4b0a1b3e4b0a1b3",
    "spotifyId": "spotify_user_123",
    "displayName": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "profileImageUrl": "https://i.scdn.co/image/ab67616d...",
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

**Possíveis Erros:**
- `401` - Token inválido ou expirado
- `404` - Usuário não encontrado

---

## ❤️ Curadoria (`/api/curation`)

### `POST` `/api/curation/favorites`

**Descrição:** Adiciona uma música aos favoritos do usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:**
```json
{
  "spotifyTrackId": "4iV5W9uYEdYUVa79Axb7Rh",
  "trackName": "Nome da Música (opcional)",
  "artistName": "Nome do Artista (opcional)",
  "albumImageUrl": "https://i.scdn.co/image/... (opcional)"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Track added to favorites",
  "favorite": {
    "_id": "60f7b1b3e4b0a1b3e4b0a1b3",
    "user": "60f7b1b3e4b0a1b3e4b0a1b2",
    "spotifyTrackId": "4iV5W9uYEdYUVa79Axb7Rh",
    "trackName": "Nome da Música",
    "artistName": "Nome do Artista",
    "albumImageUrl": "https://i.scdn.co/image/...",
    "createdAt": "2023-07-20T10:30:00.000Z"
  }
}
```

**Possíveis Erros:**
- `400` - Dados de validação inválidos
- `409` - Música já está nos favoritos

---

### `DELETE` `/api/curation/favorites/:spotifyTrackId`

**Descrição:** Remove uma música dos favoritos do usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `spotifyTrackId` (string): ID da faixa no Spotify a ser removida dos favoritos

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "message": "Track removed from favorites"
}
```

**Possíveis Erros:**
- `404` - Música não encontrada nos favoritos
- `400` - ID da faixa inválido

---

### `GET` `/api/curation/favorites`

**Descrição:** Lista os favoritos do usuário com paginação.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `page` (number, opcional): Número da página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 20)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "favorites": [
    {
      "_id": "60f7b1b3e4b0a1b3e4b0a1b3",
      "spotifyTrackId": "4iV5W9uYEdYUVa79Axb7Rh",
      "trackName": "Nome da Música",
      "artistName": "Nome do Artista",
      "albumImageUrl": "https://i.scdn.co/image/...",
      "createdAt": "2023-07-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### `GET` `/api/curation/favorites/check/:spotifyTrackId`

**Descrição:** Verifica se uma música específica está nos favoritos do usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `spotifyTrackId` (string): ID da faixa no Spotify para verificar

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "isFavorite": true,
  "favorite": {
    "_id": "60f7b1b3e4b0a1b3e4b0a1b3",
    "spotifyTrackId": "4iV5W9uYEdYUVa79Axb7Rh",
    "createdAt": "2023-07-20T10:30:00.000Z"
  }
}
```

---

### `POST` `/api/curation/categories`

**Descrição:** Cria uma nova categoria para organizar favoritos.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:**
```json
{
  "name": "Músicas para Malhar"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Category created successfully",
  "category": {
    "_id": "60f7b1b3e4b0a1b3e4b0a1b4",
    "user": "60f7b1b3e4b0a1b3e4b0a1b2",
    "name": "Músicas para Malhar",
    "favorites": [],
    "createdAt": "2023-07-20T10:30:00.000Z"
  }
}
```

**Possíveis Erros:**
- `400` - Nome da categoria inválido ou já existe

---

### `PUT` `/api/curation/categories/:categoryId`

**Descrição:** Atualiza o nome de uma categoria existente.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `categoryId` (string): ID da categoria a ser atualizada

**Corpo da Requisição:**
```json
{
  "name": "Novo Nome da Categoria"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Category updated successfully",
  "category": {
    "_id": "60f7b1b3e4b0a1b3e4b0a1b4",
    "name": "Novo Nome da Categoria",
    "updatedAt": "2023-07-20T11:30:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Categoria não encontrada
- `400` - Nome inválido

---

### `DELETE` `/api/curation/categories/:categoryId`

**Descrição:** Remove uma categoria e todos os seus favoritos associados.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `categoryId` (string): ID da categoria a ser removida

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "message": "Category deleted successfully"
}
```

**Possíveis Erros:**
- `404` - Categoria não encontrada

---

### `GET` `/api/curation/categories`

**Descrição:** Lista todas as categorias do usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "categories": [
    {
      "_id": "60f7b1b3e4b0a1b3e4b0a1b4",
      "name": "Músicas para Malhar",
      "favoritesCount": 15,
      "createdAt": "2023-07-20T10:30:00.000Z"
    }
  ]
}
```

---

### `POST` `/api/curation/categories/:categoryId/favorites/:favoriteId`

**Descrição:** Adiciona um favorito específico a uma categoria.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `categoryId` (string): ID da categoria
- `favoriteId` (string): ID do favorito a ser adicionado

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "message": "Favorite added to category successfully"
}
```

**Possíveis Erros:**
- `404` - Categoria ou favorito não encontrado
- `409` - Favorito já está na categoria

---

### `DELETE` `/api/curation/categories/:categoryId/favorites/:favoriteId`

**Descrição:** Remove um favorito específico de uma categoria.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `categoryId` (string): ID da categoria
- `favoriteId` (string): ID do favorito a ser removido

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "message": "Favorite removed from category successfully"
}
```

**Possíveis Erros:**
- `404` - Categoria, favorito não encontrado ou favorito não está na categoria

---

### `GET` `/api/curation/categories/:categoryId/favorites`

**Descrição:** Lista todos os favoritos de uma categoria específica.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `categoryId` (string): ID da categoria

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "category": {
    "_id": "60f7b1b3e4b0a1b3e4b0a1b4",
    "name": "Músicas para Malhar"
  },
  "favorites": [
    {
      "_id": "60f7b1b3e4b0a1b3e4b0a1b3",
      "spotifyTrackId": "4iV5W9uYEdYUVa79Axb7Rh",
      "trackName": "Nome da Música",
      "artistName": "Nome do Artista"
    }
  ]
}
```

---

### `POST` `/api/curation/favorites/:favoriteId/comments`

**Descrição:** Adiciona um comentário a um favorito.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `favoriteId` (string): ID do favorito

**Corpo da Requisição:**
```json
{
  "text": "Esta música me lembra da minha infância!"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "_id": "60f7b1b3e4b0a1b3e4b0a1b5",
    "user": "60f7b1b3e4b0a1b3e4b0a1b2",
    "favorite": "60f7b1b3e4b0a1b3e4b0a1b3",
    "text": "Esta música me lembra da minha infância!",
    "createdAt": "2023-07-20T10:30:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Favorito não encontrado
- `400` - Texto do comentário inválido

---

### `PUT` `/api/curation/comments/:commentId`

**Descrição:** Atualiza um comentário existente.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `commentId` (string): ID do comentário

**Corpo da Requisição:**
```json
{
  "text": "Texto atualizado do comentário"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Comment updated successfully",
  "comment": {
    "_id": "60f7b1b3e4b0a1b3e4b0a1b5",
    "text": "Texto atualizado do comentário",
    "updatedAt": "2023-07-20T11:30:00.000Z"
  }
}
```

**Possíveis Erros:**
- `404` - Comentário não encontrado
- `403` - Usuário não tem permissão para editar este comentário

---

### `DELETE` `/api/curation/comments/:commentId`

**Descrição:** Remove um comentário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `commentId` (string): ID do comentário

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "message": "Comment deleted successfully"
}
```

**Possíveis Erros:**
- `404` - Comentário não encontrado
- `403` - Usuário não tem permissão para deletar este comentário

---

### `GET` `/api/curation/favorites/:favoriteId/comments`

**Descrição:** Lista todos os comentários de um favorito.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `favoriteId` (string): ID do favorito

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "comments": [
    {
      "_id": "60f7b1b3e4b0a1b3e4b0a1b5",
      "user": {
        "_id": "60f7b1b3e4b0a1b3e4b0a1b2",
        "displayName": "Nome do Usuário"
      },
      "text": "Esta música me lembra da minha infância!",
      "createdAt": "2023-07-20T10:30:00.000Z"
    }
  ]
}
```

---

## 🎵 Playlists (`/api/playlists`)

### `GET` `/api/playlists`

**Descrição:** Lista as playlists do usuário no Spotify.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `limit` (number, opcional): Número de playlists por página (1-50, padrão: 20)
- `offset` (number, opcional): Número de playlists para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "playlists": [
      {
        "id": "37i9dQZF1DXcBWIGoYBM5M",
        "name": "Today's Top Hits",
        "description": "The biggest hits from today",
        "images": [
          {
            "url": "https://i.scdn.co/image/...",
            "height": 640,
            "width": 640
          }
        ],
        "tracks": {
          "total": 50
        },
        "public": true,
        "owner": {
          "display_name": "Spotify",
          "id": "spotify"
        }
      }
    ],
    "limit": 20,
    "offset": 0,
    "total": 156
  }
}
```

**Possíveis Erros:**
- `400` - Parâmetros de validação inválidos
- `401` - Token Spotify inválido ou expirado

---

### `GET` `/api/playlists/:playlistId`

**Descrição:** Obtém detalhes de uma playlist específica.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `playlistId` (string): ID da playlist no Spotify

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "37i9dQZF1DXcBWIGoYBM5M",
    "name": "Today's Top Hits",
    "description": "The biggest hits from today",
    "images": [
      {
        "url": "https://i.scdn.co/image/...",
        "height": 640,
        "width": 640
      }
    ],
    "tracks": {
      "total": 50,
      "items": []
    },
    "followers": {
      "total": 28951234
    },
    "public": true,
    "collaborative": false
  }
}
```

**Possíveis Erros:**
- `404` - Playlist não encontrada
- `403` - Acesso negado à playlist privada

---

### `GET` `/api/playlists/:playlistId/tracks`

**Descrição:** Lista as músicas de uma playlist específica.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `playlistId` (string): ID da playlist no Spotify

**Query Parameters:**
- `limit` (number, opcional): Número de faixas por página (1-100, padrão: 20)
- `offset` (number, opcional): Número de faixas para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "track": {
          "id": "4iV5W9uYEdYUVa79Axb7Rh",
          "name": "Nome da Música",
          "artists": [
            {
              "id": "1uNFoZAHBGtllmzznpCI3s",
              "name": "Nome do Artista"
            }
          ],
          "album": {
            "id": "2up3OPMp9Tb4dAKM2erWXQ",
            "name": "Nome do Álbum",
            "images": [
              {
                "url": "https://i.scdn.co/image/...",
                "height": 640,
                "width": 640
              }
            ]
          },
          "duration_ms": 180000,
          "preview_url": "https://p.scdn.co/mp3-preview/..."
        },
        "added_at": "2023-07-20T10:30:00Z"
      }
    ],
    "limit": 20,
    "offset": 0,
    "total": 50
  }
}
```

---

## 🎧 Faixas e Busca (`/api/tracks`)

### `GET` `/api/tracks/search/tracks`

**Descrição:** Busca faixas na biblioteca do Spotify.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `q` (string, obrigatório): Termo de busca
- `limit` (number, opcional): Número de resultados (1-50, padrão: 20)
- `offset` (number, opcional): Número de resultados para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "tracks": {
      "items": [
        {
          "id": "4iV5W9uYEdYUVa79Axb7Rh",
          "name": "Nome da Música",
          "artists": [
            {
              "id": "1uNFoZAHBGtllmzznpCI3s",
              "name": "Nome do Artista"
            }
          ],
          "album": {
            "id": "2up3OPMp9Tb4dAKM2erWXQ",
            "name": "Nome do Álbum",
            "release_date": "2023-01-15"
          },
          "duration_ms": 180000,
          "popularity": 85,
          "preview_url": "https://p.scdn.co/mp3-preview/..."
        }
      ],
      "limit": 20,
      "offset": 0,
      "total": 1000
    }
  }
}
```

**Possíveis Erros:**
- `400` - Parâmetro de busca obrigatório ausente

---

### `GET` `/api/tracks/search/artists`

**Descrição:** Busca artistas na biblioteca do Spotify.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `q` (string, obrigatório): Termo de busca
- `limit` (number, opcional): Número de resultados (1-50, padrão: 20)
- `offset` (number, opcional): Número de resultados para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "artists": {
      "items": [
        {
          "id": "1uNFoZAHBGtllmzznpCI3s",
          "name": "Nome do Artista",
          "genres": ["pop", "rock"],
          "popularity": 75,
          "followers": {
            "total": 5000000
          },
          "images": [
            {
              "url": "https://i.scdn.co/image/...",
              "height": 640,
              "width": 640
            }
          ]
        }
      ],
      "limit": 20,
      "offset": 0,
      "total": 500
    }
  }
}
```

---

### `GET` `/api/tracks/search/albums`

**Descrição:** Busca álbuns na biblioteca do Spotify.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `q` (string, obrigatório): Termo de busca
- `limit` (number, opcional): Número de resultados (1-50, padrão: 20)
- `offset` (number, opcional): Número de resultados para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "albums": {
      "items": [
        {
          "id": "2up3OPMp9Tb4dAKM2erWXQ",
          "name": "Nome do Álbum",
          "artists": [
            {
              "id": "1uNFoZAHBGtllmzznpCI3s",
              "name": "Nome do Artista"
            }
          ],
          "release_date": "2023-01-15",
          "total_tracks": 12,
          "images": [
            {
              "url": "https://i.scdn.co/image/...",
              "height": 640,
              "width": 640
            }
          ]
        }
      ],
      "limit": 20,
      "offset": 0,
      "total": 300
    }
  }
}
```

---

### `GET` `/api/tracks/track/:trackId`

**Descrição:** Obtém detalhes de uma faixa específica.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `trackId` (string): ID da faixa no Spotify

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "4iV5W9uYEdYUVa79Axb7Rh",
    "name": "Nome da Música",
    "artists": [
      {
        "id": "1uNFoZAHBGtllmzznpCI3s",
        "name": "Nome do Artista"
      }
    ],
    "album": {
      "id": "2up3OPMp9Tb4dAKM2erWXQ",
      "name": "Nome do Álbum",
      "release_date": "2023-01-15"
    },
    "duration_ms": 180000,
    "popularity": 85,
    "explicit": false,
    "preview_url": "https://p.scdn.co/mp3-preview/..."
  }
}
```

**Possíveis Erros:**
- `404` - Faixa não encontrada

---

### `GET` `/api/tracks/tracks`

**Descrição:** Obtém detalhes de múltiplas faixas.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `ids` (string, obrigatório): IDs das faixas separados por vírgula (máximo 50)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": "4iV5W9uYEdYUVa79Axb7Rh",
        "name": "Nome da Música",
        "artists": [
          {
            "id": "1uNFoZAHBGtllmzznpCI3s",
            "name": "Nome do Artista"
          }
        ]
      }
    ]
  }
}
```

---

### `GET` `/api/tracks/artist/:artistId`

**Descrição:** Obtém detalhes de um artista específico.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `artistId` (string): ID do artista no Spotify

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "1uNFoZAHBGtllmzznpCI3s",
    "name": "Nome do Artista",
    "genres": ["pop", "rock"],
    "popularity": 75,
    "followers": {
      "total": 5000000
    },
    "images": [
      {
        "url": "https://i.scdn.co/image/...",
        "height": 640,
        "width": 640
      }
    ]
  }
}
```

---

### `GET` `/api/tracks/artist/:artistId/top-tracks`

**Descrição:** Obtém as faixas mais populares de um artista.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `artistId` (string): ID do artista no Spotify

**Query Parameters:**
- `market` (string, opcional): Código do país (ISO 3166-1 alpha-2, padrão: "US")

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": "4iV5W9uYEdYUVa79Axb7Rh",
        "name": "Nome da Música",
        "popularity": 85,
        "preview_url": "https://p.scdn.co/mp3-preview/..."
      }
    ]
  }
}
```

---

### `GET` `/api/tracks/album/:albumId`

**Descrição:** Obtém detalhes de um álbum específico.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `albumId` (string): ID do álbum no Spotify

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "2up3OPMp9Tb4dAKM2erWXQ",
    "name": "Nome do Álbum",
    "artists": [
      {
        "id": "1uNFoZAHBGtllmzznpCI3s",
        "name": "Nome do Artista"
      }
    ],
    "release_date": "2023-01-15",
    "total_tracks": 12,
    "genres": ["pop"],
    "popularity": 80
  }
}
```

---

### `GET` `/api/tracks/album/:albumId/tracks`

**Descrição:** Lista as faixas de um álbum específico.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:**
- `albumId` (string): ID do álbum no Spotify

**Query Parameters:**
- `limit` (number, opcional): Número de faixas (1-50, padrão: 20)
- `offset` (number, opcional): Número de faixas para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "4iV5W9uYEdYUVa79Axb7Rh",
        "name": "Nome da Música",
        "track_number": 1,
        "duration_ms": 180000,
        "preview_url": "https://p.scdn.co/mp3-preview/..."
      }
    ],
    "limit": 20,
    "offset": 0,
    "total": 12
  }
}
```

---

### `GET` `/api/tracks/player/currently-playing`

**Descrição:** Obtém a faixa atualmente tocando no player do usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": "4iV5W9uYEdYUVa79Axb7Rh",
      "name": "Nome da Música",
      "artists": [
        {
          "name": "Nome do Artista"
        }
      ]
    },
    "is_playing": true,
    "progress_ms": 45000,
    "device": {
      "name": "Spotify Desktop",
      "type": "Computer"
    }
  }
}
```

**Resposta quando nada está tocando (204):** Sem conteúdo

---

### `GET` `/api/tracks/player/recently-played`

**Descrição:** Lista as faixas tocadas recentemente pelo usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `limit` (number, opcional): Número de faixas (1-50, padrão: 20)
- `after` (number, opcional): Timestamp Unix em ms para buscar após uma data
- `before` (number, opcional): Timestamp Unix em ms para buscar antes de uma data

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "track": {
          "id": "4iV5W9uYEdYUVa79Axb7Rh",
          "name": "Nome da Música",
          "artists": [
            {
              "name": "Nome do Artista"
            }
          ]
        },
        "played_at": "2023-07-20T10:30:00.000Z"
      }
    ],
    "limit": 20,
    "cursors": {
      "after": "1690711800000",
      "before": "1690705200000"
    }
  }
}
```

---

### `GET` `/api/tracks/me/top/tracks`

**Descrição:** Lista as faixas mais ouvidas pelo usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `time_range` (string, opcional): Período de tempo ("short_term", "medium_term", "long_term", padrão: "medium_term")
- `limit` (number, opcional): Número de faixas (1-50, padrão: 20)
- `offset` (number, opcional): Número de faixas para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "4iV5W9uYEdYUVa79Axb7Rh",
        "name": "Nome da Música",
        "artists": [
          {
            "name": "Nome do Artista"
          }
        ],
        "popularity": 85
      }
    ],
    "limit": 20,
    "offset": 0,
    "total": 50
  }
}
```

---

### `GET` `/api/tracks/me/top/artists`

**Descrição:** Lista os artistas mais ouvidos pelo usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Query Parameters:**
- `time_range` (string, opcional): Período de tempo ("short_term", "medium_term", "long_term", padrão: "medium_term")
- `limit` (number, opcional): Número de artistas (1-50, padrão: 20)
- `offset` (number, opcional): Número de artistas para pular (padrão: 0)

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1uNFoZAHBGtllmzznpCI3s",
        "name": "Nome do Artista",
        "genres": ["pop", "rock"],
        "popularity": 75,
        "followers": {
          "total": 5000000
        }
      }
    ],
    "limit": 20,
    "offset": 0,
    "total": 50
  }
}
```

---

## 🎮 Controle do Player (`/api/player`)

**Nota:** Todas as rotas do player requerem autenticação e que o usuário tenha o Spotify Premium ativo.

### `GET` `/api/player/current`

**Descrição:** Obtém informações da faixa atualmente tocando.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": "4iV5W9uYEdYUVa79Axb7Rh",
      "name": "Nome da Música",
      "artists": [
        {
          "name": "Nome do Artista"
        }
      ]
    },
    "is_playing": true,
    "progress_ms": 45000
  }
}
```

**Resposta quando nada está tocando (204):**
```json
{
  "message": "No track currently playing"
}
```

---

### `GET` `/api/player/state`

**Descrição:** Obtém o estado completo do player do usuário.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "device": {
      "id": "ed1a31b0976741ba8777c4e0c7e0c5b8e0f3a2a3",
      "is_active": true,
      "is_private_session": false,
      "is_restricted": false,
      "name": "Spotify Desktop",
      "type": "Computer",
      "volume_percent": 70
    },
    "repeat_state": "off",
    "shuffle_state": false,
    "context": {
      "type": "playlist",
      "uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"
    },
    "item": {
      "id": "4iV5W9uYEdYUVa79Axb7Rh",
      "name": "Nome da Música"
    },
    "is_playing": true,
    "progress_ms": 45000
  }
}
```

---

### `GET` `/api/player/devices`

**Descrição:** Lista os dispositivos disponíveis para reprodução.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "id": "ed1a31b0976741ba8777c4e0c7e0c5b8e0f3a2a3",
        "is_active": true,
        "is_private_session": false,
        "is_restricted": false,
        "name": "Spotify Desktop",
        "type": "Computer",
        "volume_percent": 70
      }
    ]
  }
}
```

---

### `PUT` `/api/player/pause`

**Descrição:** Pausa a reprodução atual.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Playback paused successfully"
}
```

**Possíveis Erros:**
- `403` - Usuário não tem Spotify Premium
- `404` - Nenhum dispositivo ativo encontrado

---

### `PUT` `/api/player/play`

**Descrição:** Retoma a reprodução pausada.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Playback resumed successfully"
}
```

**Possíveis Erros:**
- `403` - Usuário não tem Spotify Premium
- `404` - Nenhum dispositivo ativo encontrado

---

### `POST` `/api/player/play`

**Descrição:** Inicia reprodução de músicas específicas ou contexto.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição (Opcional):**
```json
{
  "context_uri": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
  "uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"],
  "offset": {
    "position": 5
  }
}
```

**Campos do corpo:**
- `context_uri` (string, opcional): URI do contexto (playlist, álbum, artista)
- `uris` (array, opcional): Array de URIs de faixas específicas
- `offset` (object, opcional): Posição inicial na lista

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Playback started successfully"
}
```

---

### `POST` `/api/player/next`

**Descrição:** Pula para a próxima faixa na fila.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Skipped to next track successfully"
}
```

---

### `POST` `/api/player/previous`

**Descrição:** Volta para a faixa anterior ou reinicia a faixa atual.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:** Nenhum.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Skipped to previous track successfully"
}
```

---

### `PUT` `/api/player/volume`

**Descrição:** Define o volume do player.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:**
```json
{
  "volume": 50
}
```

**Campos do corpo:**
- `volume` (number, obrigatório): Volume de 0 a 100

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Volume set successfully"
}
```

**Possíveis Erros:**
- `400` - Volume deve ser um número entre 0 e 100

---

### `PUT` `/api/player/seek`

**Descrição:** Avança para uma posição específica na faixa atual.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:**
```json
{
  "position": 60000
}
```

**Campos do corpo:**
- `position` (number, obrigatório): Posição em milissegundos

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Seek position set successfully"
}
```

**Possíveis Erros:**
- `400` - Posição deve ser um número não negativo

---

### `PUT` `/api/player/shuffle`

**Descrição:** Liga ou desliga o modo aleatório.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:**
```json
{
  "state": true
}
```

**Campos do corpo:**
- `state` (boolean, obrigatório): true para ligar, false para desligar

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Shuffle enabled successfully"
}
```

---

### `PUT` `/api/player/repeat`

**Descrição:** Define o modo de repetição.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:**
```json
{
  "state": "track"
}
```

**Campos do corpo:**
- `state` (string, obrigatório): "track" (repetir faixa), "context" (repetir playlist/álbum), "off" (sem repetição)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Repeat mode set to track successfully"
}
```

**Possíveis Erros:**
- `400` - Estado deve ser "track", "context" ou "off"

---

### `PUT` `/api/player/transfer`

**Descrição:** Transfere a reprodução para outro dispositivo.

**Autenticação:** Requer Bearer Token (JWT) no cabeçalho `Authorization`.

**Parâmetros de URL:** Nenhum.

**Corpo da Requisição:**
```json
{
  "device_id": "ed1a31b0976741ba8777c4e0c7e0c5b8e0f3a2a3",
  "play": true
}
```

**Campos do corpo:**
- `device_id` (string, obrigatório): ID do dispositivo de destino
- `play` (boolean, opcional): Se deve iniciar reprodução no novo dispositivo (padrão: false)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Playback transferred successfully"
}
```

**Possíveis Erros:**
- `400` - ID do dispositivo é obrigatório
- `404` - Dispositivo não encontrado

---

## 📊 Códigos de Status HTTP

### Códigos de Sucesso
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição bem-sucedida, sem conteúdo

### Códigos de Erro do Cliente
- `400 Bad Request` - Dados de entrada inválidos
- `401 Unauthorized` - Token ausente, inválido ou expirado
- `403 Forbidden` - Operação não permitida (ex: sem Spotify Premium)
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: favorito já existe)

### Códigos de Erro do Servidor
- `500 Internal Server Error` - Erro interno do servidor
- `502 Bad Gateway` - Erro na comunicação com a API do Spotify
- `503 Service Unavailable` - Serviço temporariamente indisponível

---

## 🔑 Notas de Implementação

### Limitações do Spotify
1. **Spotify Premium:** Controles de player requerem conta Premium
2. **Rate Limits:** A API do Spotify tem limites de requisições
3. **Scopes:** Diferentes funcionalidades requerem diferentes permissões OAuth

### Padrões de Resposta
- Todas as respostas seguem o padrão `{ success: boolean, data?: any, message?: string }`
- Erros incluem código HTTP apropriado e mensagem descritiva
- Paginação segue o padrão do Spotify (offset/limit)

### Segurança
- Tokens JWT têm expiração de 7 dias
- Tokens do Spotify são criptografados no banco de dados
- Todas as rotas protegidas validam autenticação

---

## 🚀 Exemplos de Uso

### Autenticação Completa
```javascript
// 1. Obter URL de autenticação
const authResponse = await fetch('/api/auth/spotify/url');
const { authUrl } = await authResponse.json();

// 2. Redirecionar usuário para authUrl
window.location.href = authUrl;

// 3. Após callback, usar token retornado
const token = new URLSearchParams(window.location.search).get('token');
localStorage.setItem('spotify_token', token);
```

### Adicionar aos Favoritos
```javascript
const response = await fetch('/api/curation/favorites', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
  },
  body: JSON.stringify({
    spotifyTrackId: '4iV5W9uYEdYUVa79Axb7Rh',
    trackName: 'Bohemian Rhapsody',
    artistName: 'Queen'
  })
});
```

### Buscar Músicas
```javascript
const searchResponse = await fetch('/api/tracks/search/tracks?q=bohemian%20rhapsody&limit=10', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
  }
});
const searchResults = await searchResponse.json();
```

### Controlar Player
```javascript
// Pausar reprodução
await fetch('/api/player/pause', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
  }
});

// Definir volume
await fetch('/api/player/volume', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
  },
  body: JSON.stringify({ volume: 75 })
});
```

---

*Documentação gerada automaticamente a partir do código-fonte em ${new Date().toLocaleDateString('pt-BR')}*
