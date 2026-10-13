import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

const VACIO = { nombre: "", correo: "", clave: "", licencia: "", direccion: "" };

export default function Registro() {
  const { registrarUsuario } = useSkyOps();
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState(VACIO);
  const [error, setError] = useState("");

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();

    try {
      registrarUsuario(formulario);
      navegar("/login");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <Card body className="mx-auto" style={{ maxWidth: "32rem" }}>
      <h1 className="h3">Crear cuenta de técnico</h1>

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      <Form onSubmit={enviar} noValidate>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control name="nombre" value={formulario.nombre} onChange={cambiar} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="correo">
          <Form.Label>Correo</Form.Label>
          <Form.Control type="email" name="correo" value={formulario.correo} onChange={cambiar} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="clave">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="clave" value={formulario.clave} onChange={cambiar} />
          <Form.Text>Al menos 8 caracteres, con letras y números.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="licencia">
          <Form.Label>Licencia aeronáutica (opcional)</Form.Label>
          <Form.Control name="licencia" value={formulario.licencia} onChange={cambiar} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="direccion">
          <Form.Label>Dirección (opcional)</Form.Label>
          <Form.Control name="direccion" value={formulario.direccion} onChange={cambiar} />
        </Form.Group>

        <Button type="submit" className="w-100">
          Crear cuenta
        </Button>
      </Form>

      <p className="mt-3 mb-0">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </Card>
  );
}
