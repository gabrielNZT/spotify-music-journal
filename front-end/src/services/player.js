import apiClient from './api'

export async function playTrack({ contextUri, uris, offset }) {
  const response = await apiClient.post('/player/play', {
    context_uri: contextUri,
    uris,
    offset
  })
  return response.data
}

export async function getCurrentlyPlaying() {
  const response = await apiClient.get('/tracks/player/currently-playing')
  return response.data
}

export async function pausePlayback() {
  const response = await apiClient.put('/player/pause')
  return response.data
}

export async function resumePlayback() {
  const response = await apiClient.put('/player/play')
  return response.data
}

export async function skipToNext() {
  const response = await apiClient.post('/player/next')
  return response.data
}

export async function skipToPrevious() {
  const response = await apiClient.post('/player/previous')
  return response.data
}

export async function setVolume(volume) {
  const response = await apiClient.put('/player/volume', { volume })
  return response.data
}

export async function getPlayerState() {
  const response = await apiClient.get('/player/state')
  return response.data
}

export async function seekToPosition(position) {
  const response = await apiClient.put('/player/seek', { position })
  return response.data
}

export async function setShuffle(state) {
  const response = await apiClient.put('/player/shuffle', { state })
  return response.data
}

export async function setRepeat(state) {
  const response = await apiClient.put('/player/repeat', { state })
  return response.data
}
