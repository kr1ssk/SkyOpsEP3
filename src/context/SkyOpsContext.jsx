import {
  createContext,
  useContext,
  useState,
} from "react";

import { crearDatosIniciales } from "../data/semilla.js";
import {
  agregarAlCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  procesarCompra,
} from "../utils/negocio.js";
import { guardarProducto as guardarProductoEnDatos, borrarProducto as borrarProductoEnDatos } from "../data/repositorio.js";
import * as repositorio from "../data/repositorio.js";
import { validarCheckout } from "../utils/validaciones.js";

export const SkyOpsContext = createContext(null);
const CLAVE = "skyops_v3";

function leerDatos() {
  try {
    const guardados = localStorage.getItem(CLAVE);

    if (!guardados) {
      return crearDatosIniciales();
    }

    const datos = JSON.parse(guardados);

    const listas = [
      "productos",
      "flota",
      "carrito",
      "pedidos",
      "contactos",
    ];

    if (!listas.every((lista) => Array.isArray(datos[lista]))) {
      return crearDatosIniciales();
    }

    const iniciales = crearDatosIniciales();
    return { ...datos, usuarios: Array.isArray(datos.usuarios) ? datos.usuarios : iniciales.usuarios,
      categorias: Array.isArray(datos.categorias) ? datos.categorias : [...new Set(datos.productos.map(p => p.categoria))].map(nombre => ({ id: nombre, nombre })),
      sesionId: datos.sesionId || null };
  } catch {
    return crearDatosIniciales();
  }
}

export function SkyOpsProvider({ children }) {
  const [datos, setDatos] = useState(leerDatos);
  const [errorAlmacenamiento, setErrorAlmacenamiento] = useState("");

  function actualizarDatos(nuevosDatos) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(nuevosDatos));
      setErrorAlmacenamiento("");
    } catch {
      setErrorAlmacenamiento(
        "No se pudieron guardar los cambios en el navegador."
      );
    }

    setDatos(nuevosDatos);
  }

  const usuario = datos.usuarios.find(u => u.id === datos.sesionId) || null;

  function exigirAdmin() {
    if (usuario?.rol !== "admin") throw new Error("Se requiere una cuenta administradora.");
  }

  function registrarUsuario(formulario) {
    actualizarDatos(repositorio.guardarUsuario(datos, { ...formulario, id: null, rol: "cliente" }));
  }

  function iniciarSesion(correo, clave) { actualizarDatos(repositorio.iniciarSesion(datos, correo, clave)); }
  function cerrarSesion() { actualizarDatos({ ...datos, sesionId: null }); }
  function guardarUsuario(formulario) { exigirAdmin(); actualizarDatos(repositorio.guardarUsuario(datos, formulario)); }
  function borrarUsuario(id) { exigirAdmin(); actualizarDatos(repositorio.borrarUsuario(datos, id)); }
  function guardarCategoria(formulario) { exigirAdmin(); actualizarDatos(repositorio.guardarCategoria(datos, formulario)); }
  function borrarCategoria(id) { exigirAdmin(); actualizarDatos(repositorio.borrarCategoria(datos, id)); }
  function actualizarPerfil(formulario) {
    if (!usuario) throw new Error("Inicia sesión.");
    actualizarDatos(repositorio.guardarUsuario(datos, { ...usuario, ...formulario, id: usuario.id, rol: usuario.rol }));
  }

  function agregarProducto(productoId) {
    const carrito = agregarAlCarrito(
      datos.productos,
      datos.carrito,
      productoId
    );

    actualizarDatos({ ...datos, carrito });
  }

  function actualizarCantidad(productoId, cantidad) {
    const carrito = cambiarCantidad(
      datos.productos,
      datos.carrito,
      productoId,
      cantidad
    );

    actualizarDatos({ ...datos, carrito });
  }

  function eliminarDelCarrito(productoId) {
    const carrito = quitarDelCarrito(datos.carrito, productoId);

    actualizarDatos({ ...datos, carrito });
  }

  function confirmarCompra(entrega, aprobada) {
    const errores = validarCheckout(entrega);

    if (Object.keys(errores).length > 0) {
      throw new Error("Revisa los datos de entrega.");
    }

    const entregaNormalizada = {
      ...entrega,
      matricula: entrega.matricula.trim().toUpperCase(),
      licencia: entrega.licencia.trim().toUpperCase(),
      ingeniero: entrega.ingeniero.trim(),
      correo: entrega.correo.trim(),
      direccion: entrega.direccion.trim(),
    };

    const resultado = procesarCompra(
      datos,
      { ...entregaNormalizada, usuarioId: usuario?.id || null },
      aprobada
    );

    actualizarDatos(resultado.datos);

    return resultado.pedido;
  }

  function guardarProducto(producto) {
    exigirAdmin();
    actualizarDatos(guardarProductoEnDatos(datos, producto));
  }

  function borrarProducto(productoId) {
    exigirAdmin();
    actualizarDatos(borrarProductoEnDatos(datos, productoId));
  }

  function resolverPedido(pedidoId) {
    exigirAdmin();
    const pedidos = datos.pedidos.map((pedido) =>
      pedido.id === pedidoId && pedido.estado === "Pendiente"
        ? { ...pedido, estado: "Resuelto" }
        : pedido
    );

    actualizarDatos({ ...datos, pedidos });
  }

  function guardarContacto(contacto) {
    const nuevo = {
      ...contacto,
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
    };

    actualizarDatos({
      ...datos,
      contactos: [nuevo, ...datos.contactos],
    });
  }

  return (
    <SkyOpsContext.Provider
      value={{
        datos,
        usuario, registrarUsuario, iniciarSesion, cerrarSesion, actualizarPerfil,
        guardarUsuario, borrarUsuario, guardarCategoria, borrarCategoria,
        errorAlmacenamiento,
        agregarProducto,
        actualizarCantidad,
        eliminarDelCarrito,
        confirmarCompra,
        guardarProducto,
        borrarProducto,
        resolverPedido,
        guardarContacto,
      }}
    >
      {children}
    </SkyOpsContext.Provider>
  );
}

export function useSkyOps() {
  return useContext(SkyOpsContext);
}