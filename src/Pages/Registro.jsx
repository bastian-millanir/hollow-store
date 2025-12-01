// src/pages/RegistroAvanzado.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/Authcontext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
// Password: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
const PASS_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function RegistroAvanzado() {
    const regionOptions = [
        "Selecciona una región",
        "Región de Arica y Parinacota",
        "Región de Tarapacá",
        "Región de Antofagasta",
        "Región de Atacama",
        "Región de Coquimbo",
        "Región de Valparaíso",
        "Región Metropolitana de Santiago",
        "Región de O'Higgins",
        "Región del Maule",
        "Región del Ñuble",
        "Región del Biobío",
        "Región de La Araucanía",
        "Región de Los Ríos",
        "Región de Los Lagos",
        "Región de Aysén",
        "Región de Magallanes y la Antártica Chilena",
    ];

    const { register: authRegister } = useContext(AuthContext);

    const [values, setValues] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        direccion: "",
        region: "",
        comuna: "",
    });

    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [mensajeEnvioGratis, setMensajeEnvioGratis] = useState("");
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    // Validaciones
    const errors = {
        nombre: values.nombre.trim() === "" ? "El nombre es obligatorio" : "",
        apellido: values.apellido.trim() === "" ? "El apellido es obligatorio" : "",
        email:
            values.email.trim() === ""
                ? "El email es obligatorio"
                : EMAIL_RE.test(values.email)
                ? ""
                : "El email no tiene formato válido",
        password:
            values.password.trim() === ""
                ? "La contraseña es obligatoria"
                : PASS_RE.test(values.password)
                ? ""
                : "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula y número",
        direccion: values.direccion.trim() === "" ? "La dirección es obligatoria" : "",
        region:
            values.region === "" || values.region === "Selecciona una región"
                ? "Debe seleccionar una región"
                : "",
        comuna: values.comuna.trim() === "" ? "La comuna es obligatoria" : "",
    };

    const isValid = (field) => !errors[field];

    const fieldClass = (field) => {
        const show = touched[field] || submitted;
        if (!show) return "form-control";
        return isValid(field) ? "form-control is-valid" : "form-control is-invalid";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
        setTouched((t) => ({ ...t, [name]: true }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((t) => ({ ...t, [name]: true }));
    };

    // comprobarEnvioGratis 
    function comprobarEnvioGratis(region, comuna) {
        if (!region || !comuna) return false;
        const comunasGratis = ["ñuñoa", "providencia", "las condes", "la reina", "macul"];
        const comunaNorm = comuna.trim().toLowerCase();
        return region === "Región Metropolitana de Santiago" && comunasGratis.includes(comunaNorm);
    }

    // Actualiza mensaje de envío gratis cada vez que cambian region o comuna
    useEffect(() => {
        if (comprobarEnvioGratis(values.region, values.comuna)) {
            setMensajeEnvioGratis("¡Tu envío es gratis en esta comuna!");
        } else {
            setMensajeEnvioGratis("");
        }
    }, [values.region, values.comuna]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setServerError("");

        const allValid =
            isValid("nombre") &&
            isValid("apellido") &&
            isValid("email") &&
            isValid("password") &&
            isValid("direccion") &&
            isValid("region") &&
            isValid("comuna");

        if (!allValid) {
            // muestra errores en UI: touched + submitted ya hacen eso
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setLoading(true);
        try {
            // Intentar llamar al backend )
            const resp = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: values.nombre,
                    apellido: values.apellido,
                    email: values.email,
                    password: values.password,
                    direccion: values.direccion,
                    region: values.region,
                    comuna: values.comuna,
                }),
            });

            if (!resp.ok) {
                // si el backend devuelve error con JSON {message: "..."}
                let text = await resp.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || "Error en servidor");
                } catch {
                    throw new Error(text || "Error en servidor");
                }
            }

            const data = await resp.json().catch(() => null);

            // Notificar al AuthContext (si lo usas para mantener sesión)
            if (authRegister) {
                try {
                    await authRegister({
                        nombre: values.nombre,
                        apellido: values.apellido,
                        email: values.email,
                        direccion: values.direccion,
                        region: values.region,
                        comuna: values.comuna,
                    });
                } catch (err) {
                    // no crítico
                    console.warn("authRegister falló:", err);
                }
            }

            // Si backend OK: limpiamos el formulario y mostramos éxito
            alert("Registro exitoso. Revisa tu correo para confirmar (si aplica).");

            // Guardar usuario en localStorage como fallback (opcional)
            localStorage.setItem(
                "user_fallback",
                JSON.stringify({
                    nombre: values.nombre,
                    apellido: values.apellido,
                    email: values.email,
                    direccion: values.direccion,
                    region: values.region,
                    comuna: values.comuna,
                    createdAt: new Date().toISOString(),
                })
            );

            // Guardar mensaje de envío gratis (ya calculado en useEffect)
            // Limpiar formulario
            setValues({
                nombre: "",
                apellido: "",
                email: "",
                password: "",
                direccion: "",
                region: "",
                comuna: "",
            });
            setTouched({});
            setSubmitted(false);
        } catch (err) {
            console.error("Error registro:", err);
            setServerError(err.message || "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card mx-auto p-4 rounded-4 shadow-sm" style={{ maxWidth: 720 }}>
                        <div className="card-body">
                            <h2 className="mb-4 text-center">Crear cuenta — Registro Avanzado</h2>

                            {serverError && (
                                <div className="alert alert-danger" role="alert">
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="nombre" className="form-label">
                                            Nombre
                                        </label>
                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            className={fieldClass("nombre")}
                                            placeholder="Ingresa tu nombre"
                                            value={values.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {(touched.nombre || submitted) && errors.nombre && (
                                            <div className="invalid-feedback">{errors.nombre}</div>
                                        )}
                                        {(touched.nombre || submitted) && !errors.nombre && (
                                            <div className="valid-feedback">Correcto</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="apellido" className="form-label">
                                            Apellido
                                        </label>
                                        <input
                                            id="apellido"
                                            name="apellido"
                                            type="text"
                                            className={fieldClass("apellido")}
                                            placeholder="Ingresa tu apellido"
                                            value={values.apellido}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {(touched.apellido || submitted) && errors.apellido && (
                                            <div className="invalid-feedback">{errors.apellido}</div>
                                        )}
                                        {(touched.apellido || submitted) && !errors.apellido && (
                                            <div className="valid-feedback">Correcto</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className={fieldClass("email")}
                                            placeholder="ejemplo@correo.com"
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

                                    <div className="col-md-6">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={fieldClass("password")}
                                            placeholder="Mínimo 8 caracteres, con mayúscula y número"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {(touched.password || submitted) && errors.password && (
                                            <div className="invalid-feedback">{errors.password}</div>
                                        )}
                                        {(touched.password || submitted) && !errors.password && (
                                            <div className="valid-feedback">Contraseña válida</div>
                                        )}
                                    </div>

                                    <div className="col-md-8">
                                        <label htmlFor="direccion" className="form-label">
                                            Dirección
                                        </label>
                                        <input
                                            id="direccion"
                                            name="direccion"
                                            type="text"
                                            className={fieldClass("direccion")}
                                            placeholder="Calle, número, departamento (si aplica)"
                                            value={values.direccion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {(touched.direccion || submitted) && errors.direccion && (
                                            <div className="invalid-feedback">{errors.direccion}</div>
                                        )}
                                        {(touched.direccion || submitted) && !errors.direccion && (
                                            <div className="valid-feedback">Correcto</div>
                                        )}
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="region" className="form-label">
                                            Región
                                        </label>
                                        <select
                                            id="region"
                                            name="region"
                                            className={fieldClass("region")}
                                            value={values.region}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            {regionOptions.map((r) => (
                                                <option key={r} value={r === "Selecciona una región" ? "" : r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                        {(touched.region || submitted) && errors.region && (
                                            <div className="invalid-feedback d-block">{errors.region}</div>
                                        )}
                                        {(touched.region || submitted) && !errors.region && (
                                            <div className="valid-feedback d-block">Correcto</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="comuna" className="form-label">
                                            Comuna
                                        </label>
                                        <input
                                            id="comuna"
                                            name="comuna"
                                            type="text"
                                            className={fieldClass("comuna")}
                                            placeholder="Ej: Ñuñoa"
                                            value={values.comuna}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {(touched.comuna || submitted) && errors.comuna && (
                                            <div className="invalid-feedback">{errors.comuna}</div>
                                        )}
                                        {(touched.comuna || submitted) && !errors.comuna && (
                                            <div className="valid-feedback">Correcto</div>
                                        )}
                                    </div>

                                </div>

                                <div className="d-grid d-sm-flex justify-content-end gap-3 mt-4">
                                    <button id="button-register" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? "Registrando..." : "Crear cuenta"}
                                    </button>
                                </div>
                            </form>

                            {mensajeEnvioGratis && (
                                <div className="text-success text-center mt-3" id="mensaje-envio-gratis">
                                    {mensajeEnvioGratis}
                                </div>
                            )}
                            <small className="text-muted d-block text-center mt-2">
                                Al registrarte aceptas los términos y condiciones.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

