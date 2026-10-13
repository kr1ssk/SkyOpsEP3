import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../../utils/negocio.js";

const STOCK_CRITICO = 2;

export default function Dashboard() {
  const { datos } = useSkyOps();

  // Todos son valores derivados: se recalculan en cada render
  const criticos = datos.productos.filter((p) => p.stock <= STOCK_CRITICO);
  const pendientes = datos.pedidos.filter((p) => p.estado === "Pendiente");
  const facturado = datos.pedidos
    .filter((p) => p.estado !== "Rechazado")
    .reduce((total, pedido) => total + pedido.total, 0);

  const tarjetas = [
    { titulo: "Productos", valor: datos.productos.length, enlace: "/admin/productos" },
    { titulo: "Órdenes pendientes", valor: pendientes.length, enlace: "/admin/ordenes" },
    { titulo: "Stock crítico", valor: criticos.length, enlace: "/admin/stock" },
    { titulo: "Usuarios", valor: datos.usuarios.length, enlace: "/admin/usuarios" },
  ];

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Resumen de la operación de abastecimiento.</p>

      <Row className="g-3">
        {tarjetas.map((tarjeta) => (
          <Col xs={12} sm={6} lg={3} key={tarjeta.titulo}>
            <Card body className="h-100">
              <h2 className="h6">{tarjeta.titulo}</h2>
              <p className="numero">{tarjeta.valor}</p>
              <Link to={tarjeta.enlace}>Ver detalle</Link>
            </Card>
          </Col>
        ))}
      </Row>

      <Card body className="mt-3">
        <h2 className="h6">Total despachado</h2>
        <p className="numero">{formatoPrecio(facturado)}</p>
      </Card>
    </section>
  );
}
