import { useContext } from 'react'
import MusicPlayerContext from '../context/MusicPlayerContext'

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
}
