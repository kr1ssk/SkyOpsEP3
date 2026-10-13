import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Inicio from "./pages/Inicio.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Categorias from "./pages/Categorias.jsx";
import Detalle from "./pages/Detalle.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import Manifiesto from "./pages/Manifiesto.jsx";
import Checkout from "./pages/Checkout.jsx";

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
        <Route path="*" element={<h1>404 · Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}