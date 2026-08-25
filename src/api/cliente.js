/** Cliente HTTP: consultas y envio de datos a la API REST. */
import { URL_BASE, TIEMPO_LIMITE } from './config';

function armarUrl(ruta, parametros = {}) {
  const consulta = Object.entries(parametros)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return `${URL_BASE}${ruta}${consulta ? `?${consulta}` : ''}`;
}

async function peticion(url, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE);

  try {
    const respuesta = await fetch(url, {
      ...opciones,
      signal: controlador.signal,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...opciones.headers },
    });

    const texto = await respuesta.text();
    let datos = null;
    try { datos = texto ? JSON.parse(texto) : null; } catch { datos = null; }

    if (!respuesta.ok) {
      const error = new Error(mensajeDeError(respuesta.status));
      error.estado = respuesta.status;
      error.datos = datos;
      throw error;
    }
    return datos;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('El servidor tardo demasiado en responder.');
    if (error.message === 'Network request failed') throw new Error('Sin conexion. Revisa tu acceso a internet.');
    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}

function mensajeDeError(estado) {
  if (estado === 400) return 'Los datos enviados no son validos.';
  if (estado === 404) return 'El servicio consultado no existe.';
  if (estado >= 500) return 'El servidor presento un error. Intenta mas tarde.';
  return `No se pudo completar la operacion (codigo ${estado}).`;
}

/** Consulta un listado. Devuelve { registros, total }. */
export async function consultarApi(ruta, parametros = {}) {
  const datos = await peticion(armarUrl(ruta, parametros));
  return {
    registros: Array.isArray(datos) ? datos : (datos?.results ?? []),
    total: datos?.count ?? (Array.isArray(datos) ? datos.length : 0),
  };
}

/** Registra informacion en el servidor. */
export async function enviarApi(ruta, cuerpo) {
  return peticion(armarUrl(ruta), { method: 'POST', body: JSON.stringify(cuerpo) });
}
