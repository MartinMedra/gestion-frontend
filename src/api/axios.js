import axios from 'axios'

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://auth-service.test/api'
const PIEZAS_API_BASE_URL = import.meta.env.VITE_PIEZAS_API_BASE_URL || 'http://pieces-service.test/api/v1'

export const instanciaAuth = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export const instanciaPiezas = axios.create({
  baseURL: PIEZAS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})


instanciaPiezas.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (!config.headers) config.headers = {}
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})


instanciaPiezas.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)