import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api, SESION_VENCIDA } from "../services/api.js";
import { aPedido, aUsuario, deUsuario } from "../services/adaptadores.js";
import { guardarSesion, leerSesion, limpiarSesion } from "../services/sesion.js";
import {
  agregarAlCarrito,
  cambiarCantidad,
  quitarDelCarrito,
} from "../utils/negocio.js";
import { validarCheckout } from "../utils/validaciones.js";

export const SkyOpsContext = createContext(null);
const CLAVE_CARRITO = "skyops_carrito";

// El manifiesto (carrito) vive en el navegador; todo lo demás viene del backend
function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

// Datos públicos del catálogo
async function pedirPublico() {
  const [productos, categorias, flota] = await Promise.all([
    api.get("/productos"),
    api.get("/categorias"),
    api.get("/flota"),
  ]);
  return { productos, categorias, flota };
}

// Datos que dependen del rol: el backend entrega todas las boletas al admin y al vendedor,
// y solo las propias al cliente. Los usuarios solo los ve el admin.
async function pedirPrivado(rol) {
  const [boletas, usuarios] = await Promise.all([
    api.get("/boletas"),
    rol === "admin" ? api.get("/usuarios") : [],
  ]);
  return { pedidos: boletas.map(aPedido), usuarios: usuarios.map(aUsuario) };
}

export function SkyOpsProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [flota, setFlota] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carrito, setCarrito] = useState(leerCarrito);
  // La sesión guardada se usa de inmediato para no perderla al recargar;
  // más abajo se valida contra el backend
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState("");
  const [errorAlmacenamiento, setErrorAlmacenamiento] = useState("");

  const obtenerPedido = useCallback(async (id) => aPedido(await api.get(`/boletas/${id}`)), []);

  async function recargarProductos() {
    setProductos(await api.get("/productos"));
  }

  async function recargarCategorias() {
    setCategorias(await api.get("/categorias"));
  }

  async function recargarPrivado(rol) {
    try {
      const privados = await pedirPrivado(rol);
      setPedidos(privados.pedidos);
      setUsuarios(privados.usuarios);
    } catch {
      // Si la sesión venció, api.js la cierra y avisa con el evento SESION_VENCIDA
    }
  }

  const idUsuario = usuario?.id ?? null;
  const rolUsuario = usuario?.rol ?? null;

  // Al abrir la app se cargan los datos públicos: los puede ver cualquiera, con o sin sesión
  useEffect(() => {
    pedirPublico()
      .then((publicos) => {
        setProductos(publicos.productos);
        setCategorias(publicos.categorias);
        setFlota(publicos.flota);
        setErrorServidor("");
      })
      .catch((error) => setErrorServidor(error.message))
      .finally(() => setCargando(false));
  }, []);

  // Con sesión se cargan además los datos del rol
  useEffect(() => {
    if (!idUsuario) return;

    pedirPrivado(rolUsuario)
      .then((privados) => {
        setPedidos(privados.pedidos);
        setUsuarios(privados.usuarios);
      })
      .catch(() => {
        // Si la sesión venció, api.js la cierra y avisa con el evento SESION_VENCIDA
      });
  }, [idUsuario, rolUsuario]);

  // Al abrir o recargar la app se confirma con el backend que la sesión guardada sigue siendo válida
  useEffect(() => {
    if (!leerSesion()) return;

    api
      .get("/usuarios/me")
      .then((datos) => {
        const actual = leerSesion();
        if (!actual) return;
        const verificado = aUsuario(datos);
        guardarSesion({ ...actual, usuario: verificado });
        setUsuario(verificado);
      })
      .catch(() => {
        // 401: api.js ya cerró la sesión. Sin conexión: se mantiene la sesión guardada.
      });
  }, []);

  // Cuando no se pudo renovar el token, la sesión se cierra en toda la app
  useEffect(() => {
    const cerrar = () => setUsuario(null);
    window.addEventListener(SESION_VENCIDA, cerrar);
    return () => window.removeEventListener(SESION_VENCIDA, cerrar);
  }, []);

  // Se descartan del manifiesto los productos que ya no existen en el catálogo
  const carritoValido = useMemo(
    () =>
      cargando
        ? []
        : carrito.filter((item) => productos.some((p) => p.id === item.productoId)),
    [cargando, carrito, productos]
  );

  const datos = useMemo(
    () => ({
      productos,
      categorias,
      flota,
      carrito: carritoValido,
      pedidos: usuario ? pedidos : [],
      usuarios: usuario ? usuarios : [],
    }),
    [productos, categorias, flota, carritoValido, pedidos, usuarios, usuario]
  );

  function actualizarCarrito(nuevoCarrito) {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(nuevoCarrito));
      setErrorAlmacenamiento("");
    } catch {
      setErrorAlmacenamiento("No se pudo guardar el manifiesto en el navegador.");
    }

    setCarrito(nuevoCarrito);
  }

  // ---------- Sesión ----------

  async function iniciarSesion(correo, clave) {
    const respuesta = await api.post("/auth/login", { correo, clave });
    const sesion = aUsuario(respuesta.usuario);

    guardarSesion({
      accessToken: respuesta.accessToken,
      refreshToken: respuesta.refreshToken,
      usuario: sesion,
    });
    setUsuario(sesion);
  }

  function cerrarSesion() {
    limpiarSesion();
    setUsuario(null);
    setPedidos([]);
    setUsuarios([]);
  }

  async function registrarUsuario(formulario) {
    await api.post("/auth/registro", formulario);
  }

  // ---------- Manifiesto (carrito en el navegador) ----------

  function agregarProducto(productoId) {
    actualizarCarrito(agregarAlCarrito(productos, carritoValido, productoId));
  }

  function actualizarCantidad(productoId, cantidad) {
    actualizarCarrito(cambiarCantidad(productos, carritoValido, productoId, cantidad));
  }

  function eliminarDelCarrito(productoId) {
    actualizarCarrito(quitarDelCarrito(carritoValido, productoId));
  }

  // ---------- Compra y boletas ----------

  async function confirmarCompra(entrega, aprobada) {
    if (Object.keys(validarCheckout(entrega)).length > 0) {
      throw new Error("Revisa los datos de entrega.");
    }

    // El backend recalcula precios y total: solo se envían ids y cantidades
    const boleta = await api.post("/boletas", {
      entrega: {
        ...entrega,
        matricula: entrega.matricula.trim().toUpperCase(),
        licencia: entrega.licencia.trim().toUpperCase(),
        ingeniero: entrega.ingeniero.trim(),
        correo: entrega.correo.trim(),
        direccion: entrega.direccion.trim(),
      },
      detalles: carritoValido.map(({ productoId, cantidad }) => ({ productoId, cantidad })),
      aprobada,
    });

    if (aprobada) actualizarCarrito([]);
    await Promise.all([recargarProductos(), recargarPrivado(rolUsuario)]);

    return aPedido(boleta);
  }


  async function resolverPedido(pedidoId) {
    await api.put(`/boletas/${pedidoId}/resolver`);
    await recargarPrivado(rolUsuario);
  }

  // ---------- Administración ----------

  async function guardarProducto(producto) {
    if (producto.id === null) {
      await api.post("/productos", producto);
    } else {
      await api.put(`/productos/${producto.id}`, producto);
    }

    await recargarProductos();
  }

  async function borrarProducto(productoId) {
    await api.delete(`/productos/${productoId}`);
    await recargarProductos();
  }

  async function guardarCategoria(categoria) {
    const cuerpo = { nombre: categoria.nombre };

    if (categoria.id === null) {
      await api.post("/categorias", cuerpo);
    } else {
      await api.put(`/categorias/${categoria.id}`, cuerpo);
    }

    // Renombrar una categoría cambia el nombre que muestran los productos
    await Promise.all([recargarCategorias(), recargarProductos()]);
  }

  async function borrarCategoria(id) {
    await api.delete(`/categorias/${id}`);
    await recargarCategorias();
  }

  async function guardarUsuario(formulario) {
    const cuerpo = deUsuario(formulario);

    if (formulario.id === null) {
      await api.post("/usuarios", cuerpo);
    } else {
      await api.put(`/usuarios/${formulario.id}`, cuerpo);
    }

    await recargarPrivado(rolUsuario);
  }

  async function borrarUsuario(id) {
    await api.delete(`/usuarios/${id}`);
    await recargarPrivado(rolUsuario);
  }

  async function guardarContacto(contacto) {
    await api.post("/contactos", contacto);
  }

  return (
    <SkyOpsContext.Provider
      value={{
        datos,
        cargando,
        errorServidor,
        errorAlmacenamiento,
        usuario,
        iniciarSesion,
        cerrarSesion,
        registrarUsuario,
        agregarProducto,
        actualizarCantidad,
        eliminarDelCarrito,
        confirmarCompra,
        obtenerPedido,
        resolverPedido,
        guardarProducto,
        borrarProducto,
        guardarCategoria,
        borrarCategoria,
        guardarUsuario,
        borrarUsuario,
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
