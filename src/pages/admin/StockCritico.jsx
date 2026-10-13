import { Alert, Badge, Table } from "react-bootstrap";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";

const LIMITE = 2;

export default function StockCritico() {
  const { datos } = useSkyOps();

  const criticos = datos.productos
    .filter((producto) => producto.stock <= LIMITE)
    .sort((a, b) => a.stock - b.stock);

  return (
    <section>
      <h1>Stock crítico</h1>
      <p>Componentes con {LIMITE} unidades o menos en bodega.</p>

      {criticos.length === 0 ? (
        <Alert variant="success">
          No hay componentes en nivel crítico.
        </Alert>
      ) : (
        <Table responsive striped>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>P/N</th>
              <th>Ubicación</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {criticos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.pn}</td>
                <td>{producto.ubicacion}</td>
                <td>
                  <Badge bg={producto.stock === 0 ? "danger" : "warning"}>
                    {producto.stock}
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
