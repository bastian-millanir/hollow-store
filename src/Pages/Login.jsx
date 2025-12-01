// src/pages/LoginAvanzado.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../Context/Authcontext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export default function LoginAvanzado() {
    const { login: authLogin } = useContext(AuthContext);

    const [values, setValues] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const errors = {
        email:
            values.email.trim() === ""
                ? "El email es obligatorio"
                : EMAIL_RE.test(values.email)
                ? ""
                : "Formato de correo incorrecto",
        password:
            values.password.trim() === "" ? "La contraseña es obligatoria" : "",
    };

    const isValid = (f) => !errors[f];

    const fieldClass = (f) => {
        const show = touched[f] || submitted;
        if (!show) return "form-control";
        return isValid(f) ? "form-control is-valid" : "form-control is-invalid";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues((v) => ({
            ...v,
            [name]: type === "checkbox" ? checked : value,
        }));
        setTouched((t) => ({ ...t, [name]: true }));
    };

    const handleBlur = (e) => {
        setTouched((t) => ({ ...t, [e.target.name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setServerError("");

        const allValid = isValid("email") && isValid("password");
        if (!allValid) return;

        setLoading(true);
        try {
            // Aquí conectas a tu backend
            const resp = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (!resp.ok) {
                let msg = "Error en el servidor";
                try {
                    const data = await resp.json();
                    msg = data.message || msg;
                } catch (e) {}
                throw new Error(msg);
            }

            const data = await resp.json(); // backend debe devolver {token, user}

            // === Login en el contexto ===
            if (authLogin) {
                await authLogin(data.user, data.token, values.remember);
            }

            // === Guardar datos de sesión ===
            if (values.remember) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data.user));
            }

            alert("Inicio de sesión exitoso");

            // Redirige si quieres:
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            setServerError(err.message || "Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card p-4 rounded-4 shadow-sm">
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>

                        {serverError && (
                            <div className="alert alert-danger">{serverError}</div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={fieldClass("email")}
                                    placeholder="correo@ejemplo.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {(touched.email || submitted) && errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                                {(touched.email || submitted) && !errors.email && (
                                    <div className="valid-feedback">Correcto</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    className={fieldClass("password")}
                                    placeholder="Ingresa tu contraseña"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {(touched.password || submitted) && errors.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                                {(touched.password || submitted) && !errors.password && (
                                    <div className="valid-feedback">Correcto</div>
                                )}
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="remember"
                                    checked={values.remember}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">
                                    Recordarme
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-100 btn-lg"
                            >
                                {loading ? "Ingresando..." : "Entrar"}
                            </button>
                        </form>

                        <p className="text-center mt-3">
                            ¿No tienes cuenta?{" "}
                            <a href="/register" className="text-decoration-none">
                                Crear una cuenta
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
