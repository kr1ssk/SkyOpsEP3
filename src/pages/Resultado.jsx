import { Alert, Button, Card, Table } from "react-bootstrap";
import { Link, Navigate, useParams } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../utils/negocio.js";

export default function Resultado() {
  const { id } = useParams(); // el folio viene de la URL
  const { datos } = useSkyOps();

  const pedido = datos.pedidos.find((p) => p.id === id);

  // Si el folio no existe, se vuelve al inicio
  if (!pedido) {
    return <Navigate to="/" replace />;
  }

  const rechazado = pedido.estado === "Rechazado";

  return (
    <section>
      {/* Renderizado condicional: el mismo componente muestra
          dos desenlaces distintos según el estado del pedido */}
      {rechazado ? (
        <Alert variant="danger">
          <h1 className="h4">No se pudo autorizar el despacho</h1>
          <p className="mb-0">
            Folio {pedido.id.slice(0, 8).toUpperCase()}. El manifiesto
            se conserva para que puedas reintentar.
          </p>
        </Alert>
      ) : (
        <Alert variant="success">
          <h1 className="h4">Despacho autorizado</h1>
          <p className="mb-0">
            Folio {pedido.id.slice(0, 8).toUpperCase()}. El equipo de
            bodega preparará los componentes.
          </p>
        </Alert>
      )}

      <Card body className="mb-3">
        <h2 className="h5">Datos de la entrega</h2>
        <p className="mb-1">Aeronave: {pedido.entrega.matricula}</p>
        <p className="mb-1">Ingeniero: {pedido.entrega.ingeniero}</p>
        <p className="mb-1">Licencia: {pedido.entrega.licencia}</p>
        <p className="mb-1">Destino: {pedido.entrega.destino}</p>
        <p className="mb-1">Modalidad: {pedido.entrega.tipoEntrega}</p>
        <p className="mb-0">Dirección: {pedido.entrega.direccion}</p>
      </Card>

      <Table responsive striped>
        <thead>
          <tr>
            <th>Componente</th>
            <th>P/N</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.lineas.map((linea) => (
            <tr key={linea.id}>
              <td>{linea.nombre}</td>
              <td>{linea.pn}</td>
              <td>{linea.cantidad}</td>
              <td>{formatoPrecio(linea.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={3}>Total</th>
            <th>{formatoPrecio(pedido.total)}</th>
          </tr>
        </tfoot>
      </Table>

      <div className="d-flex gap-2 flex-wrap">
        {rechazado ? (
          <Button as={Link} to="/checkout">
            Reintentar despacho
          </Button>
        ) : (
          <Button as={Link} to="/catalogo">
            Volver al catálogo
          </Button>
        )}

        {/* window.print() abre el diálogo de impresión del navegador,
            que permite guardar el comprobante como PDF */}
        <Button variant="outline-secondary" onClick={() => window.print()}>
          Imprimir comprobante
        </Button>
      </div>
    </section>
  );
}
