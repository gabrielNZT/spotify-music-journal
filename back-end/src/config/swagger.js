const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spotify Music Journal API',
      version: '1.0.0',
      description: 'API para gerenciamento de favoritos musicais, recomendações IA e integração com Spotify',
      contact: {
        name: 'Gabriel',
        email: 'gabriel@example.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.spotify-music-journal.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do login com Spotify'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do usuário'
            },
            displayName: {
              type: 'string',
              description: 'Nome de exibição do usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            profileImageUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL da foto de perfil'
            },
            product: {
              type: 'string',
              enum: ['free', 'premium'],
              description: 'Tipo de conta Spotify'
            }
          }
        },
        Track: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID da música no Spotify'
            },
            name: {
              type: 'string',
              description: 'Nome da música'
            },
            artist: {
              type: 'string',
              description: 'Nome do artista'
            },
            album: {
              type: 'string',
              description: 'Nome do álbum'
            },
            duration: {
              type: 'string',
              description: 'Duração formatada (ex: 3:45)'
            },
            durationMs: {
              type: 'number',
              description: 'Duração em milissegundos'
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'URL da capa do álbum'
            },
            explicit: {
              type: 'boolean',
              description: 'Se contém conteúdo explícito'
            },
            uri: {
              type: 'string',
              description: 'URI do Spotify'
            }
          }
        },
        Playlist: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID da playlist'
            },
            name: {
              type: 'string',
              description: 'Nome da playlist'
            },
            description: {
              type: 'string',
              description: 'Descrição da playlist'
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'URL da imagem da playlist'
            },
            totalTracks: {
              type: 'number',
              description: 'Número total de faixas'
            },
            owner: {
              type: 'object',
              properties: {
                displayName: {
                  type: 'string',
                  description: 'Nome do proprietário'
                }
              }
            },
            collaborative: {
              type: 'boolean',
              description: 'Se é colaborativa'
            },
            public: {
              type: 'boolean',
              description: 'Se é pública'
            }
          }
        },
        Favorite: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do favorito'
            },
            spotifyTrackId: {
              type: 'string',
              description: 'ID da música no Spotify'
            },
            trackName: {
              type: 'string',
              description: 'Nome da música'
            },
            artistName: {
              type: 'string',
              description: 'Nome do artista'
            },
            albumName: {
              type: 'string',
              description: 'Nome do álbum'
            },
            albumImageUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL da capa do álbum'
            },
            durationMs: {
              type: 'number',
              description: 'Duração em milissegundos'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          }
        },
        Recommendation: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único da recomendação'
            },
            userInput: {
              type: 'string',
              description: 'Input do usuário'
            },
            aiResponse: {
              type: 'string',
              description: 'Resposta da IA'
            },
            tracks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Track'
              },
              description: 'Músicas recomendadas'
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Avaliação da recomendação'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              description: 'Total de itens'
            },
            limit: {
              type: 'number',
              description: 'Limite por página'
            },
            offset: {
              type: 'number',
              description: 'Offset atual'
            },
            hasNext: {
              type: 'boolean',
              description: 'Se há próxima página'
            },
            hasPrev: {
              type: 'boolean',
              description: 'Se há página anterior'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Tipo do erro'
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/api/*/*.js'], // Caminhos para os arquivos com anotações JSDoc
};

const specs = swaggerJSDoc(options);

module.exports = specs;
