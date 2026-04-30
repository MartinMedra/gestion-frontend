import { instanciaAuth } from './axios'

export const iniciarSesion = (credenciales) =>
  instanciaAuth.post('/login', credenciales)

export const obtenerUsuarioActual = (token) =>
  instanciaAuth.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  })

export const cerrarSesion = (token) =>
  instanciaAuth.post('/logout', {}, {
    headers: { Authorization: `Bearer ${token}` },
  })