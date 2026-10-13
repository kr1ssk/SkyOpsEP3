import { useState } from "react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";

import { useSkyOps } from "../../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../../utils/negocio.js";

const VACIO = {
  id: null,
  nombre: "",
  pn: "",
  categoria: "",
  descripcion: "",
  ubicacion: "",
  stock: 0,
  precio: 0,
  descuento: 0,
  imagen: "",
};

export default function Productos() {
  const { datos, guardarProducto, borrarProducto } = useSkyOps();

  const [formulario, setFormulario] = useState(VACIO);
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState("");

  function abrirNuevo() {
    setFormulario(VACIO);
    setError("");
    setAbierto(true);
  }

  function abrirEdicion(producto) {
    setFormulario(producto);
    setError("");
    setAbierto(true);
  }

  function cambiar(evento) {
    const { name, value, type } = evento.target;
    // Los campos numéricos llegan como texto desde el input
    setFormulario({
      ...formulario,
      [name]: type === "number" ? Number(value) : value,
    });
  }

  function enviar(evento) {
    evento.preventDefault();

    try {
      guardarProducto(formulario);
      setAbierto(false);
    } catch (problema) {
      setError(problema.message);
    }
  }

  function eliminar(id) {
    try {
      borrarProducto(id);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Productos</h1>
        <Button onClick={abrirNuevo}>Nuevo producto</Button>
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
            <th>P/N</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.pn}</td>
              <td>{producto.categoria}</td>
              <td>{producto.stock}</td>
              <td>{formatoPrecio(producto.precio)}</td>
              <td className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={() => abrirEdicion(producto)}>
                  Editar
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => eliminar(producto.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={abierto} onHide={() => setAbierto(false)}>
        <Form onSubmit={enviar} noValidate>
          <Modal.Header closeButton>
            <Modal.Title>
              {formulario.id === null ? "Nuevo producto" : "Editar producto"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-2" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={formulario.nombre} onChange={cambiar} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="pn">
              <Form.Label>Número de parte</Form.Label>
              <Form.Control name="pn" value={formulario.pn} onChange={cambiar} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="categoria" value={formulario.categoria} onChange={cambiar}>
                <option value="">Selecciona una categoría</option>
                {datos.categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="descripcion"
                value={formulario.descripcion}
                onChange={cambiar}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="ubicacion">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control name="ubicacion" value={formulario.ubicacion} onChange={cambiar} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={formulario.stock} onChange={cambiar} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="precio">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="precio" value={formulario.precio} onChange={cambiar} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="descuento">
              <Form.Label>Descuento (%)</Form.Label>
              <Form.Control type="number" name="descuento" value={formulario.descuento} onChange={cambiar} />
            </Form.Group>

            <Form.Group controlId="imagen">
              <Form.Label>Imagen</Form.Label>
              <Form.Control name="imagen" value={formulario.imagen} onChange={cambiar} />
              <Form.Text>Nombre del archivo, por ejemplo bomba.svg</Form.Text>
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
