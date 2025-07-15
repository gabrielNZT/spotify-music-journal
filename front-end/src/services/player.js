import apiClient from './api'

export const playTrack = async ({ contextUri, uris, offset }) => {
  try {
    const response = await apiClient.post('/player/play', {
      context_uri: contextUri,
      uris,
      offset
    })
    return response.data
  } catch (error) {
    throw error
  }
}
