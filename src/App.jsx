import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />

        <Route path="catalogo" element={<Catalogo />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="manifiesto" element={<Manifiesto />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="detalle/:id" element={<Detalle />} />
        <Route path="flota" element={<Flota />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="perfil" element={<Perfil />} />
        {/* Rutas anidadas: LayoutAdmin dibuja las pestañas y
            las hijas se insertan en su propio <Outlet /> */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="stock" element={<StockCritico />} />
          <Route path="ordenes" element={<Ordenes />} />
        </Route>
        <Route path="resultado/:id" element={<Resultado />} />
        <Route path="*" element={<h1>404 · Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}