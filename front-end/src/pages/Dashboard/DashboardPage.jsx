import { useEffect, useState } from 'react'
import { getUserPlaylists } from '../../services/api'
import { usePremium } from '../../hooks/usePremium'
import { FreeTierBanner } from '../../components'
import styles from './DashboardPage.module.css'
import PlaylistList from '../../components/PlaylistList/PlaylistList'
import PlaylistSkeleton from '../../components/PlaylistList/PlaylistSkeleton'

function DashboardPage() {
  const { isFree } = usePremium()
  
  const [playlists, setPlaylists] = useState([])
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
    hasNext: false,
    hasPrev: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPlaylists = async (limit = 20, offset = 0) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getUserPlaylists({ limit, offset })
      setPlaylists(data.playlists) 
      setPagination(data.pagination)
    } catch (err) {
      setError('Erro ao carregar suas playlists. Tente novamente.', err)
    } finally {
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchPlaylists(pagination.limit, pagination.offset + pagination.limit)
    }
  }

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchPlaylists(pagination.limit, pagination.offset - pagination.limit)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Suas Playlists</h2>
            <p className={styles.sectionSubtitle}>Carregando playlists...</p>
          </div>
          <div className={styles.playlistsGrid}>
            {Array.from({ length: 20 }).map((_, i) => (
              <PlaylistSkeleton key={i} />
            ))}
          </div>
        </div>
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
      {isFree && (
        <FreeTierBanner 
          message="Assine o Spotify Premium para ter acesso total às funcionalidades de reprodução"
        />
      )}
      
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Suas Playlists</h2>
          <p className={styles.sectionSubtitle}>
            {pagination.total} playlist{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <PlaylistList playlists={playlists} />
        
        {pagination.total > pagination.limit && (
          <div className={styles.paginationContainer}>
            <button 
              className={`${styles.paginationButton} ${!pagination.hasPrev ? styles.disabled : ''}`}
              onClick={handlePrevPage}
              disabled={!pagination.hasPrev}
            >
              ← Anterior
            </button>
            <span className={styles.paginationInfo}>
              {Math.floor(pagination.offset / pagination.limit) + 1} de {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button 
              className={`${styles.paginationButton} ${!pagination.hasNext ? styles.disabled : ''}`}
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
            >
              Próxima →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
