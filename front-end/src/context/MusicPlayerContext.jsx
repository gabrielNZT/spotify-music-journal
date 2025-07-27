import React, { createContext, useState, useEffect, useRef, useCallback } from 'react'
import { getCurrentlyPlaying } from '../services/player'

const MusicPlayerContext = createContext()

export function MusicPlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isPremiumRequired, setIsPremiumRequired] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const intervalRef = useRef(null)

  // Fetch current track info
  const fetchCurrentTrack = useCallback(async () => {
    try {
      const response = await getCurrentlyPlaying()
      
      if (response.error === 'premium_required') {
        setIsPremiumRequired(true)
        if (!showPremiumModal) {
          setShowPremiumModal(true)
        }
        setIsVisible(false)
        return
      }
      
      if (response.currentTrack) {
        setCurrentTrack(response.currentTrack)
        setIsPlaying(response.isPlaying)
        setProgress(response.progressMs || 0)
        setDuration(response.currentTrack.durationMs || 0)
        setIsVisible(true)
        setIsPremiumRequired(false)
      } else {
        setIsVisible(false)
        setCurrentTrack(null)
        setIsPlaying(false)
      }
    } catch {
      // Silent error handling - player not active or no permission
      setIsVisible(false)
      setCurrentTrack(null)
      setIsPlaying(false)
    }
  }, [showPremiumModal])

  // Update progress bar
  useEffect(() => {
    if (isPlaying && currentTrack && !isPremiumRequired) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1000
          return newProgress > duration ? duration : newProgress
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentTrack, duration, isPremiumRequired])

  // Fetch track info periodically
  useEffect(() => {
    if (!isPremiumRequired) {
      fetchCurrentTrack()
      const trackInterval = setInterval(fetchCurrentTrack, 5000)
      
      return () => clearInterval(trackInterval)
    }
  }, [isPremiumRequired, fetchCurrentTrack])

  const closePremiumModal = () => {
    setShowPremiumModal(false)
  }

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    isVisible,
    isPremiumRequired,
    showPremiumModal,
    setIsPlaying,
    setCurrentTrack,
    setProgress,
    fetchCurrentTrack,
    closePremiumModal
  }

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

export default MusicPlayerContext
