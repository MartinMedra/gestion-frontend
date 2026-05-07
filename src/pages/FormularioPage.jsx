import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alerta, Badge, Boton, Select, Textarea } from '../components/ui'
import CotecmarIcon from '../components/ui/cotecmarIcon'
import {
  obtenerProyectos,
  obtenerBloques,
  obtenerPiezas,
  crearRegistro,
} from '../api/piezasApi'

function IconoNivel({ nivel }) {
  if (nivel === 'proyecto') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 4 12 6h8a2 2 0 0 1 2 2v2H2V6a2 2 0 0 1 2-2h6Zm12 8v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8h20Z"
        />
      </svg>
    )
  }

  if (nivel === 'bloque') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.3 6.5 3.2L12 10.7 5.5 7.5 12 4.3ZM5 9.2l6 3V19l-6-3v-6.8Zm14 0V16l-6 3v-6.8l6-3Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.4 13.5a7.7 7.7 0 0 0 .1-1.5 7.7 7.7 0 0 0-.1-1.5l2.1-1.6-2-3.4-2.5 1a8 8 0 0 0-2.6-1.5l-.4-2.6H10l-.4 2.6A8 8 0 0 0 7 6.5l-2.5-1-2 3.4 2.1 1.6A7.7 7.7 0 0 0 4.5 12c0 .5 0 1 .1 1.5L2.5 15l2 3.4 2.5-1a8 8 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a8 8 0 0 0 2.6-1.5l2.5 1 2-3.4-2.1-1.5ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
      />
    </svg>
  )
}

function IconoDiferencia({ estado }) {
  if (estado === 'exacto') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M9.2 16.2 5.7 12.7l1.4-1.4 2.1 2.1 7.6-7.6 1.4 1.4-9 9Z" />
      </svg>
    )
  }

  if (estado === 'exceso') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M12 4 5 11h4v9h6v-9h4L12 4Z" />
      </svg>
    )
  }

  if (estado === 'deficit') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M12 20 19 13h-4V4H9v9H5l7 7Z" />
      </svg>
    )
  }

  return null
}

const estadoInicial = {
  proyectoId: '',
  bloqueId:   '',
  piezaId:    '',
  pesoReal:   '',
  estado:     'fabricada',
  observaciones: '',
}

export default function FormularioPage() {
  const { logout, usuario } = useAuth()
  const navegar = useNavigate()

  const [proyectos, setProyectos] = useState([])
  const [bloques,   setBloques]   = useState([])
  const [piezas,    setPiezas]    = useState([])

  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null)

  const [formulario, setFormulario] = useState(estadoInicial)
  const [errores,    setErrores]    = useState({})
  const [enviando,   setEnviando]   = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')

  const diferenciaPeso = piezaSeleccionada && formulario.pesoReal
    ? (parseFloat(formulario.pesoReal) - parseFloat(piezaSeleccionada.peso_teorico)).toFixed(3)
    : null

  useEffect(() => {
    obtenerProyectos({ estado: 'activo', por_pagina: 100 })
      .then(res => setProyectos(res.data.data))
      .catch(console.error)
  }, [])

  // Cargar bloques cuando cambia el proyecto
  useEffect(() => {
    if (!formulario.proyectoId) return
    obtenerBloques(formulario.proyectoId, { por_pagina: 100 })
      .then(res => setBloques(res.data.data))
      .catch(console.error)
  }, [formulario.proyectoId])

  useEffect(() => {
    if (!formulario.bloqueId) return
    obtenerPiezas(formulario.bloqueId, { por_pagina: 100 })
      .then(res => setPiezas(res.data.data))
      .catch(console.error)
  }, [formulario.bloqueId])

  const manejarCambio = (e) => {
    const { name, value } = e.target

    if (name === 'proyectoId') {
      setBloques([])
      setPiezas([])
      setPiezaSeleccionada(null)
    }
    if (name === 'bloqueId') {
      setPiezas([])
      setPiezaSeleccionada(null)
    }
    if (name === 'piezaId') {
      const encontrada = piezas.find(p => p.id === parseInt(value))
      setPiezaSeleccionada(encontrada || null)
    }

    setFormulario(prev => {
      const nuevo = { ...prev, [name]: value }
      if (name === 'proyectoId') { nuevo.bloqueId = ''; nuevo.piezaId = '' }
      if (name === 'bloqueId')   { nuevo.piezaId = '' }
      return nuevo
    })
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!formulario.proyectoId)  nuevosErrores.proyectoId = 'Selecciona un proyecto.'
    if (!formulario.bloqueId)    nuevosErrores.bloqueId   = 'Selecciona un bloque.'
    if (!formulario.piezaId)     nuevosErrores.piezaId    = 'Selecciona una pieza.'
    if (!formulario.pesoReal) {
      nuevosErrores.pesoReal = 'El peso real es obligatorio.'
    } else if (isNaN(formulario.pesoReal) || parseFloat(formulario.pesoReal) <= 0) {
      nuevosErrores.pesoReal = 'Ingresa un número mayor a cero.'
    }
    if (!formulario.estado) nuevosErrores.estado = 'Selecciona un estado.'
    return nuevosErrores
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setMensajeExito('')

    const erroresValidacion = validar()
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    setEnviando(true)
    try {
      await crearRegistro(formulario.piezaId, {
        peso_real:     parseFloat(formulario.pesoReal),
        estado:        formulario.estado,
        observaciones: formulario.observaciones,
      })

      setMensajeExito('Registro de fabricación guardado correctamente.')
      setFormulario(prev => ({ ...prev, pesoReal: '', observaciones: '', estado: 'fabricada' }))
      setPiezaSeleccionada(null)

    } catch (error) {
      const erroresBackend = error.response?.data?.errors
      if (erroresBackend) {
        const mapeados = {}
        if (erroresBackend.peso_real)     mapeados.pesoReal = erroresBackend.peso_real[0]
        if (erroresBackend.estado)        mapeados.estado   = erroresBackend.estado[0]
        if (erroresBackend.observaciones) mapeados.observaciones = erroresBackend.observaciones[0]
        setErrores(mapeados)
      }
    } finally {
      setEnviando(false)
    }
  }

  const manejarLogout = async () => {
    await logout()
    navegar('/login')
  }

  const proyectoSeleccionado = proyectos.find(p => p.id === parseInt(formulario.proyectoId))
  const bloqueSeleccionado = bloques.find(b => b.id === parseInt(formulario.bloqueId))
  const piezaSeleccionadaLocal = piezas.find(p => p.id === parseInt(formulario.piezaId))

  const valorDiferencia = diferenciaPeso !== null ? parseFloat(diferenciaPeso) : null
  const estadoDiferencia = valorDiferencia === null ? null : (valorDiferencia > 0 ? 'exceso' : valorDiferencia < 0 ? 'deficit' : 'exacto')

  return (
    <div className="min-h-screen bg-cotecmar-surface">

      <nav className="sticky top-0 z-20 border-b border-white/10 bg-cotecmar-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
              <CotecmarIcon />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">COTECMAR</p>
              <p className="text-xs text-white/70">Registro de Fabricación</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-sm text-white/75">Hola, {usuario?.name}</span>
            <Boton
              variant="ghost"
              onClick={() => navegar('/dashboard')}
              className="!text-white hover:!bg-white/10"
            >
              Dashboard
            </Boton>
            <Boton
              variant="ghost"
              onClick={() => navegar('/reportes')}
              className="!text-white hover:!bg-white/10"
            >
              Reportes
            </Boton>
            <Boton
              variant="ghost"
              onClick={manejarLogout}
              className="!text-white/85 hover:!bg-white/10"
            >
              Salir
            </Boton>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {mensajeExito && (
          <Alerta variant="success" className="mb-6">
            {mensajeExito}
          </Alerta>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 animate__animated animate__fadeInUp">
          {/* Panel de contexto (40%) */}
          <aside className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Contexto seleccionado</h2>
                  <p className="mt-1 text-xs text-slate-500">Proyecto → Bloque → Pieza</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {formulario.estado && <Badge value={formulario.estado} />}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-md border border-slate-200 p-3">
                  <div className="flex items-center gap-2 text-xs text-cotecmar-navy font-medium">
                    <IconoNivel nivel="proyecto" />
                    Proyecto
                  </div>
                  <div className="mt-1 text-sm text-slate-900">
                    {proyectoSeleccionado ? proyectoSeleccionado.nombre : <span className="text-slate-400">—</span>}
                  </div>
                  <div className="mt-0.5 text-xs font-mono text-slate-500">
                    {proyectoSeleccionado ? proyectoSeleccionado.codigo_proyecto : ''}
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-3">
                  <div className="flex items-center gap-2 text-xs text-cotecmar-steel font-medium">
                    <IconoNivel nivel="bloque" />
                    Bloque
                  </div>
                  <div className="mt-1 text-sm text-slate-900">
                    {bloqueSeleccionado ? bloqueSeleccionado.nombre : <span className="text-slate-400">—</span>}
                  </div>
                  <div className="mt-0.5 text-xs font-mono text-slate-500">
                    {bloqueSeleccionado ? bloqueSeleccionado.codigo_bloque : ''}
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-3">
                  <div className="flex items-center gap-2 text-xs text-cotecmar-success font-medium">
                    <IconoNivel nivel="pieza" />
                    Pieza
                  </div>
                  <div className="mt-1 text-sm text-slate-900">
                    {piezaSeleccionadaLocal ? piezaSeleccionadaLocal.nombre : <span className="text-slate-400">—</span>}
                  </div>
                  <div className="mt-0.5 text-xs font-mono text-slate-500">
                    {piezaSeleccionadaLocal ? piezaSeleccionadaLocal.codigo_pieza : ''}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-600">Peso teórico</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {piezaSeleccionada ? (
                      <>
                        {piezaSeleccionada.peso_teorico} <span className="text-sm font-medium text-slate-500">kg</span>
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Se usa para calcular la diferencia contra el peso real.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Formulario (60%) */}
          <section className="lg:col-span-3">
            <form onSubmit={manejarEnvio} noValidate className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Datos de la pieza</h2>
                <div className="mt-2 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  name="proyectoId"
                  value={formulario.proyectoId}
                  onChange={manejarCambio}
                  label="Proyecto"
                  error={errores.proyectoId}
                >
                  <option value="">— Selecciona un proyecto —</option>
                  {proyectos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.codigo_proyecto})
                    </option>
                  ))}
                </Select>

                <Select
                  name="bloqueId"
                  value={formulario.bloqueId}
                  onChange={manejarCambio}
                  disabled={!formulario.proyectoId}
                  label="Bloque"
                  error={errores.bloqueId}
                >
                  <option value="">— Selecciona un bloque —</option>
                  {bloques.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nombre} ({b.codigo_bloque})
                    </option>
                  ))}
                </Select>
              </div>

              <Select
                name="piezaId"
                value={formulario.piezaId}
                onChange={manejarCambio}
                disabled={!formulario.bloqueId}
                label="Pieza"
                error={errores.piezaId}
              >
                <option value="">— Selecciona una pieza —</option>
                {piezas.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.codigo_pieza})
                  </option>
                ))}
              </Select>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">Datos de fabricación</h2>
                <div className="mt-2 h-px bg-slate-200" />
              </div>

              {/* Peso real con sufijo kg */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Peso real</label>
                <div className={`relative rounded-md border bg-white transition duration-200 ease-in-out focus-within:ring-2 focus-within:ring-cotecmar-steel/25 ${errores.pesoReal ? 'border-cotecmar-error' : 'border-slate-200'}`}>
                  <input
                    type="number"
                    name="pesoReal"
                    value={formulario.pesoReal}
                    onChange={manejarCambio}
                    step="0.001"
                    min="0.001"
                    placeholder="Ej: 125.750"
                    className="w-full bg-transparent px-3 py-2 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-500">
                    kg
                  </div>
                </div>
                {errores.pesoReal && <p className="text-xs text-cotecmar-error">{errores.pesoReal}</p>}
              </div>

              {/* Diferencia de peso */}
              {diferenciaPeso !== null && (
                <div
                  className={
                    `rounded-md border p-4 ` +
                    `${estadoDiferencia === 'exceso'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : estadoDiferencia === 'deficit'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <IconoDiferencia estado={estadoDiferencia} />
                        Diferencia de peso
                      </div>
                      <div className="mt-1 text-2xl font-semibold">
                        {valorDiferencia > 0 ? '+' : ''}{diferenciaPeso} <span className="text-sm font-medium opacity-70">kg</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium">
                      {estadoDiferencia === 'exacto' && 'Exacto'}
                      {estadoDiferencia === 'exceso' && 'Exceso'}
                      {estadoDiferencia === 'deficit' && 'Déficit'}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                  label="Estado"
                  error={errores.estado}
                >
                  <option value="fabricada">Fabricada</option>
                  <option value="pendiente">Pendiente</option>
                </Select>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-600">Referencia de estados</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge value="pendiente" />
                    <Badge value="fabricada" />
                  </div>
                </div>
              </div>

              <Textarea
                name="observaciones"
                value={formulario.observaciones}
                onChange={manejarCambio}
                rows={3}
                label={<>
                  Observaciones <span className="text-slate-400 font-normal">(opcional)</span>
                </>}
                placeholder="Notas sobre el proceso de fabricación…"
              />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Boton
                  type="button"
                  variant="secondary"
                  onClick={() => navegar('/dashboard')}
                  className="w-full sm:w-auto"
                >
                  Volver
                </Boton>
                <Boton type="submit" loading={enviando} className="w-full sm:w-auto">
                  {enviando ? 'Guardando…' : 'Registrar fabricación'}
                </Boton>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}