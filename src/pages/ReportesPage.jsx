import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { obtenerPiezasPendientes, obtenerTotalesPorEstado } from '../api/piezasApi'
import CotecmarIcon from '../components/ui/cotecmarIcon'
import { Badge, Boton, Spinner } from '../components/ui'

const COLORES = {
  pendiente: '#f59e0b',
  fabricada:  '#10b981',
}

function EstadoLabel({ estado }) {
  if (estado === 'pendiente') return <Badge value="pendiente" />
  if (estado === 'fabricada') return <Badge value="fabricada" />
  return <span className="text-xs text-slate-500">{estado}</span>
}

function TooltipCard({ active, payload, label, formatoLabel, filas }) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-xs font-semibold text-slate-900">
        {formatoLabel ? formatoLabel(label, data) : label}
      </div>
      <div className="mt-1 space-y-1">
        {filas.map((fila, i) => (
          <div key={i} className="flex items-center justify-between gap-6 text-xs text-slate-700">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: fila.color }} />
              {fila.label}
            </span>
            <span className="font-mono font-semibold text-slate-900">{fila.value(data)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="rounded-full border border-slate-200 bg-slate-50 p-4">
        <svg viewBox="0 0 64 64" className="h-10 w-10 text-cotecmar-steel" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 44c8-6 14-8 22-8s14 2 22 8v4H10v-4Zm6-12h32l-4 8H20l-4-8Zm10-16h12l6 14H20l6-14Z"
            opacity=".9"
          />
          <path
            fill="currentColor"
            d="M28 12h8v6h-8v-6Z"
            opacity=".7"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  )
}

export default function ReportesPage() {
  const navegar = useNavigate()
  const [pendientesPorProyecto, setPendientesPorProyecto] = useState([])
  const [totalesPorEstado,      setTotalesPorEstado]      = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([obtenerPiezasPendientes(), obtenerTotalesPorEstado()])
      .then(([resPendientes, resTotales]) => {
        setPendientesPorProyecto(resPendientes.data.datos)
        setTotalesPorEstado(resTotales.data.datos)
      })
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return (
      <div className="min-h-screen bg-cotecmar-surface flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Spinner />
            <div>
              <p className="text-sm font-semibold text-slate-900">Cargando reportes</p>
              <p className="text-xs text-slate-500">Consultando totales y pendientes…</p>
            </div>
          </div>
        </div>
      </div>
    )
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
              <p className="text-xs text-white/70">Reportes operacionales</p>
            </div>
          </div>

          <Boton
            variant="ghost"
            onClick={() => navegar('/dashboard')}
            className="!text-white hover:!bg-white/10"
          >
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M14 7 9 12l5 5 1.4-1.4L11.8 12l3.6-3.6L14 7Z" />
              </svg>
              Volver
            </span>
          </Boton>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">

        {/* Gráfico 1: Piezas pendientes por proyecto */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="border-l-4 border-cotecmar-steel pl-3">
              <h2 className="text-sm font-semibold text-slate-900">Piezas pendientes por proyecto</h2>
              <p className="mt-1 text-xs text-slate-500">Consolidado de pendientes por cada proyecto activo.</p>
            </div>
          </div>

          {pendientesPorProyecto.length === 0 ? (
            <EmptyState
              title="No hay piezas pendientes"
              subtitle="Cuando existan piezas con estado pendiente, aparecerán aquí."
            />
          ) : (
            <>
              <div className="mt-5">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={pendientesPorProyecto} margin={{ top: 10, right: 18, left: 0, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="proyecto"
                      angle={-30}
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }}
                      content={(props) => (
                        <TooltipCard
                          {...props}
                          formatoLabel={(lbl) => `Proyecto: ${lbl}`}
                          filas={[
                            { label: 'Pendientes', color: COLORES.pendiente, value: (d) => d?.total_pendientes ?? 0 },
                          ]}
                        />
                      )}
                    />
                    <Bar dataKey="total_pendientes" name="Pendientes" fill={COLORES.pendiente} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
                <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700">Detalle</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="border-b border-slate-200 bg-white">
                      <tr className="text-left text-xs font-semibold text-slate-600">
                        <th className="px-4 py-3">Proyecto</th>
                        <th className="px-4 py-3">Pendientes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {pendientesPorProyecto.map((fila, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 text-slate-900">{fila.proyecto}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full" style={{ background: COLORES.pendiente }} />
                              <span className="font-mono font-semibold text-slate-900">{fila.total_pendientes}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Gráfico 2: Totales por estado */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="border-l-4 border-cotecmar-success pl-3">
              <h2 className="text-sm font-semibold text-slate-900">Total de registros por estado</h2>
              <p className="mt-1 text-xs text-slate-500">Distribución general de fabricación vs pendientes.</p>
            </div>
          </div>

          {totalesPorEstado.length === 0 ? (
            <EmptyState
              title="Sin datos de fabricación"
              subtitle="Registra fabricación desde el formulario para ver esta distribución."
            />
          ) : (
            <>
              <div className="mt-5">
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={totalesPorEstado} margin={{ top: 10, right: 18, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
                      content={(props) => (
                        <TooltipCard
                          {...props}
                          formatoLabel={(lbl) => `Estado: ${lbl}`}
                          filas={[
                            {
                              label: 'Total',
                              color: (props?.payload?.[0]?.payload?.estado && COLORES[props.payload[0].payload.estado]) || '#94a3b8',
                              value: (d) => `${d?.total ?? 0} (${d?.porcentaje ?? 0}%)`,
                            },
                          ]}
                        />
                      )}
                    />
                    <Legend />
                    <Bar dataKey="total" name="Registros" radius={[6, 6, 0, 0]}>
                      {totalesPorEstado.map((fila, indice) => (
                        <Cell key={indice} fill={COLORES[fila.estado] || '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
                <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700">Detalle</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="border-b border-slate-200 bg-white">
                      <tr className="text-left text-xs font-semibold text-slate-600">
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {totalesPorEstado.map((fila, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full" style={{ background: COLORES[fila.estado] || '#6366f1' }} />
                              <EstadoLabel estado={fila.estado} />
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-900">{fila.total}</td>
                          <td className="px-4 py-3 font-mono text-slate-700">{fila.porcentaje}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}