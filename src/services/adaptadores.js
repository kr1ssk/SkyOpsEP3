// Convierte lo que entrega el backend al formato que ya usan las pantallas, y al revés.
// Así los cambios de nombres quedan en un solo archivo.

const ESTADOS = { PENDIENTE: "Pendiente", RECHAZADO: "Rechazado", RESUELTO: "Resuelto" };

// El backend usa roles en mayúscula (ADMIN); la interfaz los compara en minúscula (admin)
export function aUsuario(usuario) {
  return { ...usuario, rol: usuario.rol.toLowerCase() };
}

export function deUsuario(usuario) {
  return { ...usuario, rol: usuario.rol.toUpperCase() };
}

// El backend llama "boleta" (con "detalles") a lo que la interfaz llama "pedido" (con "lineas")
export function aPedido(boleta) {
  return {
    id: boleta.id,
    fecha: boleta.fecha,
    total: boleta.total,
    entrega: boleta.entrega,
    estado: ESTADOS[boleta.estado],
    lineas: boleta.detalles.map((detalle) => ({ ...detalle, id: detalle.productoId })),
  };
}
