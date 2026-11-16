import { Navigate, Outlet } from "react-router-dom";
import { useSkyOps } from "../context/SkyOpsContext.jsx";

// Protege un grupo de rutas: sin sesión va al login; con un rol no permitido va al perfil.
// Esto solo oculta las pantallas: la seguridad real la aplica el backend (401 y 403).
export default function Acceso({ roles }) {
  const { usuario } = useSkyOps();
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/perfil" replace />;
  return <Outlet />;
}
