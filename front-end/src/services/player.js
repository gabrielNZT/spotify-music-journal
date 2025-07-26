import apiClient from './api'

export async function playTrack({ contextUri, uris, offset }) {
  const response = await apiClient.post('/player/play', {
    context_uri: contextUri,
    uris,
    offset
  })
  return response.data
}
