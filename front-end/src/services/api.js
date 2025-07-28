export const getPlaylistFavorites = async (playlistId, { page = 1, limit = 50 } = {}) => {
  const response = await apiClient.get(`/curation/favorites`, {
    params: { playlistId, page, limit }
  })
  return response.data

}
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setupInterceptors = (setShowPremiumModal) => {
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

      if (error.response?.data?.error?.toLowerCase().includes('premium required')) {
        setShowPremiumModal(true)
        return Promise.resolve({ error: true, message: 'Premium required for this action' });
      }

      return Promise.reject(error)
    }
  )
}

export const authService = {
  getSpotifyAuthUrl: async () => {
    const response = await apiClient.get('/auth/spotify/url')
    return response.data
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data

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
    const response = await apiClient.get('/tracks/recent')
    return response.data

  },

  getFavorites: async ({ page = 1, limit = 20 } = {}) => {
    const response = await apiClient.get('/curation/favorites', {
      params: { page, limit }
    })
    return response.data

  },

  addFavorite: async (trackData) => {
    const response = await apiClient.post('/curation/favorites', trackData)
    return response.data

  },

  removeFavorite: async (spotifyTrackId) => {
    const response = await apiClient.delete(`/curation/favorites/${spotifyTrackId}`)
    return response.data

  },

  checkFavorite: async (spotifyTrackId) => {
    const response = await apiClient.get(`/curation/favorites/check/${spotifyTrackId}`)
    return response.data

  }
}

export const categoryService = {
  getCategories: async () => {
    const response = await apiClient.get('/curation/categories')
    return response.data

  },

  createCategory: async (categoryData) => {
    const response = await apiClient.post('/curation/categories', categoryData)
    return response.data

  }
}

export const playlistService = {
  getUserPlaylists: async ({ limit = 20, offset = 0 } = {}) => {
    const response = await apiClient.get('/playlists', {
      params: { limit, offset }
    })
    return response.data

  },

  getPlaylistDetails: async (playlistId) => {
    const response = await apiClient.get(`/playlists/${playlistId}`)
    return response.data
  },

  getPlaylistTracks: async (playlistId, { limit = 50, offset = 0 } = {}) => {
    const response = await apiClient.get(`/playlists/${playlistId}/tracks`, {
      params: { limit, offset }
    })
    return response.data
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
