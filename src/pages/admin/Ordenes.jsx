import { useState } from "react";
import { Alert, Badge, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../../utils/negocio.js";

export default function Ordenes() {
  const { datos, usuario, resolverPedido } = useSkyOps();
  const admin = usuario?.rol === "admin"; // el vendedor solo consulta
  const [error, setError] = useState("");

  async function resolver(id) {
    try {
      await resolverPedido(id);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <section>
      <h1>Órdenes de despacho</h1>

      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      {datos.pedidos.length === 0 ? (
        <p>No hay órdenes registradas.</p>
      ) : (
        <Table responsive striped>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Matrícula</th>
              <th>Destino</th>
              <th>Piezas</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
                <td>{pedido.entrega.matricula}</td>
                <td>{pedido.entrega.destino}</td>
                <td>{pedido.lineas.length}</td>
                <td>{formatoPrecio(pedido.total)}</td>
                <td>
                  <Badge
                    bg={
                      pedido.estado === "Rechazado"
                        ? "danger"
                        : pedido.estado === "Resuelto"
                          ? "success"
                          : "warning"
                    }
                  >
                    {pedido.estado}
                  </Badge>
                </td>
                <td className="d-flex gap-2">
                  <Button as={Link} size="sm" variant="outline-secondary" to={`/resultado/${pedido.id}`}>
                    Ver detalle
                  </Button>
                  {/* Resolver es del admin y solo aparece si la orden sigue pendiente */}
                  {admin && pedido.estado === "Pendiente" && (
                    <Button size="sm" onClick={() => resolver(pedido.id)}>
                      Marcar resuelta
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  );
}
