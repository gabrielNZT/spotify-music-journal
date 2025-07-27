import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../../services/api'
import { formatCompleteFavoritesData } from '../../utils/spotifyDataFormatter'
import TrackDetailView from '../../components/TrackDetailView/TrackDetailView'
import PlaylistDetailSkeleton from '../Playlist/PlaylistDetailSkeleton'

function LikedSongsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchFavorites = useCallback(async (page = 1, append = false) => {
    if (!append) {
      setLoading(true)
      setError(null)
    }

    try {
      const response = await getFavorites({ page, limit: 50 })
      const formattedData = formatCompleteFavoritesData(response)

      if (append) {
        setPlaylist(prev => ({
          ...formattedData,
          tracks: prev && prev.tracks ? [...prev.tracks, ...formattedData.tracks] : [...formattedData.tracks]
        }))
      } else {
        setPlaylist(formattedData)
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError('Erro ao carregar suas músicas favoritas. Tente novamente.')
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [navigate])

  const handleLoadMore = useCallback(async () => {
    if (!playlist?.pagination?.hasNext || loadingMore) return

    setLoadingMore(true)
    const nextPage = playlist.pagination.page + 1
    await fetchFavorites(nextPage, true)
  }, [playlist?.pagination, loadingMore, fetchFavorites])

  const handleToggleFavorite = useCallback(async (trackId, isAdding) => {
    if (!isAdding) {
      await removeFavorite(trackId)
      setPlaylist(prev => ({
        ...prev,
        tracks: prev.tracks.filter(track => track.id !== trackId),
        totalTracks: prev.totalTracks - 1
      }))
    }
  }, [])

  const handleRetry = () => {
    fetchFavorites()
  }

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return (
    <TrackDetailView
      playlist={playlist}
      loading={loading}
      error={error}
      isLikedSongs
      onRetry={handleRetry}
      onLoadMore={handleLoadMore}
      loadingMore={loadingMore}
      onToggleFavorite={handleToggleFavorite}
      skeleton={PlaylistDetailSkeleton}
    />
  )
}

export default LikedSongsPage
