import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { publicaciones } from "../data/publicaciones.js";

export default function Blog() {
  return (
    <section>
      <h1>Boletines técnicos</h1>
      <p>Comunicados sobre componentes, certificaciones y operación.</p>

      <Row className="g-3 mt-3">
        {publicaciones.map((publicacion) => (
          <Col xs={12} md={6} key={publicacion.id}>
            <Card body className="h-100">
              <h2 className="h5">{publicacion.titulo}</h2>
              {publicacion.fecha && (
                <p className="text-secondary">{publicacion.fecha}</p>
              )}
              <p>{publicacion.resumen}</p>
              <Link to={`/blog/${publicacion.id}`}>Leer más</Link>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
