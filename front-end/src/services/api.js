import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'

// Configuração do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptador para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token') // Usando jwt_token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptador para tratar respostas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('jwt_token') // Usando jwt_token
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Serviços de autenticação
export const authService = {
  // Obter URL de autenticação do Spotify
  getSpotifyAuthUrl: async () => {
    try {
      const response = await apiClient.get('/auth/spotify/url')
      return response.data
    } catch (error) {
      console.error('Erro ao obter URL de autenticação:', error)
      throw error
    }
  },

  // Obter dados do usuário autenticado
  getMe: async () => {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error)
      throw error
    }
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('jwt_token') // Usando jwt_token
  },

  // Fazer logout
  logout: () => {
    localStorage.removeItem('jwt_token') // Usando jwt_token
    window.location.href = '/login'
  },

  // Salvar token
  saveToken: (token) => {
    localStorage.setItem('jwt_token', token) // Usando jwt_token
  },

  // Obter token
  getToken: () => {
    return localStorage.getItem('jwt_token') // Usando jwt_token
  }
}

// Serviços para outras funcionalidades (placeholder para futuras implementações)
export const musicService = {
  // Obter músicas recentes
  getRecentTracks: async () => {
    try {
      const response = await apiClient.get('/tracks/recent')
      return response.data
    } catch (error) {
      console.error('Erro ao obter músicas recentes:', error)
      throw error
    }
  },

  // Obter favoritas
  getFavorites: async () => {
    try {
      const response = await apiClient.get('/curation/favorites')
      return response.data
    } catch (error) {
      console.error('Erro ao obter favoritas:', error)
      throw error
    }
  }
}

export const categoryService = {
  // Obter categorias do usuário
  getCategories: async () => {
    try {
      const response = await apiClient.get('/curation/categories')
      return response.data
    } catch (error) {
      console.error('Erro ao obter categorias:', error)
      throw error
    }
  },

  // Criar nova categoria
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/curation/categories', categoryData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      throw error
    }
  }
}

// Serviços de playlists
export const playlistService = {
  // Obter playlists do usuário com paginação
  getUserPlaylists: async ({ limit = 20, offset = 0 } = {}) => {
    try {
      const response = await apiClient.get('/playlists', {
        params: { limit, offset }
      })
      return response.data // Retorna { playlists: [...], pagination: {...} }
    } catch (error) {
      console.error('Erro ao buscar playlists:', error)
      throw error
    }
  }
}

// Função de compatibilidade (mantendo a função original)
export const getUserPlaylists = playlistService.getUserPlaylists

export default apiClient
