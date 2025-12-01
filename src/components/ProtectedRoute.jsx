import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, authLoading } = useContext(AuthContext);

    if (authLoading) return <div>Cargando...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
}
