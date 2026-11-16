import { guardarSesion, leerSesion, limpiarSesion } from "./sesion.js";

// La URL del backend se fija al compilar: VITE_API_URL=http://<IP>:8080 npm run build
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const BASE = `${API_URL}/api/v1`;

// Evento que se emite cuando la sesión ya no se puede renovar
export const SESION_VENCIDA = "skyops:sesion-vencida";

const MENSAJES_ESTADO = {
  401: "Inicia sesión para continuar.",
  403: "No tienes permiso para realizar esta acción.",
};

export class ApiError extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.estado = estado;
  }
}

// El backend responde los errores como {"mensaje": "...", "errores": {"campo": "mensaje"}}
function mensajeDe(datos, estado) {
  if (!datos?.mensaje) return MENSAJES_ESTADO[estado] ?? `Error del servidor (HTTP ${estado}).`;
  const detalles = datos.errores ? Object.values(datos.errores).join(" ") : "";
  return detalles ? `${datos.mensaje} ${detalles}` : datos.mensaje;
}

async function enviar(metodo, ruta, cuerpo, token) {
  const cabeceras = {};
  if (cuerpo !== undefined) cabeceras["Content-Type"] = "application/json";
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch {
    throw new ApiError(`No se pudo contactar al backend en ${API_URL}`, 0);
  }

  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new ApiError(mensajeDe(datos, respuesta.status), respuesta.status);
  return datos;
}

// Si varias peticiones fallan a la vez por token vencido, se renueva una sola vez
let renovacion = null;

function renovarTokens() {
  const sesion = leerSesion();
  renovacion ??= enviar("POST", "/auth/refresh", { refreshToken: sesion.refreshToken })
    .then((datos) => {
      guardarSesion({ ...sesion, accessToken: datos.accessToken, refreshToken: datos.refreshToken });
      return datos.accessToken;
    })
    .finally(() => {
      renovacion = null;
    });
  return renovacion;
}

async function pedir(metodo, ruta, cuerpo) {
  const sesion = leerSesion();

  try {
    return await enviar(metodo, ruta, cuerpo, sesion?.accessToken);
  } catch (error) {
    const vencido = error.estado === 401 && sesion?.refreshToken && !ruta.startsWith("/auth/");
    if (!vencido) throw error;

    // El token de acceso venció: se renueva y se repite la petición una vez
    try {
      const token = await renovarTokens();
      return await enviar(metodo, ruta, cuerpo, token);
    } catch (segundo) {
      if (segundo.estado === 401) {
        limpiarSesion();
        window.dispatchEvent(new Event(SESION_VENCIDA));
      }
      throw segundo;
    }
  }
}

export const api = {
  get: (ruta) => pedir("GET", ruta),
  post: (ruta, cuerpo) => pedir("POST", ruta, cuerpo),
  put: (ruta, cuerpo) => pedir("PUT", ruta, cuerpo),
  delete: (ruta) => pedir("DELETE", ruta),
};
