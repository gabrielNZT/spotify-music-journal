import { useState, useEffect } from 'react'
import { authService, musicService, categoryService } from '../services/api'
import styles from './DashboardPage.module.css'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    favoritesCount: 0,
    categoriesCount: 0,
    notesCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError('')

        // Carregar dados do usuário
        const userData = await authService.getMe()
        setUser(userData.user)

        // Carregar estatísticas (placeholder - será implementado quando a API estiver pronta)
        try {
          const [favorites, categories] = await Promise.allSettled([
            musicService.getFavorites(),
            categoryService.getCategories()
          ])

          setStats({
            favoritesCount: favorites.status === 'fulfilled' ? favorites.value.length || 0 : 0,
            categoriesCount: categories.status === 'fulfilled' ? categories.value.length || 0 : 0,
            notesCount: 0 // Placeholder
          })
        } catch (statsError) {
          // Não exibir erro para estatísticas, apenas usar valores padrão
          console.log('Erro ao carregar estatísticas (esperado):', statsError)
        }

      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
        setError('Erro ao carregar seus dados. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Carregando seu dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Ops! Algo deu errado</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header do Dashboard */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Olá, {user?.displayName || 'Usuário'}!
          </h1>
          <p className={styles.welcomeSubtitle}>
            Bem-vindo ao seu Music Journal
          </p>
        </div>
        
        <div className={styles.userProfile}>
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="Foto do perfil"
              className={styles.profileImage}
            />
          ) : (
            <div className={styles.profilePlaceholder}>
              <svg className={styles.profileIcon} viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.favoritesCount}</h3>
            <p className={styles.statLabel}>Músicas Favoritas</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.categoriesCount}</h3>
            <p className={styles.statLabel}>Categorias Criadas</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.notesCount}</h3>
            <p className={styles.statLabel}>Anotações</p>
          </div>
        </div>
      </div>

      {/* Seções Principais */}
      <div className={styles.mainContent}>
        {/* Músicas Recentes */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tocadas Recentemente</h2>
            <button className={styles.seeAllButton}>Ver todas</button>
          </div>
          
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>Nenhuma música encontrada</h3>
            <p className={styles.emptyDescription}>
              Comece a ouvir música no Spotify para ver suas faixas aqui
            </p>
          </div>
        </div>

        {/* Categorias */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Suas Categorias</h2>
            <button className={styles.createButton}>
              <svg className={styles.createIcon} viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Criar Categoria
            </button>
          </div>
          
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>Nenhuma categoria criada</h3>
            <p className={styles.emptyDescription}>
              Crie categorias personalizadas para organizar suas músicas
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </div>
            <span className={styles.actionLabel}>Adicionar Música</span>
          </button>

          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className={styles.actionLabel}>Nova Categoria</span>
          </button>

          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
            <span className={styles.actionLabel}>Escrever Anotação</span>
          </button>

          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <span className={styles.actionLabel}>Buscar Músicas</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
