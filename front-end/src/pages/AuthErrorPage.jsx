import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './AuthErrorPage.module.css'

function AuthErrorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const error = searchParams.get('error')
    
    const errorMessages = {
      'access_denied': 'Você cancelou a autorização. É necessário autorizar o acesso ao Spotify para usar o Music Journal.',
      'callback_failed': 'Erro no processo de autenticação. Tente novamente.',
      'missing_code': 'Código de autorização não recebido. Tente fazer login novamente.',
      'no_token': 'Token de acesso não foi gerado. Tente novamente.',
      'default': 'Erro desconhecido durante a autenticação. Tente novamente.'
    }

    setErrorMessage(errorMessages[error] || errorMessages.default)
  }, [searchParams])

  const handleRetry = () => {
    navigate('/login')
  }

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <h1 className={styles.errorTitle}>Erro na Autenticação</h1>
        
        <p className={styles.errorMessage}>
          {errorMessage}
        </p>
        
        <div className={styles.actions}>
          <button 
            className={styles.retryButton}
            onClick={handleRetry}
          >
            Tentar Novamente
          </button>
          
          <button 
            className={styles.homeButton}
            onClick={() => navigate('/')}
          >
            Voltar ao Início
          </button>
        </div>
        
        <div className={styles.helpText}>
          <p>Se o problema persistir, verifique se:</p>
          <ul>
            <li>Você tem uma conta ativa no Spotify</li>
            <li>Sua conexão com a internet está funcionando</li>
            <li>Não há bloqueadores de pop-up ativos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AuthErrorPage
