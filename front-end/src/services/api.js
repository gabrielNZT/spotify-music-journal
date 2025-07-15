import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  getSpotifyAuthUrl: async () => {
    try {
      const response = await apiClient.get('/auth/spotify/url')
      return response.data
    } catch (error) {
      console.error('Erro ao obter URL de autenticação:', error)
      throw error
    }
  },

  getMe: async () => {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error)
      throw error
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('jwt_token')
  },

  logout: () => {
    localStorage.removeItem('jwt_token')
    window.location.href = '/login'
  },

  saveToken: (token) => {
    localStorage.setItem('jwt_token', token)
  },

  getToken: () => {
    return localStorage.getItem('jwt_token')
  }
}

export const musicService = {
  getRecentTracks: async () => {
    try {
      const response = await apiClient.get('/tracks/recent')
      return response.data
    } catch (error) {
      console.error('Erro ao obter músicas recentes:', error)
      throw error
    }
  },

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
  getCategories: async () => {
    try {
      const response = await apiClient.get('/curation/categories')
      return response.data
    } catch (error) {
      console.error('Erro ao obter categorias:', error)
      throw error
    }
  },

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

export const playlistService = {
  getUserPlaylists: async ({ limit = 20, offset = 0 } = {}) => {
    try {
      const response = await apiClient.get('/playlists', {
        params: { limit, offset }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar playlists:', error)
      throw error
    }
  },

  getPlaylistDetails: async (playlistId) => {
    try {
      const response = await apiClient.get(`/playlists/${playlistId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar detalhes da playlist:', error)
      throw error
    }
  },

  getPlaylistTracks: async (playlistId, { limit = 50, offset = 0 } = {}) => {
    try {
      const response = await apiClient.get(`/playlists/${playlistId}/tracks`, {
        params: { limit, offset }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar faixas da playlist:', error)
      throw error
    }
  }
}

export const getUserPlaylists = playlistService.getUserPlaylists
export const getPlaylistDetails = playlistService.getPlaylistDetails
export const getPlaylistTracks = playlistService.getPlaylistTracks

export default apiClient
