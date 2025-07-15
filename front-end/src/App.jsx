import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/api'
import MainLayout from './components/layout/MainLayout'
import { AuthCallbackPage, AuthErrorPage, DashboardPage, LoginPage, PlaylistDetail } from './pages'

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
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } 
        />
        
        <Route path="/auth/success" element={<AuthCallbackPage />} />
        <Route path="/auth/error" element={<AuthErrorPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/playlist/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlaylistDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />
          
        <Route 
          path="/" 
          element={
            authService.isAuthenticated() ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
