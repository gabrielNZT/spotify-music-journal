import styles from './FreeTierBanner.module.css'
import { usePremium } from '../../hooks/usePremium'

function FreeTierBanner({ showUpgrade = true, message, className = '' }) {
  const { isFree } = usePremium()
  
  if (!isFree) return null
  
  return (
    <div className={`${styles.banner} ${className}`}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className={styles.text}>
          <span className={styles.title}>Conta Gratuita</span>
          <span className={styles.description}>
            {message || 'Algumas funcionalidades podem ter limitações'}
          </span>
        </div>
        {showUpgrade && (
          <a 
            href="https://www.spotify.com/premium/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.upgradeButton}
          >
            Fazer Upgrade
          </a>
        )}
      </div>
    </div>
  )
}

export default FreeTierBanner
