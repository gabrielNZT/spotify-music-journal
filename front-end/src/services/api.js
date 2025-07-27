export const getPlaylistFavorites = async (playlistId, { page = 1, limit = 50 } = {}) => {
  try {
    const response = await apiClient.get(`/curation/favorites`, {
      params: { playlistId, page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao obter favoritos da playlist:', error)
    throw error
  }
}
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

  getFavorites: async ({ page = 1, limit = 20 } = {}) => {
    try {
      const response = await apiClient.get('/curation/favorites', {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao obter favoritas:', error)
      throw error
    }
  },

  addFavorite: async (trackData) => {
    try {
      const response = await apiClient.post('/curation/favorites', trackData)
      return response.data
    } catch (error) {
      console.error('Erro ao adicionar favorita:', error)
      throw error
    }
  },

  removeFavorite: async (spotifyTrackId) => {
    try {
      const response = await apiClient.delete(`/curation/favorites/${spotifyTrackId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao remover favorita:', error)
      throw error
    }
  },

  checkFavorite: async (spotifyTrackId) => {
    try {
      const response = await apiClient.get(`/curation/favorites/check/${spotifyTrackId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao verificar favorita:', error)
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

export const discoverApi = {
  generateRecommendation: async (userInput) => {
    try {
      const response = await apiClient.post('/discovery/generate', { userInput })
      if (response.data?.success && response.data?.data) {
        return response.data.data
      }
      throw response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw { error: 'Erro ao conectar com o servidor' }
    }
  },
  getRecommendationHistory: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/discovery/history?limit=${limit}`)
      if (response.data?.success && response.data?.data) {
        return response.data.data
      }
      throw response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw { error: 'Erro ao conectar com o servidor' }
    }
  },
  getRecommendationById: async (id) => {
    try {
      const response = await apiClient.get(`/discovery/${id}`)
      if (response.data?.success && response.data?.data) {
        return response.data.data
      }
      throw response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw { error: 'Erro ao conectar com o servidor' }
    }
  }
  ,
  rateRecommendation: async (id, rating) => {
    try {
      const response = await apiClient.post(`/discovery/${id}/rate`, { rating })
      if (response.data?.success) {
        return response.data
      }
      throw response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw { error: 'Erro ao conectar com o servidor' }
    }
  }
}

export const getUserPlaylists = playlistService.getUserPlaylists
export const getPlaylistDetails = playlistService.getPlaylistDetails
export const getPlaylistTracks = playlistService.getPlaylistTracks
export const getFavorites = musicService.getFavorites
export const addFavorite = musicService.addFavorite
export const removeFavorite = musicService.removeFavorite
export const checkFavorite = musicService.checkFavorite

export default apiClient
