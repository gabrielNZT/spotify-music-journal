import { Outlet } from 'react-router-dom'
import { authService } from '../../services/api'
import styles from './MainLayout.module.css'

function MainLayout({ children }) {
  const handleLogout = () => {
    authService.logout()
  }

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logoSection}>
          <h1 className={styles.logoTitle}>
            Music Journal
          </h1>
        </div>
        
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li>
              <a 
                href="/dashboard" 
                className={styles.navLink}
              >
                <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="/home" 
                className={styles.navLink}
              >
                <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Biblioteca
              </a>
            </li>
            <li>
              <a 
                href="/favorites" 
                className={styles.navLink}
              >
                <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Músicas Curtidas
              </a>
            </li>
          </ul>
          
          <div className={styles.categoriesSection}>
            <div className={styles.categoriesHeader}>
              <p className={styles.categoriesTitle}>
                Categorias
              </p>
            </div>
            <ul className={styles.categoriesList}>
              <li>
                <a href="#" className={styles.categoryLink}>
                  Treino
                </a>
              </li>
              <li>
                <a href="#" className={styles.categoryLink}>
                  Relaxar
                </a>
              </li>
              <li>
                <a href="#" className={styles.categoryLink}>
                  Foco
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.navigationButtons}>
            <button className={styles.navButton}>
              <svg className={styles.navButtonIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className={styles.navButton}>
              <svg className={styles.navButtonIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className={styles.userSection}>
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
