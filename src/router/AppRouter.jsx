import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPage      from '../pages/LoginPage'
import DashboardPage  from '../pages/DashboardPage'
import FormularioPage from '../pages/FormularioPage'
import ReportesPage   from '../pages/ReportesPage'

/**
 * RutaProtegida: si el usuario no está autenticado,
 * lo redirige al login automáticamente.
 */
function RutaProtegida({ children }) {
  const { estaAutenticado, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return estaAutenticado ? children : <Navigate to="/login" replace />
}


function RutaPublica({ children }) {
  const { estaAutenticado } = useAuth()
  return estaAutenticado ? <Navigate to="/dashboard" replace /> : children
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={
          <RutaPublica>
            <LoginPage />
          </RutaPublica>
        } />

        <Route path="/dashboard" element={
          <RutaProtegida>
            <DashboardPage />
          </RutaProtegida>
        } />

        <Route path="/formulario" element={
          <RutaProtegida>
            <FormularioPage />
          </RutaProtegida>
        } />

        <Route path="/reportes" element={
          <RutaProtegida>
            <ReportesPage />
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}