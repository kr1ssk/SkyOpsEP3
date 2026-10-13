import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { validarContacto } from "../utils/validaciones.js";

const VACIO = { nombre: "", correo: "", mensaje: "" };

export default function Contacto() {
  const { guardarContacto } = useSkyOps();

  // Un state para los campos, otro para los errores, otro para el aviso de éxito
  const [formulario, setFormulario] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault(); // evita que el navegador recargue la página

    const encontrados = validarContacto(formulario);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      setEnviado(false);
      return;
    }

    guardarContacto(formulario);
    setFormulario(VACIO);
    setEnviado(true);
  }

  return (
    <section>
      <h1>Contacto</h1>
      <p>Escríbenos y responderemos dentro del siguiente turno operativo.</p>

      {enviado && (
        <Alert variant="success" role="alert">
          Mensaje enviado. Gracias por contactarte con SkyOps.
        </Alert>
      )}

      <Form onSubmit={enviar} noValidate>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={formulario.nombre}
            onChange={cambiar}
            isInvalid={Boolean(errores.nombre)}
          />
          <Form.Control.Feedback type="invalid">
            {errores.nombre}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="correo">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            name="correo"
            type="email"
            value={formulario.correo}
            onChange={cambiar}
            isInvalid={Boolean(errores.correo)}
          />
          <Form.Control.Feedback type="invalid">
            {errores.correo}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="mensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="mensaje"
            value={formulario.mensaje}
            onChange={cambiar}
            isInvalid={Boolean(errores.mensaje)}
          />
          <Form.Control.Feedback type="invalid">
            {errores.mensaje}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit">Enviar mensaje</Button>
      </Form>
    </section>
  );
}
