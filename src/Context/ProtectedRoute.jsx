import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, authLoading } = useContext(AuthContext);

  if (authLoading) return <p>Cargando...</p>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
