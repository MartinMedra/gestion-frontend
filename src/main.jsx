import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProveedorAutenticacion } from './context/AuthContext'
import AppRouter from './router/AppRouter'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProveedorAutenticacion>
      <AppRouter />
    </ProveedorAutenticacion>
  </StrictMode>
)