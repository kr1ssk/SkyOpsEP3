import { Badge, Button, Table } from "react-bootstrap";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../../utils/negocio.js";

export default function Ordenes() {
  const { datos, resolverPedido } = useSkyOps();

  return (
    <section>
      <h1>Órdenes de despacho</h1>

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
              <th>Acción</th>
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
                <td>
                  {/* El botón solo aparece si la orden sigue pendiente */}
                  {pedido.estado === "Pendiente" && (
                    <Button size="sm" onClick={() => resolverPedido(pedido.id)}>
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
