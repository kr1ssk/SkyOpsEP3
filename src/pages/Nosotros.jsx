import { Card, Col, Row } from "react-bootstrap";

const PILARES = [
  {
    titulo: "Disponibilidad",
    detalle: "Stock certificado en bodegas de Santiago y Antofagasta, con despacho coordinado a aeropuerto.",
  },
  {
    titulo: "Trazabilidad",
    detalle: "Cada componente mantiene su número de parte, ubicación de bodega y estado de certificación.",
  },
  {
    titulo: "Tiempo de respuesta",
    detalle: "Las solicitudes de aeronaves en condición AOG se priorizan sobre el resto del flujo.",
  },
];

export default function Nosotros() {
  return (
    <section>
      <h1>Nosotros</h1>
      <p>
        SkyOps es una plataforma de abastecimiento de repuestos aeronáuticos
        orientada a reducir el tiempo que una aeronave permanece fuera de servicio.
      </p>

      <Row className="g-3 mt-3">
        {PILARES.map((pilar) => (
          <Col xs={12} md={4} key={pilar.titulo}>
            <Card body className="h-100">
              <h2 className="h5">{pilar.titulo}</h2>
              <p className="mb-0">{pilar.detalle}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
