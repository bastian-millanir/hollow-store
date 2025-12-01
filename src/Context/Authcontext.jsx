// src/context/AuthContext.jsx

import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // aquí irá la llamada al backend
        setUser({ email });
    };

    const register = (data) => {
        // aquí irá la llamada POST al backend
        console.log("Registrando:", data);
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
