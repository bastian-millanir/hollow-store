import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // =======================================
  // Mantener sesión tras recargar la página
  // =======================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setAuthLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // =======================================
  // LOGIN
  // =======================================
  const login = async (email, password) => {
    const res = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Error al iniciar sesión");
    }

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);

    setUser(data.user);
  };

  // =======================================
  // LOGOUT
  // =======================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  // =======================================
  // Determinar rol en base a tu backend
  // =======================================
  const role = user
    ? (user.isAdmin ? "ADMIN" :
       user.isVendedor ? "VENDEDOR" : "USUARIO")
    : null;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      role,
      isAuthenticated: !!user,
      authLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}
