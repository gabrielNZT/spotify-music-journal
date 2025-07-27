import { useState, useEffect } from 'react'
import { FaRobot, FaMusic, FaStar } from 'react-icons/fa'
import { RiSparklingFill } from 'react-icons/ri'
import styles from './DiscoverPage.module.css'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'
import { discoverApi } from '../../services/api'
import { playTrack, pausePlayback } from '../../services/player'
import SpotifyPlayButton from '../../components/SpotifyPlayButton'
import { SpotifyToast } from '../../components'

const DiscoverPage = () => {
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [currentRecommendationId, setCurrentRecommendationId] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [toast, setToast] = useState(null)
  const [ratedRecommendations, setRatedRecommendations] = useState({})
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const { 
    currentTrack, 
    isPlaying 
  } = useMusicPlayer()

  const examplePrompts = [
    "Estou me sentindo nostálgico e quero ouvir algo que me lembre da juventude",
    "Preciso de uma música energética para malhar na academia",
    "Hoje está um dia cinzento e quero algo melancólico e profundo",
    "Quero descobrir artistas brasileiros que misturam eletrônico com MPB",
    "Estou estudando e preciso de algo instrumental e concentrante"
  ]

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsHistoryLoading(true)
    try {
      const data = await discoverApi.getRecommendationHistory(10)
      setHistory(data)
    } catch {
      // Silent error handling
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const generateRecommendation = async () => {
    if (!userInput.trim()) return

    setIsLoading(true)
    setLoadingStep('Analisando sua descrição...')
    
    try {
      // Simular etapas do loading
      setTimeout(() => setLoadingStep('Consultando IA para recomendações...'), 1000)
      setTimeout(() => setLoadingStep('Buscando músicas no Spotify...'), 2000)
      setTimeout(() => setLoadingStep('Finalizando recomendações...'), 3000)
      
      const data = await discoverApi.generateRecommendation(userInput.trim())
      setRecommendations(data.recommendations)
      setCurrentRecommendationId(data.id)
      setUserInput('')
      // Reset rating state for new recommendation
      setRatedRecommendations(prev => ({ ...prev, [data.id]: false }))
      setToast({ message: 'Recomendações geradas com sucesso!', type: 'success' })
      await loadHistory()
    } catch (error) {
      setToast({ message: error?.error || 'Erro ao gerar recomendações', type: 'error' })
    } finally {
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  const loadHistoryRecommendation = async (recommendationId) => {
    setIsHistoryLoading(true)
    try {
      const data = await discoverApi.getRecommendationById(recommendationId)
      setRecommendations(data.recommendations)
      setCurrentRecommendationId(recommendationId)
      setShowHistory(false)
    } catch {
      setToast({ message: 'Erro ao carregar recomendação do histórico', type: 'error' })
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const rateRecommendation = async (rating) => {
    if (!currentRecommendationId) return

    try {
      await discoverApi.rateRecommendation(currentRecommendationId, rating)
      setToast({ message: 'Avaliação registrada! Isso nos ajuda a melhorar as recomendações.', type: 'success' })
      setRatedRecommendations(prev => ({ ...prev, [currentRecommendationId]: true }))
      await loadHistory()
    } catch {
      setToast({ message: 'Erro ao avaliar recomendação', type: 'error' })
    }
  }

  const handleTrackPlay = async (track) => {
    try {
      if (currentTrack?.id === track.spotifyTrackId && isPlaying) {
        await pausePlayback()
      } else {
        await playTrack({
          uris: [`spotify:track:${track.spotifyTrackId}`]
        })
      }
    } catch (err) {
      if (err?.response?.data?.error?.includes('No active device found')) {
        setToast({ message: 'Nenhum dispositivo Spotify está ativo. Abra o Spotify em algum dispositivo e tente novamente.', type: 'error' })
      } else {
        setToast({ message: 'Erro ao tentar reproduzir a música', type: 'error' })
      }
    }
  }

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.container}>
      {toast && <SpotifyToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <RiSparklingFill />
        </div>
        <h1>Descobrir Música</h1>
        <p>Descreva seu humor ou o tipo de música que você quer ouvir, e deixe a IA encontrar a trilha sonora perfeita para você!</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputContainer}>
          <FaRobot className={styles.inputIcon} />
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ex: Estou me sentindo nostálgico e quero algo que me lembre dos anos 80..."
            maxLength={500}
            rows={3}
            className={styles.textInput}
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.inputActions}>
          <span className={styles.charCounter}>{userInput.length}/500</span>
          <button 
            onClick={generateRecommendation}
            disabled={!userInput.trim() || isLoading}
            className={`${styles.generateButton} ${isLoading ? styles.loading : ''}`}
          >
            {isLoading ? (
              <div className={styles.buttonLoading}>
                <div className={styles.spinner}></div>
                <span>Descobrindo...</span>
              </div>
            ) : 'Descobrir Músicas'}
          </button>
        </div>
      </div>

      {/* Loading State com etapas */}
      {isLoading && (
        <div className={styles.loadingSection}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingSpinner}></div>
            <h3>Descobrindo suas músicas perfeitas...</h3>
            <p className={styles.loadingStep}>{loadingStep}</p>
            <div className={styles.loadingBar}>
              <div className={styles.loadingProgress}></div>
            </div>
            <p className={styles.loadingHint}>
              💡 Estamos analisando seu humor e buscando as melhores combinações musicais
            </p>
          </div>
        </div>
      )}

      <div className={styles.examples}>
        <h3>💡 Inspirações para começar:</h3>
        <p className={styles.examplesSubtitle}>Clique em uma das sugestões ou escreva sua própria descrição</p>
        <div className={styles.exampleTags}>
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setUserInput(prompt)}
              className={styles.exampleTag}
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {recommendations.length > 0 && !isLoading && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2><FaMusic /> Suas Descobertas</h2>
            {currentRecommendationId && !ratedRecommendations[currentRecommendationId] && (
              <div className={styles.ratingSection}>
                <span>Gostou das recomendações?</span>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => rateRecommendation(star)}
                      className={styles.starButton}
                      title={`${star} estrela${star > 1 ? 's' : ''}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.trackList}>
            {Array.from(new Map(recommendations.map(track => [track.spotifyTrackId, track])).values()).map((track) => (
              <div 
                key={track.spotifyTrackId} 
                className={styles.trackCard}
                style={{ cursor: 'pointer' }}
                onClick={() => handleTrackPlay(track)}
              >
                <div className={styles.trackImage}>
                  <img src={track.albumImageUrl} alt={track.albumName} />
                </div>
                
                <div className={styles.trackInfo}>
                  <h3>{track.trackName}</h3>
                  <p className={styles.artist}>{track.artistName}</p>
                  <p className={styles.album}>{track.albumName}</p>
                  {track.explanation && (
                    <p className={styles.explanation}>
                      <FaRobot className={styles.aiIcon} />
                      {track.explanation}
                    </p>
                  )}
                </div>
                
                <div className={styles.trackMeta}>
                  <span className={styles.duration}>{formatDuration(track.durationMs)}</span>
                  <SpotifyPlayButton handleTrackPlay={handleTrackPlay} track={track} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.historySection}>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={styles.historyToggle}
          disabled={isHistoryLoading}
        >
          {isHistoryLoading ? (
            <div className={styles.historyButtonLoading}>
              <div className={styles.miniSpinner}></div>
              <span>Carregando...</span>
            </div>
          ) : (
            <>
              {showHistory ? 'Ocultar' : 'Ver'} Histórico de Descobertas
              <span className={styles.historyCount}>({history.length})</span>
            </>
          )}
        </button>

        {showHistory && history.length > 0 && (
          <div className={styles.historyList}>
            {history.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyContent}>
                  <p className={styles.historyQuery}>"{item.userInput}"</p>
                  <div className={styles.historyMeta}>
                    <span className={styles.historyStats}>
                      <FaMusic className={styles.musicIcon} />
                      {item.recommendationsCount} músicas
                    </span>
                    <span className={styles.historyDate}>
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {item.satisfactionRating && (
                    <div className={styles.historyRating}>
                      <span>Avaliação: </span>
                      {Array.from({ length: item.satisfactionRating }).map((_, i) => (
                        <FaStar key={i} className={styles.ratedStar} />
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => loadHistoryRecommendation(item.id)}
                  className={styles.loadButton}
                  disabled={isHistoryLoading}
                >
                  {isHistoryLoading ? '...' : 'Ver Músicas'}
                </button>
              </div>
            ))}
          </div>
        )}

        {showHistory && history.length === 0 && !isHistoryLoading && (
          <div className={styles.emptyHistory}>
            <FaMusic className={styles.emptyIcon} />
            <p>Nenhuma descoberta ainda</p>
            <span>Suas recomendações anteriores aparecerão aqui</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscoverPage
