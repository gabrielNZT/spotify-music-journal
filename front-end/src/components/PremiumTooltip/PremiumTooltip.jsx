import styles from './PremiumTooltip.module.css'

function PremiumTooltip({ children, message = "Esta funcionalidade requer Spotify Premium", position = "top" }) {
  return (
    <div className={styles.container}>
      {children}
      <div className={`${styles.tooltip} ${styles[position]}`}>
        <div className={styles.content}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{message}</span>
        </div>
        <a 
          href="https://www.spotify.com/premium/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.upgradeLink}
        >
          Fazer Upgrade
        </a>
      </div>
    </div>
  )
}

export default PremiumTooltip
