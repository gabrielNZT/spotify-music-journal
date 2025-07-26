import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authService } from '../../services/api'
import styles from './MainLayout.module.css'

function MainLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const [activeMenu, setActiveMenu] = useState('/dashboard')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getMe()
        setUser(response.user)
      } catch (error) {
        console.error('Failed to fetch user data', error)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    setActiveMenu(location.pathname)
  }, [location.pathname])

  const handleLogout = () => {
    authService.logout()
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className={styles.layoutContainer}>
      
      <header className={styles.mobileHeader}>
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <svg className={styles.hamburgerIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h1 className={styles.mobileHeaderTitle}>Music Journal</h1>
        
        <div style={{ width: '32px' }} /> 
      </header>

      
      {isSidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      
      <header className={styles.topNavbar}>
        <div className={styles.navbarContent}>
          <div className={styles.logoSection}>
            <h1 className={styles.logoTitle}>Music Journal</h1>
          </div>
          
          <nav className={styles.desktopNavigation}>
            <ul className={styles.desktopNavList}>
              <li>
                <button
                  type="button"
                  className={`${styles.desktopNavLink} ${activeMenu === '/dashboard' ? styles.activeNav : ''}`}
                  onClick={() => { setActiveMenu('/dashboard'); navigate('/dashboard'); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${styles.desktopNavLink} ${activeMenu === '/favorites' ? styles.activeNav : ''}`}
                  onClick={() => { setActiveMenu('/favorites'); navigate('/favorites'); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Músicas Curtidas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${styles.desktopNavLink} ${activeMenu === '/categories' ? styles.activeNav : ''}`}
                  onClick={() => { setActiveMenu('/categories'); navigate('/categories'); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Categorias
                </button>
              </li>
            </ul>
          </nav>
          
          <div className={styles.userSection}>
            {user ? (
              <div className={styles.userProfile}>
                <img src={user.profileImageUrl} alt={user.displayName} className={styles.userAvatar} />
                <span className={styles.userName}>{user.displayName}</span>
              </div>
            ) : (
              <div className={styles.userProfile}>
                <div className={`${styles.userAvatar} ${styles.skeleton}`} />
                <div className={`${styles.userName} ${styles.skeleton}`} style={{ width: '100px', height: '20px' }} />
              </div>
            )}
            <button className={styles.logoutButton} onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileSidebar} ${isSidebarOpen ? styles.mobileSidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoSection}>
            <h1 className={styles.logoTitle}>Music Journal</h1>
          </div>
          <button 
            className={styles.closeButton}
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <svg className={styles.closeIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <nav className={styles.mobileNavigation}>
          <ul className={styles.mobileNavList}>
            <li>
              <button
                type="button"
                className={`${styles.mobileNavLink} ${activeMenu === '/dashboard' ? styles.activeNav : ''}`}
                onClick={() => { setActiveMenu('/dashboard'); navigate('/dashboard'); closeSidebar(); }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`${styles.mobileNavLink} ${activeMenu === '/favorites' ? styles.activeNav : ''}`}
                onClick={() => { setActiveMenu('/favorites'); navigate('/favorites'); closeSidebar(); }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Músicas Curtidas
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`${styles.mobileNavLink} ${activeMenu === '/categories' ? styles.activeNav : ''}`}
                onClick={() => { setActiveMenu('/categories'); navigate('/categories'); closeSidebar(); }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Categorias
              </button>
            </li>
          </ul>
          
          <div className={styles.mobileUserSection}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Sair
            </button>
          </div>
        </nav>
      </div>

      
      <main className={styles.mainContent}>
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default MainLayout
