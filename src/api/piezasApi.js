import { instanciaPiezas } from './axios'

export const obtenerProyectos = (parametros = {}) =>
  instanciaPiezas.get('/proyectos', { params: parametros })

export const crearProyecto = (datos) =>
  instanciaPiezas.post('/proyectos', datos)

export const actualizarProyecto = (id, datos) =>
  instanciaPiezas.put(`/proyectos/${id}`, datos)

export const eliminarProyecto = (id) =>
  instanciaPiezas.delete(`/proyectos/${id}`)

export const obtenerBloques = (proyectoId, parametros = {}) =>
  instanciaPiezas.get(`/proyectos/${proyectoId}/bloques`, { params: parametros })

export const crearBloque = (proyectoId, datos) =>
  instanciaPiezas.post(`/proyectos/${proyectoId}/bloques`, datos)

export const actualizarBloque = (proyectoId, bloqueId, datos) =>
  instanciaPiezas.put(`/proyectos/${proyectoId}/bloques/${bloqueId}`, datos)

export const eliminarBloque = (proyectoId, bloqueId) =>
  instanciaPiezas.delete(`/proyectos/${proyectoId}/bloques/${bloqueId}`)

export const obtenerPiezas = (bloqueId, parametros = {}) =>
  instanciaPiezas.get(`/bloques/${bloqueId}/piezas`, { params: parametros })

export const crearPieza = (bloqueId, datos) =>
  instanciaPiezas.post(`/bloques/${bloqueId}/piezas`, datos)

export const actualizarPieza = (bloqueId, piezaId, datos) =>
  instanciaPiezas.put(`/bloques/${bloqueId}/piezas/${piezaId}`, datos)

export const eliminarPieza = (bloqueId, piezaId) =>
  instanciaPiezas.delete(`/bloques/${bloqueId}/piezas/${piezaId}`)

export const obtenerRegistros = (piezaId, parametros = {}) =>
  instanciaPiezas.get(`/piezas/${piezaId}/registros`, { params: parametros })

export const crearRegistro = (piezaId, datos) =>
  instanciaPiezas.post(`/piezas/${piezaId}/registros`, datos)

export const actualizarRegistro = (piezaId, registroId, datos) =>
  instanciaPiezas.put(`/piezas/${piezaId}/registros/${registroId}`, datos)

export const obtenerPiezasPendientes = () =>
  instanciaPiezas.get('/reportes/piezas-pendientes')

export const obtenerTotalesPorEstado = () =>
  instanciaPiezas.get('/reportes/totales-por-estado')