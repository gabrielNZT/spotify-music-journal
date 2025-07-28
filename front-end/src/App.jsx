import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { MainLayout, MusicControlBar, PremiumRequired } from './components'
import { MusicPlayerProvider } from './context/MusicPlayerContext'
import { UserContext } from './context/UserContext'
import { AuthCallbackPage, AuthErrorPage, DashboardPage, LoginPage, PlaylistDetail, LikedSongsPage, DiscoverPage } from './pages'

function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext)
  const isAuthenticated = !!user
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AuthRoute({ children }) {
  const { user } = useContext(UserContext)
  const isAuthenticated = !!user
  
  if (isAuthenticated) {
    return <Navigate to="/playlists" replace />
  }
  
  return children
}

function App() {
  const { showPremiumModal, closePremiumModal } = useContext(UserContext)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/auth/success" element={<AuthCallbackPage />} />
        <Route path="/auth/error" element={<AuthErrorPage />} />
        
        <Route path="/playlists" element={
          <ProtectedRoute>
            <MusicPlayerProvider>
              <MainLayout><DashboardPage /></MainLayout>
              <MusicControlBar />
            </MusicPlayerProvider>
          </ProtectedRoute>
        } />
        <Route path="/playlists/:id" element={
          <ProtectedRoute>
            <MusicPlayerProvider>
              <MainLayout><PlaylistDetail /></MainLayout>
              <MusicControlBar />
            </MusicPlayerProvider>
          </ProtectedRoute>
        } />
        <Route path="/liked-songs" element={
          <ProtectedRoute>
            <MusicPlayerProvider>
              <MainLayout><LikedSongsPage /></MainLayout>
              <MusicControlBar />
            </MusicPlayerProvider>
          </ProtectedRoute>
        } />
        <Route path="/discover" element={
          <ProtectedRoute>
            <MusicPlayerProvider>
              <MainLayout><DiscoverPage /></MainLayout>
              <MusicControlBar />
            </MusicPlayerProvider>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/playlists" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showPremiumModal && <PremiumRequired onClose={closePremiumModal} />}
    </Router>
  )
}

export default App
