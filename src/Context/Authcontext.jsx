import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);  // usuario completo
    const [token, setToken] = useState(null); // JWT
    const [loading, setLoading] = useState(true);

    // Al iniciar: revisar si existe un token guardado
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));

            // Verificar con backend que el token siga siendo válido
            verifyToken(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    // Verificar token con backend
    const verifyToken = async (jwt) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/verify", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (!res.ok) throw new Error("Token inválido");

            setLoading(false);
        } catch (error) {
            console.error("Token expirado o inválido:", error);
            logout();
        }
    };

    //  LOGIN
    const login = async (email, password) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Credenciales incorrectas");

            const data = await res.json();

            setUser(data.user);
            setToken(data.token);

            // Guardar
            localStorage.setItem("authUser", JSON.stringify(data.user));
            localStorage.setItem("authToken", data.token);

            return { ok: true };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    };

    // REGISTER
    const register = async (form) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error al registrar usuario");

            const data = await res.json();

            return { ok: true, message: "Usuario registrado" };

        } catch (error) {
            return { ok: false, error: error.message };
        }
    };

    //  LOGOUT
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
