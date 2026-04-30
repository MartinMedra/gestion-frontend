import { createContext, useContext, useState, useEffect } from 'react'
import { iniciarSesion, cerrarSesion } from '../api/authApi'

const ContextoAutenticacion = createContext(null)

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken]     = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const tokenGuardado  = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado)
      setUsuario(JSON.parse(usuarioGuardado))
    }

    setCargando(false)
  }, [])

  const login = async (credenciales) => {
    const respuesta = await iniciarSesion(credenciales)
    const { access_token, user } = respuesta.data

    // Guardamos en estado y en localStorage para persistir la sesión
    setToken(access_token)
    setUsuario(user)
    localStorage.setItem('token', access_token)
    localStorage.setItem('usuario', JSON.stringify(user))

    return respuesta
  }

  const logout = async () => {
    try {
      await cerrarSesion(token)
    } finally {
      // Limpiamos siempre, aunque el servidor falle
      setToken(null)
      setUsuario(null)
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
  }

  const valor = {
    usuario,
    token,
    cargando,
    estaAutenticado: !!token,
    login,
    logout,
  }

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(ContextoAutenticacion)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de ProveedorAutenticacion')
  }
  return contexto
}