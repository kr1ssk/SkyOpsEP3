import { useState } from "react";
import { Alert, Badge, Button, Form, Modal, Table } from "react-bootstrap";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";

const VACIO = { id: null, nombre: "", correo: "", clave: "", rol: "cliente" };

export default function Usuarios() {
  const { datos, guardarUsuario, borrarUsuario } = useSkyOps();

  const [formulario, setFormulario] = useState(VACIO);
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState("");

  function abrirNuevo() {
    setFormulario(VACIO);
    setError("");
    setAbierto(true);
  }

  function abrirEdicion(usuario) {
    // La clave se deja vacía: solo se cambia si se escribe una nueva
    setFormulario({ ...usuario, clave: "" });
    setError("");
    setAbierto(true);
  }

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();

    try {
      guardarUsuario(formulario);
      setAbierto(false);
    } catch (problema) {
      setError(problema.message);
    }
  }

  function eliminar(id) {
    try {
      borrarUsuario(id);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Usuarios</h1>
        <Button onClick={abrirNuevo}>Nuevo usuario</Button>
      </div>

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      <Table responsive striped>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Despachos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.usuarios.map((usuario) => {
            const despachos = datos.pedidos.filter(
              (p) => p.entrega.usuarioId === usuario.id
            ).length;

            return (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>
                  <Badge bg={usuario.rol === "admin" ? "primary" : "secondary"}>
                    {usuario.rol}
                  </Badge>
                </td>
                <td>{despachos}</td>
                <td className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => abrirEdicion(usuario)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => eliminar(usuario.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={abierto} onHide={() => setAbierto(false)}>
        <Form onSubmit={enviar} noValidate>
          <Modal.Header closeButton>
            <Modal.Title>
              {formulario.id === null ? "Nuevo usuario" : "Editar usuario"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-2" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={formulario.nombre} onChange={cambiar} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="correo">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" name="correo" value={formulario.correo} onChange={cambiar} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="clave">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name="clave" value={formulario.clave} onChange={cambiar} />
              <Form.Text>
                {formulario.id === null
                  ? "Al menos 8 caracteres, con letras y números."
                  : "Déjala vacía para mantener la actual."}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" value={formulario.rol} onChange={cambiar}>
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </section>
  );
}
