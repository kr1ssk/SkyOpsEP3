// La sesión (tokens y usuario) se guarda en localStorage para que sobreviva a recargas de la página.
// Los dos tokens que entrega el backend:
//   accessToken  dura 15 minutos y viaja en cada petición (Authorization: Bearer ...)
//   refreshToken dura 7 días y solo sirve para pedir tokens nuevos
const CLAVE = "skyops_sesion";

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion));
  } catch {
    // Sin almacenamiento disponible la sesión dura solo hasta recargar la página
  }
}

export function limpiarSesion() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar
  }
}
