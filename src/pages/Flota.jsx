import { Badge, Card, Col, Row, Table } from "react-bootstrap";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Flota() {
  // Los datos vienen del contexto global, no de props
  const { datos } = useSkyOps();

  // Valor derivado: se calcula en cada render, no se guarda en state
  const enTierra = datos.flota.filter((avion) => avion.estado === "AOG");

  return (
    <section>
      <h1>Flota monitoreada</h1>
      <p>
        Aeronaves con seguimiento activo. Las marcadas como AOG
        (Aircraft On Ground) tienen prioridad de despacho.
      </p>

      <Row className="g-3 mb-4">
        <Col xs={12} md={6}>
          <Card body>
            <h2 className="h5">Aeronaves monitoreadas</h2>
            <p className="numero">{datos.flota.length}</p>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card body>
            <h2 className="h5">En condición AOG</h2>
            <p className="numero">{enTierra.length}</p>
          </Card>
        </Col>
      </Row>

      <Table responsive striped>
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Modelo</th>
            <th>Operador</th>
            <th>Ubicación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {/* key: React la usa para identificar cada fila al redibujar */}
          {datos.flota.map((avion) => (
            <tr key={avion.matricula}>
              <td>{avion.matricula}</td>
              <td>{avion.modelo}</td>
              <td>{avion.aerolinea}</td>
              <td>{avion.ubicacion}</td>
              <td>
                {/* Renderizado condicional: el color depende del estado */}
                <Badge bg={avion.estado === "AOG" ? "danger" : "success"}>
                  {avion.estado}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
