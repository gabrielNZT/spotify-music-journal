import React from 'react'
import styles from './PremiumRequired.module.css'

function PremiumRequired({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <svg viewBox="0 0 24 24" className={styles.spotifyIcon}>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h2 className={styles.title}>Spotify Premium Necessário</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg viewBox="0 0 24 24" className={styles.closeIcon}>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.description}>
            Para usar os controles de reprodução e a barra de música, você precisa ter uma assinatura do <strong>Spotify Premium</strong>.
          </p>
          
          <div className={styles.features}>
            <h3>Com o Spotify Premium você pode:</h3>
            <ul>
              <li>Controlar a reprodução diretamente no app</li>
              <li>Ver a música que está tocando</li>
              <li>Pular faixas e controlar o volume</li>
              <li>Reproduzir qualquer música sem limitações</li>
            </ul>
          </div>
          
          <div className={styles.actions}>
            <a 
              href="https://www.spotify.com/premium/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.upgradeButton}
            >
              Fazer Upgrade para Premium
            </a>
            <button 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Continuar sem Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumRequired
