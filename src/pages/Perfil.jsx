import { Badge, Button, Card, Table } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../utils/negocio.js";

export default function Perfil() {
  const { usuario, datos, cerrarSesion } = useSkyOps();
  const navegar = useNavigate();

  // Ruta protegida: sin sesión se redirige al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const mios = datos.pedidos.filter(
    (pedido) => pedido.entrega.usuarioId === usuario.id
  );

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <section>
      <h1>Mi perfil</h1>

      <Card body className="mb-4">
        <p className="mb-1">
          <strong>{usuario.nombre}</strong>{" "}
          <Badge bg={usuario.rol === "admin" ? "primary" : "secondary"}>
            {usuario.rol}
          </Badge>
        </p>
        <p className="mb-1">{usuario.correo}</p>
        {usuario.licencia && <p className="mb-1">Licencia: {usuario.licencia}</p>}
        {usuario.direccion && <p className="mb-3">Dirección: {usuario.direccion}</p>}

        <Button variant="outline-danger" onClick={salir}>
          Cerrar sesión
        </Button>
      </Card>

      <h2 className="h4">Historial de despachos</h2>

      {mios.length === 0 ? (
        <p>Todavía no has solicitado repuestos.</p>
      ) : (
        <Table responsive striped>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Matrícula</th>
              <th>Piezas</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {mios.map((pedido) => (
              <tr key={pedido.id}>
                <td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
                <td>{pedido.entrega.matricula}</td>
                <td>{pedido.lineas.length}</td>
                <td>{formatoPrecio(pedido.total)}</td>
                <td>
                  <Badge bg={pedido.estado === "Rechazado" ? "danger" : "success"}>
                    {pedido.estado}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  );
}
