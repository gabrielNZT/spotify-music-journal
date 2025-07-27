import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContext } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext.Provider value={{ user: null, setUser: () => {} }}>
      <App />
    </UserContext.Provider>
  </StrictMode>
)
