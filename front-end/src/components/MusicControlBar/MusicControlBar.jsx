import React, { useState, useRef } from 'react'
import { pausePlayback, resumePlayback, skipToNext, skipToPrevious, setVolume } from '../../services/player'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'
import { PremiumRequired } from '..'
import styles from './MusicControlBar.module.css'

function MusicControlBar() {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    duration, 
    isVisible,
    showPremiumModal,
    setIsPlaying, 
    fetchCurrentTrack,
    closePremiumModal
  } = useMusicPlayer()
  
  const [volume, setVolumeState] = useState(50)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const volumeTimeoutRef = useRef(null)

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await pausePlayback()
        setIsPlaying(false)
      } else {
        await resumePlayback()
        setIsPlaying(true)
      }
    } catch {
      // Silent error handling
    }
  }

  const handleNext = async () => {
    try {
      await skipToNext()
      // Fetch new track info after a short delay
      setTimeout(fetchCurrentTrack, 500)
    } catch {
      // Silent error handling
    }
  }

  const handlePrevious = async () => {
    try {
      await skipToPrevious()
      // Fetch new track info after a short delay
      setTimeout(fetchCurrentTrack, 500)
    } catch {
      // Silent error handling
    }
  }

  const handleVolumeChange = async (newVolume) => {
    try {
      setVolumeState(newVolume)
      
      // Debounce volume changes
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current)
      }
      
      volumeTimeoutRef.current = setTimeout(async () => {
        await setVolume(newVolume)
      }, 300)
    } catch {
      // Silent error handling
    }
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!duration) return 0
    return (progress / duration) * 100
  }

  if (!isVisible || !currentTrack) {
    return null
  }

  return (
    <div className={styles.musicControlBar}>
      <div className={styles.trackInfo}>
        <div className={styles.albumArt}>
          <img 
            src={currentTrack.album?.images?.[0]?.url || '/placeholder-playlist.svg'} 
            alt={currentTrack.album?.name || 'Album art'}
            onError={(e) => {
              e.target.src = '/placeholder-playlist.svg'
            }}
          />
        </div>
        <div className={styles.trackDetails}>
          <span className={styles.trackName} title={currentTrack.name}>
            {currentTrack.name}
          </span>
          <span className={styles.artistName} title={currentTrack.artists?.map(a => a.name).join(', ')}>
            {currentTrack.artists?.map(a => a.name).join(', ')}
          </span>
        </div>
      </div>

      <div className={styles.playerControls}>
        <div className={styles.controlButtons}>
          <button 
            className={styles.controlButton}
            onClick={handlePrevious}
            aria-label="Faixa anterior"
          >
            <svg viewBox="0 0 16 16" className={styles.controlIcon}>
              <path d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v11.788a.7.7 0 01-1.05.606L4 7.864v5.236a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z"/>
            </svg>
          </button>

          <button 
            className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 16 16" className={styles.playIcon}>
                <rect x="3" y="2" width="3" height="12" fill="currentColor"/>
                <rect x="10" y="2" width="3" height="12" fill="currentColor"/>
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className={styles.playIcon}>
                <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.287V1.713z"/>
              </svg>
            )}
          </button>

          <button 
            className={styles.controlButton}
            onClick={handleNext}
            aria-label="Próxima faixa"
          >
            <svg viewBox="0 0 16 16" className={styles.controlIcon}>
              <path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v11.788a.7.7 0 001.05.606L12 8.864v5.236a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"/>
            </svg>
          </button>
        </div>

        <div className={styles.progressSection}>
          <span className={styles.currentTime}>{formatTime(progress)}</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <span className={styles.totalTime}>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.volumeControls}>
        <button 
          className={styles.volumeButton}
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          aria-label="Controlar volume"
        >
          <svg viewBox="0 0 16 16" className={styles.volumeIcon}>
            {volume === 0 ? (
              <path d="M13.86 5.47a.75.75 0 00-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 008.8 6.53L10.269 8l-1.47 1.47a.75.75 0 101.061 1.06L11.33 9.06l1.47 1.47a.75.75 0 001.06-1.06L12.39 8l1.47-1.47a.75.75 0 000-1.06z"/>
            ) : volume < 33 ? (
              <path d="M9.741.85a.8.8 0 01.375.65v13a.8.8 0 01-1.125.73L6.911 14H2a1 1 0 01-1-1V3a1 1 0 011-1h4.911l2.08-1.23a.8.8 0 01.75.08z"/>
            ) : volume < 66 ? (
              <>
                <path d="M9.741.85a.8.8 0 01.375.65v13a.8.8 0 01-1.125.73L6.911 14H2a1 1 0 01-1-1V3a1 1 0 011-1h4.911l2.08-1.23a.8.8 0 01.75.08zM11.5 4.75a.75.75 0 011.5 0 3.5 3.5 0 010 6.5.75.75 0 11-1.5 0 2 2 0 000-6.5z"/>
              </>
            ) : (
              <>
                <path d="M9.741.85a.8.8 0 01.375.65v13a.8.8 0 01-1.125.73L6.911 14H2a1 1 0 01-1-1V3a1 1 0 011-1h4.911l2.08-1.23a.8.8 0 01.75.08zM11.5 4.75a.75.75 0 011.5 0 3.5 3.5 0 010 6.5.75.75 0 11-1.5 0 2 2 0 000-6.5z"/>
                <path d="M15.5 8a7.5 7.5 0 01-2.046 5.131.75.75 0 01-1.061-1.061 6 6 0 000-8.14.75.75 0 111.06-1.06A7.5 7.5 0 0115.5 8z"/>
              </>
            )}
          </svg>
        </button>
        
        {showVolumeSlider && (
          <div className={styles.volumeSlider}>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className={styles.volumeInput}
            />
          </div>
        )}
      </div>
      
      {showPremiumModal && <PremiumRequired onClose={closePremiumModal} />}
    </div>
  )
}

export default MusicControlBar
