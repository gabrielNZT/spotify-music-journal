import { useState, useEffect } from 'react'
import { authService, musicService } from '../../services/api'
import styles from './DashboardPage.module.css'
import { PlaylistCard } from '../../components'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [recentTracks, setRecentTracks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError('')

        const userData = await authService.getMe()
        setUser(userData.user)

        try {
          const playlistsData = await musicService.getUserPlaylists()
          setPlaylists(playlistsData || [])
        } catch (playlistError) {
          console.log('Erro ao carregar playlists (esperado):', playlistError)
          setPlaylists([
            {
              id: '1',
              name: 'Minhas Curtidas',
              description: 'Suas músicas curtidas',
              images: [{ url: '/placeholder-playlist.jpg' }],
              tracks: { total: 127 },
              owner: { display_name: userData.user.displayName }
            },
            {
              id: '2', 
              name: 'Rock Clássico',
              description: 'Os maiores sucessos do rock',
              images: [{ url: '/placeholder-playlist.jpg' }],
              tracks: { total: 84 },
              owner: { display_name: userData.user.displayName }
            }
          ])
        }

        try {
          const recentData = await musicService.getRecentlyPlayed()
          setRecentTracks(recentData || [])
        } catch (recentError) {
          console.log('Erro ao carregar faixas recentes (esperado):', recentError)
          setRecentTracks([])
        }

      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
        setError('Erro ao carregar seus dados. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handlePlaylistClick = (playlist) => {
    console.log('Abrindo playlist:', playlist.name)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Carregando suas playlists...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Ops! Algo deu errado</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Boa tarde, {user?.displayName || 'Usuário'}!
          </h1>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Suas Playlists</h2>
        </div>
        
        {playlists.length > 0 ? (
          <div className={styles.playlistsGrid}>
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => handlePlaylistClick(playlist)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>Nenhuma playlist encontrada</h3>
            <p className={styles.emptyDescription}>
              Suas playlists do Spotify aparecerão aqui
            </p>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tocadas Recentemente</h2>
        </div>
        
        {recentTracks.length > 0 ? (
          <div className={styles.recentTracks}>
            {recentTracks.map((track, index) => (
              <div key={index} className={styles.trackItem}>
                <div className={styles.trackInfo}>
                  <span className={styles.trackName}>{track.name}</span>
                  <span className={styles.artistName}>{track.artist}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>Nenhuma música encontrada</h3>
            <p className={styles.emptyDescription}>
              Comece a ouvir música no Spotify para ver suas faixas aqui
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
