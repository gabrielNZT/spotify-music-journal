import { createContext, useContext, useState } from 'react'

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  showPremiumModal: false,
  setShowPremiumModal: () => {},
})

export function useUser() {
  return useContext(UserContext)
}
