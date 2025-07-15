import styles from './PlaylistCard.module.css'

function PlaylistCard({ playlist, onClick }) {
  const {
    name,
    images,
    description,
    tracks,
    owner
  } = playlist

  const coverImage = images && images.length > 0 ? images[0].url : null
  const trackCount = tracks?.total || 0

  return (
    <div className={styles.playlistCard} onClick={onClick}>
      <div className={styles.coverContainer}>
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={`Capa da playlist ${name}`}
            className={styles.coverImage}
          />
        ) : (
          <div className={styles.coverPlaceholder}>
            <svg className={styles.placeholderIcon} viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
        
        <div className={styles.playOverlay}>
          <button className={styles.playButton}>
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.playlistInfo}>
        <h3 className={styles.playlistName} title={name}>
          {name}
        </h3>
        
        {description && (
          <p className={styles.playlistDescription} title={description}>
            {description}
          </p>
        )}
        
        <div className={styles.playlistMeta}>
          <span className={styles.trackCount}>
            {trackCount} música{trackCount !== 1 ? 's' : ''}
          </span>
          {owner && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.ownerName}>
                {owner.display_name}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard
