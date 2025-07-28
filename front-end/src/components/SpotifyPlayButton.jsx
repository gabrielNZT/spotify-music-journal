import React from 'react'
import styles from './SpotifyPlayButton.module.css'
import { useMusicPlayer } from '../hooks/useMusicPlayer'
import { usePremium } from '../hooks/usePremium'
import { useUser } from '../context/UserContext'
import { playTrack, pausePlayback } from '../services/player'
import { PremiumTooltip } from '.'

function SpotifyPlayButton({ track, propsHandlePlayPause }) {
  const { currentTrack, isPlaying, setIsPlaying, setCurrentTrack } = useMusicPlayer()
  const { isPremium } = usePremium()
  const { setShowPremiumModal } = useUser()

  const isCurrentTrack = currentTrack?.id === track.spotifyTrackId

  const handlePlayPause = async (e) => {
    e.stopPropagation && e.stopPropagation()

    if (!isPremium) {
      setShowPremiumModal(true)
      return
    }

    if (propsHandlePlayPause) {
      return propsHandlePlayPause?.(e, isPlaying, isCurrentTrack)
    }

    try {
      if (isPlaying && isCurrentTrack) {
        await pausePlayback()
        setIsPlaying(false)
      } else {
        await playTrack({ uris: [`spotify:track:${track.spotifyTrackId}`] })
        setCurrentTrack({
          id: track.spotifyTrackId,
          name: track.trackName,
          artist: track.artistName,
          album: track.albumName,
          image: track.albumImageUrl,
          duration: track.durationMs
        })
        setIsPlaying(true)
      }
    } catch {
      alert('Erro ao tentar reproduzir a música. Certifique-se que o Spotify está aberto em algum dispositivo.')
    }
  }

  return (
    <button
      className={`${styles.playButton} ${isPlaying && isCurrentTrack ? styles.playing : ''} ${!isPremium ? styles.disabled : ''}`}
      onClick={handlePlayPause}
      aria-label={isPlaying && isCurrentTrack ? 'Pausar música' : 'Reproduzir música'}
      disabled={!isPremium}
    >
      {isPlaying && isCurrentTrack ? (
        <svg viewBox="0 0 24 24" className={styles.playIcon}>
          <rect x="6" y="4" width="4" height="16" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className={styles.playIcon}>
          <polygon points="8,5 19,12 8,19" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}

export default SpotifyPlayButton
