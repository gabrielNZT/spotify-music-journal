import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { playTrack } from '../../services/player'
import { addFavorite, removeFavorite } from '../../services/api'
import styles from './TrackDetailView.module.css'
import { SpotifyToast } from '../'

function TrackDetailView({ 
  playlist, 
  loading, 
  error, 
  onRetry, 
  onLoadMore, 
  loadingMore = false,
  onToggleFavorite,
  isLikedSongs = false,
  skeleton: SkeletonComponent 
}) {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [favoriteStates, setFavoriteStates] = useState({})
  const loadMoreRef = useRef(null)
  const isFetchingRef = useRef(false)

  const defaultImage = '/placeholder-playlist.svg'

  const handleImageError = (e) => {
    e.target.src = defaultImage
  }

  const handlePlayPause = async () => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return
    
    try {
      if (playlist.isLikedSongs) {
        await playTrack({
          uris: playlist.tracks.map(track => track.uri)
        })
      } else {
        await playTrack({
          contextUri: `spotify:playlist:${playlist.id}`
        })
      }
      setIsPlaying(true)
    } catch (err) {
      if (err?.response?.data?.error.includes('No active device found')) {
        setToast({
          message: (
            <>
              <strong>Nenhum dispositivo Spotify está ativo.</strong><br />
              Para ouvir músicas, abra o Spotify em algum dispositivo (web, desktop ou mobile) e tente novamente.<br />
              <span style={{ fontSize: '0.95em', color: '#b3b3b3', display: 'block', marginTop: 8 }}>
                Dica: Abra <b>open.spotify.com</b> em outra aba e dê play em qualquer música para ativar o Web Player.
              </span>
            </>
          ),
          type: 'error',
        })
        return
      } else {
        setToast({ message: 'Erro ao tentar reproduzir', type: 'error' })
      }
    }
  }

  const handleTrackPlay = async (trackId) => {
    setCurrentTrack(trackId)
    try {
      const track = playlist.tracks.find(t => t.id === trackId)
      if (!track) return

      if (playlist.isLikedSongs) {
        const trackIndex = playlist.tracks.findIndex(t => t.id === trackId)
        await playTrack({
          uris: playlist.tracks.map(t => t.uri),
          offset: { position: trackIndex }
        })
      } else {
        await playTrack({
          contextUri: `spotify:playlist:${playlist.id}`,
          offset: { position: playlist.tracks.findIndex(t => t.id === trackId) }
        })
      }
      setIsPlaying(true)
    } catch (err) {
      if (err?.response?.data?.error.includes('No active device found')) {
        setToast({
          message: (
            <>
              <strong>Nenhum dispositivo Spotify está ativo.</strong><br />
              Para ouvir músicas, abra o Spotify em algum dispositivo (web, desktop ou mobile) e tente novamente.<br />
              <span style={{ fontSize: '0.95em', color: '#b3b3b3', display: 'block', marginTop: 8 }}>
                Dica: Abra <b>open.spotify.com</b> em outra aba e dê play em qualquer música para ativar o Web Player.
              </span>
            </>
          ),
          type: 'error',
        })
        return
      } else {
        setToast({ message: 'Erro ao tentar reproduzir a faixa', type: 'error' })
      }
    }
  }

  const handleToggleFavorite = async (track, e) => {
    e.stopPropagation()
    
    const isCurrentlyFavorite = favoriteStates[track.id] ?? false
    
    try {
      if (isCurrentlyFavorite) {
        await removeFavorite(track.id)
        setFavoriteStates(prev => ({ ...prev, [track.id]: false }))
        setToast({ message: 'Removido dos favoritos', type: 'success' })
        
        if (onToggleFavorite) {
          onToggleFavorite(track.id, false)
        }
      } else {
        await addFavorite({
          spotifyTrackId: track.id,
          trackName: track.name,
          artistName: track.artist,
          albumImageUrl: track.image
        })
        setFavoriteStates(prev => ({ ...prev, [track.id]: true }))
        setToast({ message: 'Adicionado aos favoritos', type: 'success' })
        
        if (onToggleFavorite) {
          onToggleFavorite(track.id, true)
        }
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        setToast({ message: 'Esta música já está nos favoritos', type: 'warning' })
      } else {
        setToast({ message: 'Erro ao atualizar favoritos', type: 'error' })
      }
    }
  }

  const loadMoreTracks = useCallback(() => {
    if (!playlist?.pagination?.hasNext || loadingMore || isFetchingRef.current) {
      return
    }

    isFetchingRef.current = true
    if (onLoadMore) {
      onLoadMore().finally(() => {
        isFetchingRef.current = false
      })
    }
  }, [playlist?.pagination?.hasNext, loadingMore, onLoadMore])

  useEffect(() => {
    if (!playlist?.pagination?.hasNext || loading) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMoreTracks();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [playlist?.pagination?.hasNext, loading, loadMoreTracks]);

  const handleToastClose = () => setToast(null)

  if (loading && SkeletonComponent) return <SkeletonComponent isLikedSongs={isLikedSongs} />

  if (error) {
    return (
      <>
        {toast && <SpotifyToast message={toast.message} type={toast.type} onClose={handleToastClose} />}
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>Ops! Algo deu errado</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.retryButton} onClick={onRetry}>
              Tentar Novamente
            </button>
          </div>
        </div>
      </>
    )
  }

  if (!playlist) {
    return (
      <>
        {toast && <SpotifyToast message={toast.message} type={toast.type} onClose={handleToastClose} />}
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>Conteúdo não encontrado</h2>
            <p className={styles.errorMessage}>
              O conteúdo solicitado não existe ou não está disponível.
            </p>
            <button className={styles.retryButton} onClick={() => navigate('/dashboard')}>
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {toast && <SpotifyToast message={toast.message} type={toast.type} onClose={handleToastClose} />}
      <div className={`${styles.detailContainer} ${playlist.isLikedSongs ? styles.likedSongs : ''}`}>
        <section className={`${styles.heroSection} ${playlist.isLikedSongs ? styles.likedSongsHero : ''}`}>
          <div className={styles.heroContent}>
            <div className={styles.albumArtWrapper}>
              <div className={`${styles.albumArtContainer} ${playlist.isLikedSongs ? styles.likedSongsArt : ''}`}>
                {playlist.isLikedSongs ? (
                  <div className={styles.likedSongsIcon}>
                    <svg viewBox="0 0 24 24" className={styles.heartIcon}>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={playlist.image || defaultImage}
                    alt={playlist.name}
                    className={styles.albumArt}
                    onError={handleImageError}
                  />
                )}
              </div>
              <div className={styles.albumArtShadow}></div>
            </div>

            <div className={styles.playlistInfo}>
              <span className={styles.playlistType}>
                {playlist.isLikedSongs ? 'Playlist' : (playlist.collaborative ? 'Playlist Colaborativa' : 'Playlist')}
              </span>
              <h1 className={styles.playlistTitle}>{playlist.name}</h1>
              {playlist.description && (
                <p className={styles.playlistDescription}>{playlist.description}</p>
              )}

              <div className={styles.playlistMeta}>
                <img
                  src="/user-avatar.svg"
                  alt={playlist.owner.displayName}
                  className={styles.ownerAvatar}
                  onError={handleImageError}
                />
                <span className={styles.ownerName}>{playlist.owner.displayName}</span>
                {playlist.followers && playlist.followers > 0 && (
                  <>
                    <span className={styles.metaDivider}>•</span>
                    <span className={styles.trackCount}>
                      {playlist.followers.toLocaleString()} seguidores
                    </span>
                  </>
                )}
                <span className={styles.metaDivider}>•</span>
                <span className={styles.trackCount}>
                  {playlist.totalTracks} {playlist.totalTracks === 1 ? 'música' : 'músicas'}
                </span>
                {playlist.totalDuration && (
                  <>
                    <span className={styles.metaDivider}>•</span>
                    <span className={styles.duration}>{playlist.totalDuration}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.controlsSection}>
          <button
            className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            disabled={!playlist.tracks || playlist.tracks.length === 0}
          >
            {isPlaying ? (
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

          {!playlist.isLikedSongs && (
            <>
              <button className={styles.secondaryButton} aria-label="Seguir playlist">
                <svg viewBox="0 0 24 24" className={styles.buttonIcon}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
                </svg>
              </button>

              <button className={styles.secondaryButton} aria-label="Mais opções">
                <svg viewBox="0 0 24 24" className={styles.buttonIcon}>
                  <circle cx="12" cy="5" r="2" fill="currentColor" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="19" r="2" fill="currentColor" />
                </svg>
              </button>
            </>
          )}
        </section>

        <section className={styles.tracksSection}>
          <div className={styles.tracksHeader}>
            <span className={styles.trackNumber}>#</span>
            <span className={styles.trackTitle}>Título</span>
            <span className={styles.trackAlbum}>Álbum</span>
            <span className={styles.trackDuration}>
              <svg viewBox="0 0 16 16" className={styles.clockIcon}>
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.4c-3.5 0-6.4-2.9-6.4-6.4S4.5 1.6 8 1.6s6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4z" fill="currentColor" />
                <path d="M8.8 4.8H7.2v4l3.5 2.1.8-1.3-2.7-1.6V4.8z" fill="currentColor" />
              </svg>
            </span>
          </div>

          <div className={styles.tracksList}>
            {playlist.tracks && playlist.tracks.length > 0 ? (
              <>
                {playlist.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`${styles.trackRow} ${currentTrack === track.id ? styles.currentTrack : ''}`}
                    onClick={() => !track.isLocal && handleTrackPlay(track.id)}
                    style={{ cursor: track.isLocal ? 'default' : 'pointer' }}
                  >
                    <div className={styles.trackNumberCell}>
                      {currentTrack === track.id && isPlaying ? (
                        <div className={styles.playingIndicator}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : (
                        <span className={styles.trackIndex}>{index + 1}</span>
                      )}
                    </div>

                    <div className={styles.trackInfo}>
                      <div className={styles.trackDetails}>
                        <span className={`${styles.trackName} ${track.isLocal ? styles.localTrack : ''}`}>
                          {track.name}
                          {track.explicit && (
                            <span className={styles.explicitBadge}>E</span>
                          )}
                        </span>
                        <span className={styles.trackArtist}>{track.artist}</span>
                      </div>
                    </div>

                    <div className={styles.trackAlbumCell}>
                      <span className={styles.albumName}>{track.album}</span>
                    </div>

                    <div className={styles.trackActions}>
                      {!track.isLocal && (
                        <button
                          className={`${styles.likeButton} ${favoriteStates[track.id] ? styles.liked : ''}`}
                          aria-label="Adicionar aos favoritos"
                          onClick={(e) => handleToggleFavorite(track, e)}
                        >
                          <svg viewBox="0 0 16 16" className={styles.heartIcon}>
                            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                              fill={favoriteStates[track.id] ? '#1db954' : 'currentColor'} />
                          </svg>
                        </button>
                      )}
                      <span className={styles.trackTime}>{track.duration}</span>
                    </div>
                  </div>
                ))}

                {playlist?.pagination?.hasNext && (
                  <div ref={loadMoreRef} className={styles.loadMoreContainer}>
                    {loadingMore && (
                      <div className={styles.loadingMore}>
                        <div className={styles.loadingSpinner}></div>
                        <span>Carregando mais músicas...</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyTracksMessage}>
                <p>
                  {playlist.isLikedSongs 
                    ? 'Você ainda não curtiu nenhuma música. Explore e adicione suas favoritas!' 
                    : 'Esta playlist não possui músicas.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default TrackDetailView
