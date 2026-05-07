import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alerta, Boton, Input } from '../components/ui'
import CotecmarIcon from '../components/ui/cotecmarIcon'

export default function LoginPage() {
  const { login } = useAuth()
  const navegar   = useNavigate()

  const [formulario, setFormulario] = useState({ email: '', contrasena: '' })
  const [errores, setErrores]       = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando]     = useState(false)

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormulario(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!formulario.email) {
      nuevosErrores.email = 'El correo es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
      nuevosErrores.email = 'Ingresa un correo válido.'
    }
    if (!formulario.contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria.'
    } else if (formulario.contrasena.length < 6) {
      nuevosErrores.contrasena = 'Mínimo 6 caracteres.'
    }
    return nuevosErrores
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setErrorServidor('')

    const erroresValidacion = validar()
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    setEnviando(true)
    try {
      await login({ email: formulario.email, password: formulario.contrasena })
      navegar('/dashboard')
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al iniciar sesión.'
      setErrorServidor(mensaje)
    } finally {
      setEnviando(false)
    }
  }

  const IconoCorreo = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5.3-8-5.3V6l8 5.3L20 6v2.2Z"
      />
    </svg>
  )

  const IconoCandado = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Z"
      />
    </svg>
  )

  return (
    <div className="min-h-screen bg-cotecmar-surface animate__animated animate__fadeIn">
      <div className="min-h-screen grid lg:grid-cols-2">

        <div className="hidden lg:flex relative overflow-hidden bg-cotecmar-navy text-white">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 800 800" className="h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 640 C160 560, 260 720, 420 640 C580 560, 680 720, 800 640 V800 H0 Z" fill="url(#grad)" />
              <path d="M0 520 C160 440, 260 600, 420 520 C580 440, 680 600, 800 520" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" />
              <path d="M0 560 C160 480, 260 640, 420 560 C580 480, 680 640, 800 560" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" />
              <path d="M120 180h560v8H120zM120 220h420v8H120zM120 260h500v8H120z" fill="#FFFFFF" fillOpacity="0.12" />
              <path d="M190 330l70-70 120 120 220-220 70 70-290 290z" fill="#FFFFFF" fillOpacity="0.10" />
              <path d="M140 360h520v2H140z" stroke="#FFFFFF" strokeOpacity="0.22" />
              <path d="M140 430h520v2H140z" stroke="#FFFFFF" strokeOpacity="0.18" />
              <path d="M140 500h520v2H140z" stroke="#FFFFFF" strokeOpacity="0.14" />
            </svg>
          </div>

          <div className="relative z-10 p-12 flex flex-col justify-between w-full">
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
                  <CotecmarIcon />
                </div>
                <div>
                  <p className="text-sm text-white/70">COTECMAR</p>
                  <p className="text-lg font-semibold tracking-tight">Gestión de fabricación de piezas</p>
                </div>
              </div>

              <p className="mt-8 max-w-md text-sm text-white/75 leading-relaxed">
                Interfaz institucional para control de proyectos, bloques y piezas. Diseñada para trazabilidad,
                precisión técnica y operación diaria en entornos industriales.
              </p>
            </div>

            <div className="text-xs text-white/55">
              Corporación de Ciencia y Tecnología para el Desarrollo de la Industria Naval, Marítima y Fluvial de Colombia
            </div>
          </div>
        </div>


        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-cotecmar-navy text-white flex items-center justify-center">
                  <CotecmarIcon />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 tracking-tight">COTECMAR</h1>
                  <p className="text-sm text-cotecmar-muted">Sistema de Gestión de Piezas</p>
                </div>
              </div>
            </div>

            {errorServidor && (
              <Alerta variant="error" className="mb-4">
                {errorServidor}
              </Alerta>
            )}

            <form onSubmit={manejarEnvio} noValidate className="space-y-4">
              <Input
                type="email"
                name="email"
                value={formulario.email}
                onChange={manejarCambio}
                placeholder="correo@ejemplo.com"
                label="Correo electrónico"
                iconLeft={IconoCorreo}
                error={errores.email}
                autoComplete="email"
              />

              <Input
                type="password"
                name="contrasena"
                value={formulario.contrasena}
                onChange={manejarCambio}
                placeholder="••••••••"
                label="Contraseña"
                iconLeft={IconoCandado}
                error={errores.contrasena}
                autoComplete="current-password"
              />

              <Boton
                type="submit"
                loading={enviando}
                className="w-full"
              >
                {enviando ? 'Ingresando…' : 'Ingresar'}
              </Boton>
            </form>

            <div className="mt-8 text-xs text-slate-500">
              Acceso institucional. Si tienes problemas para ingresar, verifica tu correo y contraseña.
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}