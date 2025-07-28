import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

export function usePremium() {
  const { user } = useContext(UserContext)
  
  const isPremium = user?.product === 'premium'
  const isFree = user?.product === 'free'
  
  return {
    isPremium,
    isFree,
    product: user?.product || 'unknown'
  }
}
