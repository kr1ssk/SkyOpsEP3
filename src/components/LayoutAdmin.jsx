import { Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function LayoutAdmin() {
  const { usuario } = useSkyOps();
  const admin = usuario?.rol === "admin";

  // El vendedor solo ve Productos y Órdenes; el resto de pestañas es del administrador
  return <>
    <Nav variant="pills" className="gap-2 mb-4 flex-wrap" aria-label="Administración">
      {admin && <Nav.Link as={NavLink} to="/admin" end>Dashboard</Nav.Link>}
      <Nav.Link as={NavLink} to="/admin/productos">Productos</Nav.Link>
      <Nav.Link as={NavLink} to="/admin/ordenes">Órdenes</Nav.Link>
      {admin && <Nav.Link as={NavLink} to="/admin/stock">Stock crítico</Nav.Link>}
      {admin && <Nav.Link as={NavLink} to="/admin/categorias">Categorías</Nav.Link>}
      {admin && <Nav.Link as={NavLink} to="/admin/usuarios">Usuarios</Nav.Link>}
      {admin && <Nav.Link as={NavLink} to="/admin/reportes">Reportes</Nav.Link>}
      <Nav.Link as={NavLink} to="/perfil">Perfil</Nav.Link>
    </Nav>
    <Outlet />
  </>;
}
