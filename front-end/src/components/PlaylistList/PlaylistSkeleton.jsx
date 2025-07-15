import styles from './PlaylistSkeleton.module.css'

function PlaylistSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonLine} style={{ width: '70%' }} />
        <div className={styles.skeletonLine} style={{ width: '40%' }} />
        <div className={styles.skeletonLine} style={{ width: '50%' }} />
      </div>
    </div>
  )
}

export default PlaylistSkeleton
