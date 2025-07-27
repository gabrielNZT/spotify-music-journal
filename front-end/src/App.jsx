import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from './services/api'
import MainLayout from './components/layout/MainLayout'
import { MusicControlBar } from './components'
import { MusicPlayerProvider } from './context/MusicPlayerContext'
import { AuthCallbackPage, AuthErrorPage, DashboardPage, LoginPage, PlaylistDetail, LikedSongsPage } from './pages'
import { UserContext } from './context/UserContext'

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AuthRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()
  
  if (isAuthenticated) {
    return <Navigate to="/playlists" replace />
  }
  
  return children
}

function App() {
  const [user, setUser] = useState({})

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
          
          <Route path="/" element={authService.isAuthenticated() ? <Navigate to="/playlists" replace /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App
