import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alerta, Badge, Boton, Input, Textarea } from '../components/ui'
import CotecmarIcon from '../components/ui/cotecmarIcon'
import {
  obtenerProyectos,
  obtenerBloques,
  obtenerPiezas,
  crearProyecto,
  crearBloque,
  crearPieza,
  eliminarProyecto,
  eliminarBloque,
  eliminarPieza,
} from '../api/piezasApi'

function Icono({ name, className = 'h-5 w-5' }) {
  if (name === 'carpeta') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 4 12 6h8a2 2 0 0 1 2 2v2H2V6a2 2 0 0 1 2-2h6Zm12 8v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8h20Z"
        />
      </svg>
    )
  }

  if (name === 'cubo') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.3 6.5 3.2L12 10.7 5.5 7.5 12 4.3ZM5 9.2l6 3V19l-6-3v-6.8Zm14 0V16l-6 3v-6.8l6-3Z"
        />
      </svg>
    )
  }

  if (name === 'engranaje') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.4 13.5a7.7 7.7 0 0 0 .1-1.5 7.7 7.7 0 0 0-.1-1.5l2.1-1.6-2-3.4-2.5 1a8 8 0 0 0-2.6-1.5l-.4-2.6H10l-.4 2.6A8 8 0 0 0 7 6.5l-2.5-1-2 3.4 2.1 1.6A7.7 7.7 0 0 0 4.5 12c0 .5 0 1 .1 1.5L2.5 15l2 3.4 2.5-1a8 8 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a8 8 0 0 0 2.6-1.5l2.5 1 2-3.4-2.1-1.5ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
        />
      </svg>
    )
  }

  return null
}

function IconoX({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4Z"
      />
    </svg>
  )
}

function TarjetaEstadistica({ etiqueta, valor, icono, acento }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">{etiqueta}</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{valor}</p>
        </div>
        <div className={`h-10 w-10 rounded-md border ${acento} flex items-center justify-center`}>
          {icono}
        </div>
      </div>
    </div>
  )
}

function Modal({ titulo, onCerrar, nivel = 'proyecto', children , className}) {
  const [animado, setAnimado] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimado(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const barra =
    nivel === 'proyecto'
      ? 'bg-cotecmar-navy'
      : nivel === 'bloque'
        ? 'bg-cotecmar-steel'
        : nivel === 'advertencia'
          ? 'bg-cotecmar-error'
          : 'bg-cotecmar-success'

  return (
    <div className={
      `fixed inset-0 z-50 flex items-center justify-center p-4`+
      `${className}`
    }>
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onCerrar}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={
          `relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ` +
          `transform transition duration-200 ease-in-out ` +
          `${animado ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`
        }
      >
        <div className={`h-1.5 ${barra}`} />
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">{titulo}</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition duration-200 ease-in-out"
            aria-label="Cerrar"
          >
            <IconoX />
          </button>
        </div>

        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { logout, usuario } = useAuth()
  const navegar = useNavigate()

  // Datos
  const [proyectos, setProyectos] = useState([])
  const [bloques, setBloques] = useState([])
  const [piezas, setPiezas] = useState([])

  // Selección activa en el explorador jerárquico
  const [proyectoActivo, setProyectoActivo] = useState(null)
  const [bloqueActivo, setBloqueActivo] = useState(null)

  // Control de modales
  const [modalAbierto, setModalAbierto] = useState(null)
  // 'proyecto' | 'bloque' | 'pieza' | null

  // Modal de confirmación para eliminar
  const [modalConfirmacion, setModalConfirmacion] = useState(null)
  const [confirmarTipo, setConfirmarTipo] = useState(null)
  const [confirmarId, setConfirmarId] = useState(null)

  // Modal de confirmación para logout
  const [modalLogoutConfirmacion, setModalLogoutConfirmacion] = useState(false)

  // Vista en móvil: tabs del explorador jerárquico
  const [columnaMovil, setColumnaMovil] = useState('proyectos')

  // Estado del formulario del modal
  const [formularioModal, setFormularioModal] = useState({})
  const [erroresModal, setErroresModal] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')

  // ── Carga inicial de proyectos
  useEffect(() => {
    cargarProyectos()
  }, [])

  // ── Cargar bloques cuando cambia el proyecto activo
  useEffect(() => {
    if (!proyectoActivo) {
      setBloques([])
      setPiezas([])
      return
    }

    obtenerBloques(proyectoActivo.id, { por_pagina: 100 })
      .then(res => setBloques(res.data.data))
      .catch(console.error)

    setBloqueActivo(null)
    setPiezas([])
  }, [proyectoActivo])

  // ── Cargar piezas cuando cambia el bloque activo
  useEffect(() => {
    if (!bloqueActivo) {
      setPiezas([])
      return
    }

    obtenerPiezas(bloqueActivo.id, { por_pagina: 100 })
      .then(res => setPiezas(res.data.data))
      .catch(console.error)
  }, [bloqueActivo])

  const cargarProyectos = () => {
    obtenerProyectos({ por_pagina: 100 })
      .then(res => setProyectos(res.data.data))
      .catch(console.error)
  }

  // ── Abrir modal limpio
  const abrirModal = (tipo) => {
    setFormularioModal({})
    setErroresModal({})
    setMensajeExito('')
    setModalAbierto(tipo)
  }

  const cerrarModal = () => setModalAbierto(null)

  const manejarCambioModal = (e) => {
    const { name, value } = e.target
    setFormularioModal(prev => ({ ...prev, [name]: value }))
    if (erroresModal[name]) setErroresModal(prev => ({ ...prev, [name]: '' }))
  }

  // ── Guardar según el tipo de modal abierto
  const guardar = async () => {
    setGuardando(true)
    setErroresModal({})

    try {
      if (modalAbierto === 'proyecto') {
        const errores = {}
        if (!formularioModal.nombre) errores.nombre = 'El nombre es obligatorio.'
        if (!formularioModal.codigo_proyecto) errores.codigo_proyecto = 'El código es obligatorio.'
        if (Object.keys(errores).length > 0) {
          setErroresModal(errores)
          return
        }

        await crearProyecto(formularioModal)
        cargarProyectos()
        setMensajeExito('Proyecto creado correctamente.')
      }

      if (modalAbierto === 'bloque') {
        const errores = {}
        if (!formularioModal.nombre) errores.nombre = 'El nombre es obligatorio.'
        if (!formularioModal.codigo_bloque) errores.codigo_bloque = 'El código es obligatorio.'
        if (Object.keys(errores).length > 0) {
          setErroresModal(errores)
          return
        }

        await crearBloque(proyectoActivo.id, formularioModal)

        // Recargar bloques del proyecto activo
        const res = await obtenerBloques(proyectoActivo.id, { por_pagina: 100 })
        setBloques(res.data.data)
        setMensajeExito('Bloque creado correctamente.')
      }

      if (modalAbierto === 'pieza') {
        const errores = {}
        if (!formularioModal.nombre) errores.nombre = 'El nombre es obligatorio.'
        if (!formularioModal.codigo_pieza) errores.codigo_pieza = 'El código es obligatorio.'
        if (!formularioModal.peso_teorico || parseFloat(formularioModal.peso_teorico) <= 0)
          errores.peso_teorico = 'Ingresa un peso válido mayor a cero.'
        if (Object.keys(errores).length > 0) {
          setErroresModal(errores)
          return
        }

        await crearPieza(bloqueActivo.id, {
          ...formularioModal,
          peso_teorico: parseFloat(formularioModal.peso_teorico),
        })
        const res = await obtenerPiezas(bloqueActivo.id, { por_pagina: 100 })
        setPiezas(res.data.data)
        setMensajeExito('Pieza creada correctamente.')
      }

      setTimeout(cerrarModal, 1200)
    } catch (error) {
      const erroresBackend = error.response?.data?.errors || {}
      setErroresModal(
        Object.fromEntries(Object.entries(erroresBackend).map(([k, v]) => [k, v[0]]))
      )
    } finally {
      setGuardando(false)
    }
  }

  // ── Eliminar con confirmación en modal
  const abrirModalConfirmacion = (tipo, id) => {
    setConfirmarTipo(tipo)
    setConfirmarId(id)
    setModalConfirmacion(true)
  }

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false)
    setConfirmarTipo(null)
    setConfirmarId(null)
  }

  const confirmarEliminar = async () => {
    if (!confirmarTipo || !confirmarId) return

    try {
      if (confirmarTipo === 'proyecto') {
        await eliminarProyecto(confirmarId)
        setProyectoActivo(null)
        cargarProyectos()
      }
      if (confirmarTipo === 'bloque') {
        await eliminarBloque(proyectoActivo.id, confirmarId)
        setBloqueActivo(null)
        const res = await obtenerBloques(proyectoActivo.id, { por_pagina: 100 })
        setBloques(res.data.data)
      }
      if (confirmarTipo === 'pieza') {
        await eliminarPieza(bloqueActivo.id, confirmarId)
        const res = await obtenerPiezas(bloqueActivo.id, { por_pagina: 100 })
        setPiezas(res.data.data)
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      cerrarModalConfirmacion()
    }
  }

  // ── Eliminar con confirmación nativa
  const eliminar = async (tipo, id) => {
    abrirModalConfirmacion(tipo, id)
  }

  const manejarLogout = async () => {
    setModalLogoutConfirmacion(true)
  }

  const confirmarLogout = async () => {
    try {
      await logout()
      navegar('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setModalLogoutConfirmacion(false)
    }
  }

  const cancelarLogout = () => {
    setModalLogoutConfirmacion(false)
  }

  const seleccionarProyecto = (proyecto) => {
    setProyectoActivo(proyecto)
    if (window.matchMedia?.('(max-width: 767px)').matches) setColumnaMovil('bloques')
  }

  const seleccionarBloque = (bloque) => {
    setBloqueActivo(bloque)
    if (window.matchMedia?.('(max-width: 767px)').matches) setColumnaMovil('piezas')
  }

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
              <p className="text-xs text-white/70">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-sm text-white/75">Hola, {usuario?.name}</span>
            <Boton
              variant="secondary"
              onClick={() => navegar('/formulario')}
              className="!border-white/15 !bg-white/10 !text-white hover:!bg-white/15"
            >
              Registrar
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

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 animate__animated animate__fadeInUp">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TarjetaEstadistica
            etiqueta="Proyectos activos"
            valor={proyectos.filter(p => p.estado === 'activo').length}
            icono={<Icono name="carpeta" className="h-5 w-5 text-cotecmar-navy" />}
            acento="bg-slate-50 border-slate-200"
          />
          <TarjetaEstadistica
            etiqueta="Bloques cargados"
            valor={bloques.length}
            icono={<Icono name="cubo" className="h-5 w-5 text-cotecmar-steel" />}
            acento="bg-slate-50 border-slate-200"
          />
          <TarjetaEstadistica
            etiqueta="Piezas en bloque"
            valor={piezas.length}
            icono={<Icono name="engranaje" className="h-5 w-5 text-cotecmar-success" />}
            acento="bg-slate-50 border-slate-200"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex md:hidden items-center gap-1 border-b border-slate-200 p-2">
            <button
              type="button"
              onClick={() => setColumnaMovil('proyectos')}
              className={
                `flex-1 rounded-md px-3 py-2 text-xs font-medium transition duration-200 ease-in-out ` +
                `${columnaMovil === 'proyectos' ? 'bg-slate-100 text-cotecmar-navy' : 'text-slate-600 hover:bg-slate-50'}`
              }
            >
              Proyectos
            </button>
            <button
              type="button"
              onClick={() => setColumnaMovil('bloques')}
              disabled={!proyectoActivo}
              className={
                `flex-1 rounded-md px-3 py-2 text-xs font-medium transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ` +
                `${columnaMovil === 'bloques' ? 'bg-slate-100 text-cotecmar-steel' : 'text-slate-600 hover:bg-slate-50'}`
              }
            >
              Bloques
            </button>
            <button
              type="button"
              onClick={() => setColumnaMovil('piezas')}
              disabled={!bloqueActivo}
              className={
                `flex-1 rounded-md px-3 py-2 text-xs font-medium transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ` +
                `${columnaMovil === 'piezas' ? 'bg-slate-100 text-cotecmar-success' : 'text-slate-600 hover:bg-slate-50'}`
              }
            >
              Piezas
            </button>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            <section className={`${columnaMovil !== 'proyectos' ? 'hidden md:block' : ''} md:border-r md:border-slate-200`}>
              <header className="flex items-center justify-between gap-3 px-4 py-4 border-t-4 border-cotecmar-navy">
                <div>
                  <h2 className="text-sm font-semibold text-cotecmar-navy">Proyectos</h2>
                  <p className="text-xs text-slate-500">Jerarquía: Proyecto</p>
                </div>
                <Boton
                  variant="ghost"
                  onClick={() => abrirModal('proyecto')}
                  className="!text-cotecmar-steel hover:!bg-cotecmar-steel/10"
                >
                  + Nuevo
                </Boton>
              </header>

              <div className="px-2 pb-3">
                <ul className="space-y-1">
                  {proyectos.length === 0 && (
                    <li className="px-3 py-10 text-center text-xs text-slate-400">Sin proyectos aún.</li>
                  )}
                  {proyectos.map(proyecto => {
                    const activo = proyectoActivo?.id === proyecto.id
                    return (
                      <li
                        key={proyecto.id}
                        onClick={() => seleccionarProyecto(proyecto)}
                        className={
                          `group flex items-start justify-between gap-3 rounded-md border-l-4 px-3 py-2 cursor-pointer transition duration-200 ease-in-out ` +
                          `${activo ? 'border-cotecmar-navy bg-slate-50' : 'border-transparent hover:bg-slate-50'}`
                        }
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 leading-tight truncate">{proyecto.nombre}</p>
                          <p className="mt-0.5 text-xs text-slate-500 font-mono truncate">{proyecto.codigo_proyecto}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {activo && <Badge value={bloques.length} />}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              eliminar('proyecto', proyecto.id)
                            }}
                            className="rounded-md p-1 text-slate-400 hover:text-cotecmar-error hover:bg-slate-100 transition duration-200 ease-in-out"
                            aria-label="Eliminar proyecto"
                          >
                            <IconoX className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>

            <section className={`${columnaMovil !== 'bloques' ? 'hidden md:block' : ''} md:border-r md:border-slate-200`}>
              <header className="flex items-center justify-between gap-3 px-4 py-4 border-t-4 border-cotecmar-steel">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-cotecmar-steel">Bloques</h2>
                  <p className="text-xs text-slate-500 truncate">
                    {proyectoActivo ? (
                      <>
                        Proyecto: <span className="text-slate-700 font-medium">{proyectoActivo.nombre}</span>
                      </>
                    ) : (
                      'Selecciona un proyecto'
                    )}
                  </p>
                </div>
                {proyectoActivo && (
                  <Boton
                    variant="ghost"
                    onClick={() => abrirModal('bloque')}
                    className="!text-cotecmar-steel hover:!bg-cotecmar-steel/10"
                  >
                    + Nuevo
                  </Boton>
                )}
              </header>

              <div className="px-2 pb-3">
                {!proyectoActivo ? (
                  <div className="px-3 py-10 text-center text-xs text-slate-400">
                    Selecciona un proyecto para ver sus bloques.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {bloques.length === 0 && (
                      <li className="px-3 py-10 text-center text-xs text-slate-400">Sin bloques en este proyecto.</li>
                    )}
                    {bloques.map(bloque => {
                      const activo = bloqueActivo?.id === bloque.id
                      return (
                        <li
                          key={bloque.id}
                          onClick={() => seleccionarBloque(bloque)}
                          className={
                            `group flex items-start justify-between gap-3 rounded-md border-l-4 px-3 py-2 cursor-pointer transition duration-200 ease-in-out ` +
                            `${activo ? 'border-cotecmar-steel bg-slate-50' : 'border-transparent hover:bg-slate-50'}`
                          }
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 leading-tight truncate">{bloque.nombre}</p>
                            <p className="mt-0.5 text-xs text-slate-500 font-mono truncate">{bloque.codigo_bloque}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {activo && <Badge value={piezas.length} />}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                eliminar('bloque', bloque.id)
                              }}
                              className="rounded-md p-1 text-slate-400 hover:text-cotecmar-error hover:bg-slate-100 transition duration-200 ease-in-out"
                              aria-label="Eliminar bloque"
                            >
                              <IconoX className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </section>

            <section className={columnaMovil !== 'piezas' ? 'hidden md:block' : ''}>
              <header className="flex items-center justify-between gap-3 px-4 py-4 border-t-4 border-cotecmar-success">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-cotecmar-success">Piezas</h2>
                  <p className="text-xs text-slate-500 truncate">
                    {bloqueActivo ? (
                      <>
                        Bloque: <span className="text-slate-700 font-medium">{bloqueActivo.nombre}</span>
                      </>
                    ) : (
                      'Selecciona un bloque'
                    )}
                  </p>
                </div>
                {bloqueActivo && (
                  <Boton
                    variant="ghost"
                    onClick={() => abrirModal('pieza')}
                    className="!text-cotecmar-success hover:!bg-cotecmar-success/10"
                  >
                    + Nueva
                  </Boton>
                )}
              </header>

              <div className="px-2 pb-3">
                {!bloqueActivo ? (
                  <div className="px-3 py-10 text-center text-xs text-slate-400">
                    Selecciona un bloque para ver sus piezas.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {piezas.length === 0 && (
                      <li className="px-3 py-10 text-center text-xs text-slate-400">Sin piezas en este bloque.</li>
                    )}
                    {piezas.map(pieza => (
                      <li
                        key={pieza.id}
                        className="flex items-start justify-between gap-3 rounded-md px-3 py-2 transition duration-200 ease-in-out hover:bg-slate-50"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 leading-tight truncate">{pieza.nombre}</p>
                          <p className="mt-0.5 text-xs text-slate-500 font-mono truncate">
                            {pieza.codigo_pieza} · {pieza.peso_teorico} kg
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminar('pieza', pieza.id)}
                          className="rounded-md p-1 text-slate-400 hover:text-cotecmar-error hover:bg-slate-100 transition duration-200 ease-in-out"
                          aria-label="Eliminar pieza"
                        >
                          <IconoX className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modales */}
      {modalAbierto === 'proyecto' && (
        <Modal titulo="Nuevo proyecto" onCerrar={cerrarModal} nivel="proyecto">
          <div className="space-y-4">
            {mensajeExito && <Alerta variant="success">{mensajeExito}</Alerta>}

            <Input
              name="nombre"
              onChange={manejarCambioModal}
              label="Nombre"
              error={erroresModal.nombre}
              placeholder="Ej: Proyecto Patrullera"
            />

            <Input
              name="codigo_proyecto"
              onChange={manejarCambioModal}
              label="Código"
              error={erroresModal.codigo_proyecto}
              placeholder="Ej: COTECMAR-2024-001"
              className="font-mono"
            />

            <Textarea
              name="descripcion"
              onChange={manejarCambioModal}
              label="Descripción (opcional)"
              rows={2}
              placeholder="Notas del proyecto…"
            />

            <Boton onClick={guardar} loading={guardando} className="w-full">
              {guardando ? 'Guardando…' : 'Crear proyecto'}
            </Boton>
          </div>
        </Modal>
      )}

      {modalAbierto === 'bloque' && (
        <Modal titulo={`Nuevo bloque en "${proyectoActivo?.nombre}"`} onCerrar={cerrarModal} nivel="bloque">
          <div className="space-y-4">
            {mensajeExito && <Alerta variant="success">{mensajeExito}</Alerta>}

            <Input
              name="nombre"
              onChange={manejarCambioModal}
              label="Nombre"
              error={erroresModal.nombre}
              placeholder="Ej: Bloque de estructura"
            />

            <Input
              name="codigo_bloque"
              onChange={manejarCambioModal}
              label="Código"
              error={erroresModal.codigo_bloque}
              placeholder="Ej: BLQ-001"
              className="font-mono"
            />

            <Textarea
              name="descripcion"
              onChange={manejarCambioModal}
              label="Descripción (opcional)"
              rows={2}
              placeholder="Notas del bloque…"
            />

            <Boton onClick={guardar} loading={guardando} className="w-full">
              {guardando ? 'Guardando…' : 'Crear bloque'}
            </Boton>
          </div>
        </Modal>
      )}

      {modalAbierto === 'pieza' && (
        <Modal titulo={`Nueva pieza en "${bloqueActivo?.nombre}"`} onCerrar={cerrarModal} nivel="pieza">
          <div className="space-y-4">
            {mensajeExito && <Alerta variant="success">{mensajeExito}</Alerta>}

            <Input
              name="nombre"
              onChange={manejarCambioModal}
              label="Nombre"
              error={erroresModal.nombre}
              placeholder="Ej: Refuerzo longitudinal"
            />

            <Input
              name="codigo_pieza"
              onChange={manejarCambioModal}
              label="Código"
              error={erroresModal.codigo_pieza}
              placeholder="Ej: PZA-001"
              className="font-mono"
            />

            <Input
              name="peso_teorico"
              type="number"
              step="0.001"
              min="0.001"
              onChange={manejarCambioModal}
              label="Peso teórico (kg)"
              error={erroresModal.peso_teorico}
              placeholder="Ej: 125.500"
            />

            <Textarea
              name="descripcion"
              onChange={manejarCambioModal}
              label="Descripción (opcional)"
              rows={2}
              placeholder="Notas de la pieza…"
            />

            <Boton onClick={guardar} loading={guardando} className="w-full">
              {guardando ? 'Guardando…' : 'Crear pieza'}
            </Boton>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación para eliminar */}
      {modalConfirmacion && (
        <Modal titulo="Confirmar eliminación" onCerrar={cerrarModalConfirmacion} nivel={confirmarTipo}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              ¿Estás seguro de que quieres eliminar {' '}
              <span className="font-semibold text-slate-900">
                {confirmarTipo === 'proyecto'
                  ? 'este proyecto'
                  : confirmarTipo === 'bloque'
                    ? 'este bloque'
                    : 'esta pieza'}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3 justify-end">
              <Boton variant="secondary" onClick={cerrarModalConfirmacion}>
                Cancelar
              </Boton>
              <Boton
                variant="base"
                onClick={confirmarEliminar}
                className="!text-cotecmar-surface bg-cotecmar-error hover:bg-cotecmar-error/65"
              >
                Eliminar
              </Boton>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación para logout */}
      {modalLogoutConfirmacion && (
        <Modal titulo="Cerrar sesión" onCerrar={cancelarLogout} nivel="advertencia">
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              ¿Estás seguro de que deseas <span className="font-semibold text-slate-900">cerrar tu sesión</span>?
            </p>

            <div className="flex gap-3 justify-end">
              <Boton variant="secondary" onClick={cancelarLogout}>
                Cancelar
              </Boton>
              <Boton
                variant="base"
                onClick={confirmarLogout}
                className="!text-cotecmar-surface bg-cotecmar-error hover:bg-cotecmar-error/65"
              >
                Cerrar sesión
              </Boton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
