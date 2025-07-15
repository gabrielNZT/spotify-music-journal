import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/api'
import styles from './AuthCallbackPage.module.css'

function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        console.error('Erro na autenticação:', error)
        navigate('/auth/error?error=' + error)
        return
      }

      if (token) {
        // Salvar token e redirecionar para dashboard
        authService.saveToken(token)
        navigate('/dashboard')
      } else {
        navigate('/auth/error?error=no_token')
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className={styles.callbackContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner}></div>
        <h2 className={styles.loadingTitle}>Finalizando autenticação...</h2>
        <p className={styles.loadingText}>
          Aguarde enquanto processamos seu login
        </p>
      </div>
    </div>
  )
}

export default AuthCallbackPage
