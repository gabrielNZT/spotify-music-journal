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
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  const [user, setUser] = useState({})
  const isAuthenticated = authService.isAuthenticated()

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        {isAuthenticated ? (
          <MusicPlayerProvider>
            <Routes>
              <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
              <Route path="/auth/success" element={<AuthCallbackPage />} />
              <Route path="/auth/error" element={<AuthErrorPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
              <Route path="/dashboard/:id" element={<ProtectedRoute><MainLayout><PlaylistDetail /></MainLayout></ProtectedRoute>} />
              <Route path="/liked-songs" element={<ProtectedRoute><MainLayout><LikedSongsPage /></MainLayout></ProtectedRoute>} />
              <Route path="/" element={authService.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <MusicControlBar />
          </MusicPlayerProvider>
        ) : (
          <Routes>
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/auth/success" element={<AuthCallbackPage />} />
            <Route path="/auth/error" element={<AuthErrorPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </Router>
    </UserContext.Provider>
  )
}

export default App
