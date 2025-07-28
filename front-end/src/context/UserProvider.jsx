import { useState, useEffect } from 'react'
import { UserContext } from './UserContext'
import { authService, setupInterceptors } from '../services/api'

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const closePremiumModal = () => setShowPremiumModal(false)

  useEffect(() => {
    setupInterceptors(setShowPremiumModal)

    const token = authService.getToken()
    if (token) {
      authService.getMe().then(data => {
        setUser(data.user)
      }).catch(err => {
        console.error(err)
        authService.logout()
      })
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, showPremiumModal, setShowPremiumModal, closePremiumModal }}>
      {children}
    </UserContext.Provider>
  )
}
