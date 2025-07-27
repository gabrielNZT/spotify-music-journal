import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlaylistDetails, getPlaylistTracks, addFavorite, removeFavorite, getPlaylistFavorites } from '../../services/api'
import { playTrack } from '../../services/player'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'
import { formatCompletePlaylistData, formatTrackData } from '../../utils/spotifyDataFormatter'
import styles from './PlaylistDetail.module.css'
import PlaylistDetailSkeleton from './PlaylistDetailSkeleton'
import { useCallback } from 'react'
import { SpotifyToast } from '../../components'

function PlaylistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentTrack, isPlaying, setIsPlaying } = useMusicPlayer()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [loadingMoreTracks, setLoadingMoreTracks] = useState(false)
  const [pagination, setPagination] = useState(null)
  const loadMoreRef = useRef(null)
  const isFetchingRef = useRef(false)
   const [favoriteStates, setFavoriteStates] = useState({})

  const defaultImage = '/placeholder-playlist.svg'

  const handleImageError = (e) => {
    e.target.src = defaultImage
  }

  const handleToggleFavorite = async (track, e) => {
    e.stopPropagation()
    const isCurrentlyFavorite = favoriteStates[track.id] ?? false
    try {
      if (isCurrentlyFavorite) {
        await removeFavorite(track.id)
        setFavoriteStates(prev => ({ ...prev, [track.id]: false }))
        setToast({ message: 'Removido dos favoritos', type: 'success' })
      } else {
        await addFavorite({
          spotifyTrackId: track.id,
          trackName: track.name,
          artistName: track.artist,
          albumImageUrl: track.image,
          albumName: track.album,
          duration: track.duration,
          durationMs: track.durationMs,
          playlistId: id
        })
        setFavoriteStates(prev => ({ ...prev, [track.id]: true }))
        setToast({ message: 'Adicionado aos favoritos', type: 'success' })
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        setToast({ message: 'Esta música já está nos favoritos', type: 'warning' })
      } else {
        setToast({ message: 'Erro ao atualizar favoritos', type: 'error' })
      }
    }
  }

  const handlePlayPause = async () => {
    if (!playlist) return
    try {
      await playTrack({
        contextUri: `spotify:playlist:${playlist.id}`
      })
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
        setError('Erro ao tentar reproduzir a playlist')
      }
    }
  }

  const handleTrackPlay = async (trackId) => {
    try {
      const track = playlist.tracks.find(t => t.id === trackId)
      if (!track) return
      await playTrack({
        contextUri: `spotify:playlist:${playlist.id}`,
        offset: { position: playlist.tracks.findIndex(t => t.id === trackId) }
      })
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
        setError('Erro ao tentar reproduzir a faixa')
      }
    }
  }

  const fetchInitialData = useCallback(async () => {
    if (!id) {
      setError('ID da playlist não fornecido');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [playlistDetailsResponse, playlistTracksResponse, playlistFavoritesResponse] = await Promise.all([
        getPlaylistDetails(id),
        getPlaylistTracks(id, { limit: 50, offset: 0 }),
        getPlaylistFavorites(id)
      ]);

      if (!playlistDetailsResponse?.playlist) {
        throw new Error('Dados da playlist inválidos');
      }

      const formattedPlaylist = formatCompletePlaylistData(playlistDetailsResponse.playlist, playlistTracksResponse);

      let favoriteStatesObj = {};
      if (playlistFavoritesResponse?.favorites && formattedPlaylist.tracks && formattedPlaylist.tracks.length > 0) {
        const favoriteIds = new Set(playlistFavoritesResponse.favorites.map(fav => fav.spotifyTrackId));
        formattedPlaylist.tracks.forEach(track => {
          favoriteStatesObj[track.id] = favoriteIds.has(track.id);
        });
      }
      setFavoriteStates(favoriteStatesObj);
      setPlaylist(formattedPlaylist);
      setPagination(formattedPlaylist.pagination);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Playlist não encontrada');
      } else if (err.response?.status === 403) {
        setError('Acesso negado a esta playlist');
      } else if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Erro ao carregar a playlist. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const loadMoreTracks = useCallback(() => {
    if (!pagination?.hasNext || loadingMoreTracks || isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoadingMoreTracks(true);

    const offset = pagination.offset + pagination.limit;

    getPlaylistTracks(id, { limit: 50, offset })
      .then(tracksData => {
        const newTracks = (tracksData?.tracks || []).map(formatTrackData).filter(Boolean);

        setPlaylist(prevPlaylist => ({
          ...prevPlaylist,
          tracks: [...(prevPlaylist?.tracks || []), ...newTracks],
        }));
        setPagination(tracksData?.pagination || null);
      })
      .catch(() => {
        setToast({ message: 'Erro ao carregar mais músicas.', type: 'error' });
      })
      .finally(() => {
        setLoadingMoreTracks(false);
        isFetchingRef.current = false;
      });
  }, [id, pagination, loadingMoreTracks]);

  const handleRetry = () => {
    fetchInitialData();
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!pagination?.hasNext || loading) return;

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
  }, [pagination, loading, loadMoreTracks]);


  const handleToastClose = () => setToast(null)

  if (loading) return <PlaylistDetailSkeleton />


  if (error) {
    if (toast && toast.type === 'error' && typeof toast.message === 'object') {
      return <>{toast && <SpotifyToast message={toast.message} type={toast.type} onClose={handleToastClose} />}</>
    }
    return (
      <>
        {toast && <SpotifyToast message={toast.message} type={toast.type} onClose={handleToastClose} />}
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>Ops! Algo deu errado</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={handleRetry}
            >
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
            <h2 className={styles.errorTitle}>Playlist não encontrada</h2>
            <p className={styles.errorMessage}>
              A playlist solicitada não existe ou não está disponível.
            </p>
            <button
              className={styles.retryButton}
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  if (loading) return <PlaylistDetailSkeleton />

  return (
    <>
      {toast && <SpotifyToast message={toast.message} type={toast.type} onClose={handleToastClose} />}
      <div className={styles.detailContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.albumArtWrapper}>
              <div className={styles.albumArtContainer}>
                <img
                  src={playlist.image || defaultImage}
                  alt={playlist.name}
                  className={styles.albumArt}
                  onError={handleImageError}
                />
              </div>
              <div className={styles.albumArtShadow}></div>
            </div>

            <div className={styles.playlistInfo}>
              <span className={styles.playlistType}>
                {playlist.collaborative ? 'Playlist Colaborativa' : 'Playlist'}
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
            aria-label={isPlaying ? 'Pausar playlist' : 'Reproduzir playlist'}
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
        </section>

        {/* Tracks Section com melhor estrutura */}
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
                    className={`${styles.trackRow} ${currentTrack?.id === track.id ? styles.currentTrack : ''}`}
                    onClick={() => !track.isLocal && handleTrackPlay(track.id)}
                    style={{ cursor: track.isLocal ? 'default' : 'pointer' }}
                  >
                    <div className={styles.trackNumberCell}>
                      {currentTrack?.id === track.id && isPlaying ? (
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
                          aria-label={favoriteStates[track.id] ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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

                {pagination?.hasNext && (
                  <div ref={loadMoreRef} className={styles.loadMoreContainer}>
                    {loadingMoreTracks && (
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
                <p>Esta playlist não possui músicas.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default PlaylistDetail
