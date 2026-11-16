import { Navigate, Routes, Route } from "react-router-dom";

import Acceso from "./components/Acceso.jsx";
import Layout from "./components/Layout.jsx";
import { useSkyOps } from "./context/SkyOpsContext.jsx";
import Inicio from "./pages/Inicio.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Categorias from "./pages/Categorias.jsx";
import Detalle from "./pages/Detalle.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import Manifiesto from "./pages/Manifiesto.jsx";
import Checkout from "./pages/Checkout.jsx";
import Flota from "./pages/Flota.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Blog from "./pages/Blog.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Perfil from "./pages/Perfil.jsx";
import LayoutAdmin from "./components/LayoutAdmin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Productos from "./pages/admin/Productos.jsx";
import StockCritico from "./pages/admin/StockCritico.jsx";
import Ordenes from "./pages/admin/Ordenes.jsx";
import Resultado from "./pages/Resultado.jsx";
import CategoriasAdmin from "./pages/admin/Categorias.jsx";
import Usuarios from "./pages/admin/Usuarios.jsx";
import Reportes from "./pages/admin/Reportes.jsx";
import DetalleBlog from "./pages/DetalleBlog.jsx";

// El panel de administración abre en el Dashboard solo para el administrador;
// el vendedor entra directo a Productos
function InicioAdmin() {
  const { usuario } = useSkyOps();
  return usuario.rol === "admin" ? <Dashboard /> : <Navigate to="/admin/productos" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />

        <Route path="catalogo" element={<Catalogo />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="manifiesto" element={<Manifiesto />} />
        {/* Comprar exige sesión de cliente o administrador */}
        <Route element={<Acceso roles={["cliente", "admin"]} />}>
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route path="detalle/:id" element={<Detalle />} />
        <Route path="flota" element={<Flota />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route element={<Acceso />}>
          <Route path="perfil" element={<Perfil />} />
          <Route path="resultado/:id" element={<Resultado />} />
        </Route>
        {/* Rutas anidadas: LayoutAdmin dibuja las pestañas y
            las hijas se insertan en su propio <Outlet />.
            Admin y vendedor entran al panel; solo el admin ve el resto de las pestañas. */}
        <Route element={<Acceso roles={["admin", "vendedor"]} />}>
          <Route path="admin" element={<LayoutAdmin />}>
            <Route index element={<InicioAdmin />} />
            <Route path="productos" element={<Productos />} />
            <Route path="ordenes" element={<Ordenes />} />
            <Route element={<Acceso roles={["admin"]} />}>
              <Route path="stock" element={<StockCritico />} />
              <Route path="categorias" element={<CategoriasAdmin />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="reportes" element={<Reportes />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<h1>404 · Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}