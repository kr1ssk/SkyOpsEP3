import { useState } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";

export default function Categorias() {
  const { datos, guardarCategoria, borrarCategoria } = useSkyOps();

  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null); // null = creando
  const [error, setError] = useState("");

  function enviar(evento) {
    evento.preventDefault();

    try {
      guardarCategoria({ id: editando, nombre });
      setNombre("");
      setEditando(null);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  function editar(categoria) {
    setEditando(categoria.id);
    setNombre(categoria.nombre);
    setError("");
  }

  function eliminar(id) {
    try {
      borrarCategoria(id);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <section>
      <h1>Categorías ATA</h1>
      <p>Clasificación de componentes según el estándar ATA 100.</p>

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      <Form onSubmit={enviar} className="d-flex gap-2 mb-3 flex-wrap">
        <Form.Control
          aria-label="Nombre de la categoría"
          placeholder="ATA 27"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ maxWidth: "14rem" }}
        />
        <Button type="submit">
          {editando === null ? "Agregar" : "Guardar cambios"}
        </Button>

        {/* El botón de cancelar solo aparece mientras se edita */}
        {editando !== null && (
          <Button
            variant="secondary"
            onClick={() => {
              setEditando(null);
              setNombre("");
            }}
          >
            Cancelar
          </Button>
        )}
      </Form>

      <Table responsive striped>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Componentes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.categorias.map((categoria) => {
            const usada = datos.productos.filter(
              (p) => p.categoria === categoria.nombre
            ).length;

            return (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{usada}</td>
                <td className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => editar(categoria)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => eliminar(categoria.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </section>
  );
}
