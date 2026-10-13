import { Button, Card } from "react-bootstrap";
import { Link, Navigate, useParams } from "react-router-dom";

import { publicaciones } from "../data/publicaciones.js";

export default function DetalleBlog() {
  const { id } = useParams();

  // El id de la URL es texto; se compara con String() por si el dato es número
  const publicacion = publicaciones.find((p) => String(p.id) === id);

  if (!publicacion) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <article>
      <Card body>
        <h1>{publicacion.titulo}</h1>
        {publicacion.fecha && (
          <p className="text-secondary">{publicacion.fecha}</p>
        )}
        <p>{publicacion.resumen}</p>
        {publicacion.contenido && <p>{publicacion.contenido}</p>}

        <Button as={Link} to="/blog" variant="outline-primary">
          Volver a boletines
        </Button>
      </Card>
    </article>
  );
}
