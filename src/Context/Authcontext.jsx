// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ===================================================
  // Cargar token y usuario al iniciar app
  // ===================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStored = localStorage.getItem("user");

    if (token && userStored) {
      setUser(JSON.parse(userStored));
      setAuthLoading(false);
      return;
    }

    setAuthLoading(false);
  }, []);

  // ===================================================
  // LOGIN
  // ===================================================
  const login = async (email, password, remember = false) => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Credenciales incorrectas");
    }

    const data = await res.json(); // contiene: { token, user }

    const { token, user } = data;

    if (!token || !user) {
      throw new Error("Respuesta inesperada del servidor");
    }

    // Si marcó recordar → localStorage
    if (remember) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    setUser(user);
  };

  // ===================================================
  // REGISTER
  // ===================================================
  const register = async (formData) => {
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "No se pudo registrar");
    }

    const userCreated = await res.json();

    // Tu backend **NO** devuelve token en register
    // el usuario debe iniciar sesión después

    return userCreated;
  };

  // ===================================================
  // LOGOUT
  // ===================================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  // ===================================================
  // Valor final del contexto
  // ===================================================
  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
