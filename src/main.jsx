import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Router } from 'react-router-dom'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
