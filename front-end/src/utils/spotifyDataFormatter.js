

/**
 * Formata a duração em milissegundos para formato MM:SS
 * @param {number} durationMs - Duração em milissegundos
 * @returns {string} Duração formatada (ex: "3:45")
 */
export const formatDuration = (durationMs) => {
  if (!durationMs || durationMs <= 0) return '0:00'
  
  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Formata a duração total da playlist
 * @param {number} totalDurationMs - Duração total em milissegundos
 * @returns {string} Duração formatada (ex: "2h 38min")
 */
export const formatPlaylistDuration = (totalDurationMs) => {
  if (!totalDurationMs || totalDurationMs <= 0) return '0min'
  
  const totalMinutes = Math.floor(totalDurationMs / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  
  return `${minutes}min`
}

/**
 * Formata dados da playlist vindos da API do Spotify
 * @param {Object} playlistData - Dados brutos da playlist
 * @returns {Object} Dados formatados da playlist
 */
export const formatPlaylistData = (playlistData) => {
  if (!playlistData) return null
  
  return {
    id: playlistData.id,
    name: playlistData.name || 'Playlist sem nome',
    description: playlistData.description || '',
    image: playlistData.images?.[0]?.url || null,
    owner: {
      id: playlistData.owner?.id,
      displayName: playlistData.owner?.displayName || 'Usuário desconhecido'
    },
    public: playlistData.public === true,
    collaborative: playlistData.collaborative === true,
    totalTracks: playlistData.tracksTotal || playlistData.tracks?.total || 0,
    followers: playlistData.followers || 0,
    externalUrls: playlistData.externalUrls || playlistData.external_urls || {},
    uri: playlistData.uri,
    href: playlistData.href
  }
}

/**
 * Formata dados de uma faixa vindos da API do Spotify
 * @param {Object} trackItem - Item de faixa da playlist (com track e metadata)
 * @returns {Object} Dados formatados da faixa
 */
export const formatTrackData = (trackItem) => {
  if (!trackItem || !trackItem.track) return null
  
  const track = trackItem.track
  

  if (track.isLocal || !track.id) {
    return {
      id: `local_${Math.random().toString(36).substr(2, 9)}`, // ID único para faixas locais
      name: track.name || 'Faixa local',
      artist: track.artists?.[0]?.name || 'Artista desconhecido',
      album: track.album?.name || 'Álbum desconhecido',
      duration: formatDuration(track.durationMs),
      durationMs: track.durationMs || 0,
      addedAt: trackItem.addedAt,
      isLocal: true,
      isAvailable: false,
      previewUrl: null,
      image: null
    }
  }
  
  return {
    id: track.id,
    name: track.name || 'Faixa sem nome',
    artist: track.artists?.map(artist => artist.name).join(', ') || 'Artista desconhecido',
    artists: track.artists || [],
    album: track.album?.name || 'Álbum desconhecido',
    albumId: track.album?.id,
    duration: formatDuration(track.durationMs),
    durationMs: track.durationMs || 0,
    addedAt: trackItem.addedAt,
    addedBy: trackItem.addedBy,
    isLocal: false,
    isAvailable: true,
    previewUrl: track.previewUrl,
    image: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || null, // Usa imagem menor (64x64) se disponível
    popularity: track.popularity || 0,
    explicit: track.explicit === true,
    externalUrls: track.externalUrls || {},
    uri: track.uri,
    href: track.href
  }
}

/**
 * Calcula a duração total de uma lista de faixas
 * @param {Array} tracks - Array de faixas formatadas
 * @returns {number} Duração total em milissegundos
 */
export const calculateTotalDuration = (tracks) => {
  if (!Array.isArray(tracks)) return 0
  
  return tracks.reduce((total, track) => {
    return total + (track.durationMs || 0)
  }, 0)
}

/**
 * Agrupa dados completos da playlist com suas faixas
 * @param {Object} playlistDetails - Detalhes da playlist
 * @param {Object} tracksResponse - Resposta da API com faixas e paginação
 * @returns {Object} Dados completos da playlist
 */
export const formatCompletePlaylistData = (playlistDetails, tracksResponse) => {
  const formattedPlaylist = formatPlaylistData(playlistDetails)
  const formattedTracks = (tracksResponse?.tracks || [])
    .map(formatTrackData)
    .filter(Boolean) // Remove faixas nulas/inválidas
  
  const totalDurationMs = calculateTotalDuration(formattedTracks)
  
  return {
    ...formattedPlaylist,
    tracks: formattedTracks,
    totalDuration: formatPlaylistDuration(totalDurationMs),
    totalDurationMs,
    pagination: tracksResponse?.pagination || null
  }
}

/**
 * Verifica se uma URL de imagem é válida
 * @param {string} imageUrl - URL da imagem
 * @returns {boolean} True se a URL é válida
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return false
  
  try {
    const url = new URL(imageUrl)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Obtém a melhor imagem disponível de um array de imagens
 * @param {Array} images - Array de imagens do Spotify
 * @param {string} preferredSize - Tamanho preferido ('small', 'medium', 'large')
 * @returns {string|null} URL da melhor imagem ou null
 */
export const getBestImage = (images, preferredSize = 'medium') => {
  if (!Array.isArray(images) || images.length === 0) return null
  

  const sortedImages = [...images].sort((a, b) => (b.width || 0) - (a.width || 0))
  
  switch (preferredSize) {
    case 'small': {
      return sortedImages[sortedImages.length - 1]?.url || null
    }
    case 'large': {
      return sortedImages[0]?.url || null
    }
    case 'medium':
    default: {
      const mediumImage = sortedImages.find(img => 
        img.width && img.width >= 200 && img.width <= 400
      )
      return mediumImage?.url || sortedImages[Math.floor(sortedImages.length / 2)]?.url || null
    }
  }
}

/**
 * Formata dados de uma música favorita
 * @param {Object} favoriteData - Dados da música favorita
 * @returns {Object} Dados formatados da música favorita
 */
export const formatFavoriteData = (favoriteData) => {
  if (!favoriteData) return null
  
  return {
    id: favoriteData.spotifyTrackId,
    name: favoriteData.trackName || 'Música sem nome',
    artist: favoriteData.artistName || 'Artista desconhecido',
    album: favoriteData.albumName || 'Álbum desconhecido',
    image: favoriteData.albumImageUrl || null,
    duration: favoriteData.duration || '0:00',
    durationMs: favoriteData.durationMs || 0,
    addedAt: favoriteData.createdAt,
    explicit: false,
    isLocal: false,
    isAvailable: true,
    popularity: 0,
    uri: `spotify:track:${favoriteData.spotifyTrackId}`,
    favoriteId: favoriteData._id
  }
}

/**
 * Formata dados completos de favoritos com paginação
 * @param {Object} favoritesResponse - Resposta da API com favoritos
 * @returns {Object} Dados completos formatados
 */
export const formatCompleteFavoritesData = (favoritesResponse) => {
  const formattedTracks = (favoritesResponse?.favorites || [])
    .map(formatFavoriteData)
    .filter(Boolean)

  return {
    id: 'liked-songs',
    name: 'Músicas Curtidas',
    description: 'Suas músicas favoritas do Spotify',
    image: null,
    tracks: formattedTracks,
    totalTracks: favoritesResponse?.totalTracks ?? favoritesResponse?.pagination?.total ?? formattedTracks.length,
    totalDuration: favoritesResponse?.totalDuration ?? formatPlaylistDuration(favoritesResponse?.totalDurationMs ?? 0),
    totalDurationMs: favoritesResponse?.totalDurationMs ?? 0,
    pagination: favoritesResponse?.pagination || null,
    isLikedSongs: true,
    owner: {
      displayName: 'Você',
      id: 'current-user'
    }
  }
}
