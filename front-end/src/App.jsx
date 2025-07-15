import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/api'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import AuthErrorPage from './pages/AuthErrorPage'
import MainLayout from './components/layout/MainLayout'

// Componente para rotas protegidas
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Componente para rotas de autenticação (só acessível se não estiver logado)
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
        {/* Rotas de autenticação */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } 
        />
        
        {/* Rotas de callback */}
        <Route path="/auth/success" element={<AuthCallbackPage />} />
        <Route path="/auth/error" element={<AuthErrorPage />} />
        
        {/* Rotas protegidas com layout */}
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
          path="/home" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rota raiz - redireciona baseado na autenticação */}
        <Route 
          path="/" 
          element={
            authService.isAuthenticated() ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* Rota 404 */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
