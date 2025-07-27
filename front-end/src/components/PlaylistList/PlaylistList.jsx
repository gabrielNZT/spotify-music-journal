import styles from './PlaylistList.module.css'
import { useNavigate } from 'react-router-dom'

function PlaylistList({ playlists }) {
  const navigate = useNavigate()
  if (!playlists || playlists.length === 0) {
    return (
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
    )
  }

  return (
    <div className={styles.playlistsGrid}>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className={styles.playlistCard}
          onClick={() => navigate(`/dashboard/${playlist.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.coverWrapper}>
            <img
              src={playlist.images?.[0]?.url || '/placeholder-playlist.jpg'}
              alt={playlist.name}
              className={styles.coverImage}
            />
          </div>
          <div className={styles.playlistInfo}>
            <span className={styles.playlistName}>{playlist.name}</span>
            <span className={styles.playlistOwner}>{playlist.owner?.displayName}</span>
            <span className={styles.playlistTracks}>{playlist.tracksTotal} músicas</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlaylistList
