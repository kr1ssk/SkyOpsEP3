import { Card, Col, Row, Table } from "react-bootstrap";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../../utils/negocio.js";
import { resumirPedidos } from "../../utils/reportes.js";

export default function Reportes() {
  const { datos } = useSkyOps();

  // La función de utils ya calcula el resumen: no se duplica la lógica
  const resumen = resumirPedidos(datos.pedidos);

  const promedio =
    resumen.aprobados > 0 ? resumen.ingresos / resumen.aprobados : 0;

  // Ranking de componentes: se recorre cada línea de los pedidos aprobados
  const porComponente = {};

  datos.pedidos
    .filter((p) => p.estado !== "Rechazado")
    .forEach((pedido) => {
      pedido.lineas.forEach((linea) => {
        porComponente[linea.nombre] =
          (porComponente[linea.nombre] || 0) + linea.cantidad;
      });
    });

  const ranking = Object.entries(porComponente).sort((a, b) => b[1] - a[1]);

  const tarjetas = [
    { titulo: "Despachos autorizados", valor: resumen.aprobados },
    { titulo: "Despachos rechazados", valor: resumen.rechazados },
    { titulo: "Unidades despachadas", valor: resumen.unidades },
    { titulo: "Monto promedio", valor: formatoPrecio(Math.round(promedio)) },
  ];

  return (
    <section>
      <h1>Reportes</h1>
      <p>Resumen de la operación de despacho.</p>

      <Row className="g-3 mb-4">
        {tarjetas.map((tarjeta) => (
          <Col xs={12} sm={6} lg={3} key={tarjeta.titulo}>
            <Card body className="h-100">
              <h2 className="h6">{tarjeta.titulo}</h2>
              <p className="numero">{tarjeta.valor}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Card body className="mb-4">
        <h2 className="h6">Total despachado</h2>
        <p className="numero">{formatoPrecio(resumen.ingresos)}</p>
      </Card>

      <h2 className="h4">Componentes más despachados</h2>

      {ranking.length === 0 ? (
        <p>Todavía no hay despachos autorizados.</p>
      ) : (
        <Table responsive striped>
          <thead>
            <tr>
              <th>Componente</th>
              <th>Unidades despachadas</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map(([nombre, cantidad]) => (
              <tr key={nombre}>
                <td>{nombre}</td>
                <td>{cantidad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  );
}
