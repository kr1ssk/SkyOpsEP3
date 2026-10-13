import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Login() {
  const { iniciarSesion } = useSkyOps();
  const navegar = useNavigate();

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  function enviar(evento) {
    evento.preventDefault();

    try {
      iniciarSesion(correo, clave);
      navegar("/perfil"); // navegación por código tras un evento
    } catch (problema) {
      // El contexto lanza el error; aquí se muestra al usuario
      setError(problema.message);
    }
  }

  return (
    <Card body className="mx-auto" style={{ maxWidth: "28rem" }}>
      <h1 className="h3">Iniciar sesión</h1>

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      <Form onSubmit={enviar} noValidate>
        <Form.Group className="mb-3" controlId="correo">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="clave">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100">
          Ingresar
        </Button>
      </Form>

      <p className="mt-3 mb-0">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </Card>
  );
}
