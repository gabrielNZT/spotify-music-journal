import styles from './PlaylistDetailSkeleton.module.css'

function PlaylistDetailSkeleton() {
  return (
    <div className={styles.detailContainer}>
      {/* Hero Section Skeleton */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.albumArtWrapper}>
            <div className={styles.skeletonAlbumArt} />
          </div>
          
          <div className={styles.playlistInfo}>
            <div className={styles.skeletonPlaylistType} />
            <div className={styles.skeletonPlaylistTitle} />
            <div className={styles.skeletonPlaylistDescription} />
            
            <div className={styles.skeletonPlaylistMeta}>
              <div className={styles.skeletonOwnerAvatar} />
              <div className={styles.skeletonOwnerName} />
              <div className={styles.skeletonMetaDivider} />
              <div className={styles.skeletonTrackCount} />
              <div className={styles.skeletonMetaDivider} />
              <div className={styles.skeletonDuration} />
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section Skeleton */}
      <section className={styles.controlsSection}>
        <div className={styles.skeletonPlayButton} />
        <div className={styles.skeletonSecondaryButton} />
        <div className={styles.skeletonSecondaryButton} />
      </section>

      {/* Tracks Section Skeleton */}
      <section className={styles.tracksSection}>
        <div className={styles.tracksHeader}>
          <span>#</span>
          <span>Título</span>
          <span>Álbum</span>
          <span>
            <div className={styles.skeletonClockIcon} />
          </span>
        </div>
        
        <div className={styles.tracksList}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div className={styles.trackRow} key={i}>
              <div className={styles.trackNumberCell}>
                <div className={styles.skeletonTrackIndex} />
              </div>
              
              <div className={styles.trackInfo}>
                <div className={styles.trackDetails}>
                  <div className={styles.skeletonTrackName} />
                  <div className={styles.skeletonTrackArtist} />
                </div>
              </div>
              
              <div className={styles.trackAlbumCell}>
                <div className={styles.skeletonAlbumName} />
              </div>
              
              <div className={styles.trackActions}>
                <div className={styles.skeletonLikeButton} />
                <div className={styles.skeletonTrackTime} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PlaylistDetailSkeleton
