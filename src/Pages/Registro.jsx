        import React, { useEffect, useState } from "react";
        import "./registro.css";

        export default function Registro() {
            const [regions, setRegions] = useState([]);
            const [comunas, setComunas] = useState([]);
            const [touched, setTouched] = useState({});
            const [submitted, setSubmitted] = useState(false);
            const [loading, setLoading] = useState(true);
            const [serverError, setServerError] = useState("");

            const [form, setForm] = useState({
                name: "",
                email: "",
                password: "",
                regionId: "",
                comunaId: "",
                address: "",
                isActive: true,
                isAdmin: false,
                isVendedor: false
            });

            // Validaciones dinámicas (se calculan después de `form`)
            const errors = {
                name: !form.name?.trim() ? "Nombre obligatorio" : "",
                email: !form.email?.trim() ? "Email obligatorio" : "",
                password: !form.password?.trim() ? "Contraseña obligatoria" : "",
                regionId: !form.regionId ? "Región obligatoria" : "",
                comunaId: !form.comunaId ? "Comuna obligatoria" : "",
                address: !form.address?.trim() ? "Dirección obligatoria" : ""
            };

            // Helper para clases de validación
            const fieldClass = (field) => {
                const show = (typeof touched === "object" && touched && touched[field]) || !!submitted;
                if (!show) return "form-control";
                const hasError = typeof errors === "object" && errors && errors[field];
                return hasError ? "form-control is-invalid" : "form-control is-valid";
            };

            // Cargar regiones al montar
            useEffect(() => {
                let mounted = true;
                const controller = new AbortController();
                const load = async () => {
                    try {
                        setLoading(true);
                        const res = await fetch("http://localhost:8080/api/regions", {signal: controller.signal});
                        if (!res.ok) throw new Error("No se pudieron cargar regiones");
                        const data = await res.json();
                        if (!mounted) return;
                        setRegions(Array.isArray(data) ? data : []);
                    } catch (err) {
                        if (err.name === "AbortError") return;
                        console.error("Error cargando regiones:", err);
                        setRegions([]);
                    } finally {
                        if (mounted) setLoading(false);
                    }
                };
                load();
                return () => {
                    mounted = false;
                    controller.abort();
                };
            }, []);

            // Cargar comunas y filtrar por regionId cuando cambie form.regionId
            // En `src/Pages/Registro.jsx` reemplaza el useEffect de comunas por este trozo
            // javascript
            useEffect(() => {
                if (!form.regionId) {
                    setComunas([]);
                    return;
                }

                const controller = new AbortController();

                const loadComunas = async () => {
                    try {
                        const res = await fetch(
                            `http://localhost:8080/api/comunas/region/${form.regionId}/full`,
                            {signal: controller.signal}
                        );

                        if (!res.ok) throw new Error("No se pudieron cargar las comunas");

                        const data = await res.json();

                        const normalized = Array.isArray(data)
                            ? data.map((item, idx) => {
                                const nombre = item.comuna ?? item.target?.comuna ?? item.nombre ?? item.name ?? "";
                                const id = item.id ?? nombre ?? String(idx);
                                return {id, nombre};
                            })
                            : [];

                        setComunas(normalized);
                    } catch (err) {
                        if (err.name === "AbortError") return;
                        console.error("Error cargando comunas:", err);
                        setComunas([]);
                    }
                };

                loadComunas();
                return () => controller.abort();
            }, [form.regionId]);

            // Handlers
            const handleInputChange = (e) => {
                const {name, value, type, checked} = e.target || {};
                if (!name) return;
                const val = type === "checkbox" ? checked : value;
                setForm((f) => ({...(f || {}), [name]: val}));
                setTouched((t) => ({...(t || {}), [name]: true}));
                // si cambia región, limpiar comuna seleccionada
                if (name === "regionId") {
                    setForm((f) => ({...(f || {}), comunaId: "", regionId: val}));
                }
            };

            const handleBlur = (e) => {
                const {name} = e.target || {};
                if (!name) return;
                setTouched((t) => ({...(t || {}), [name]: true}));
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                setSubmitted(true);
                setServerError("");

                // Validación simple
                const hasErrors = Object.values(errors).some((v) => v);
                if (hasErrors) return;

                try {
                    const res = await fetch("http://localhost:8080/api/users/register", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(form)
                    });

                    if (!res.ok) {
                        const txt = await res.text();
                        throw new Error(txt || "Error al registrar");
                    }

                    // éxito: limpiar formulario
                    setForm({
                        name: "",
                        email: "",
                        password: "",
                        regionId: "",
                        comunaId: "",
                        address: ""
                    });
                    setTouched({});
                    setSubmitted(false);
                    alert("Registro exitoso. Por favor inicia sesión.");
                } catch (err) {
                    console.error(err);
                    setServerError(err.message || "Error de registro");
                }
            };

            return (
                <section className="registro-container">
                    <div className="registro-card">
                        <h2 className="registro-title">Registro</h2>

                        {serverError && <div className="alert alert-danger">{serverError}</div>}

                        <form onSubmit={handleSubmit} noValidate className="d-flex flex-column">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label text-white">Nombre</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className={`input ${fieldClass("name").includes("is-invalid") ? "is-invalid" : fieldClass("name").includes("is-valid") ? "is-valid" : ""}`}
                                    placeholder="Ingrese nombre"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                {(touched.name || submitted) && errors.name && (
                                    <div className="invalid-feedback d-block">{errors.name}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-white">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`input ${fieldClass("email").includes("is-invalid") ? "is-invalid" : fieldClass("email").includes("is-valid") ? "is-valid" : ""}`}
                                    placeholder="Ingrese email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                {(touched.email || submitted) && errors.email && (
                                    <div className="invalid-feedback d-block">{errors.email}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label text-white">Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={`input ${fieldClass("password").includes("is-invalid") ? "is-invalid" : fieldClass("password").includes("is-valid") ? "is-valid" : ""}`}
                                    placeholder="Ingrese contraseña"
                                    value={form.password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                {(touched.password || submitted) && errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="regionId" className="form-label text-white">Región</label>
                                <select
                                    id="regionId"
                                    name="regionId"
                                    className={`input ${fieldClass("regionId").includes("is-invalid") ? "is-invalid" : fieldClass("regionId").includes("is-valid") ? "is-valid" : ""}`}
                                    value={form.regionId}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Selecciona una región</option>
                                    {regions.map((r) => (
                                        <option key={r.id ?? r._id ?? r.nombre} value={r.id ?? r._id}>
                                            {r.nombre || r.name}
                                        </option>
                                    ))}
                                </select>
                                {(touched.regionId || submitted) && errors.regionId && (
                                    <div className="invalid-feedback d-block">{errors.regionId}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="comunaId" className="form-label text-white">Comuna</label>
                                <select
                                    id="comunaId"
                                    name="comunaId"
                                    className={`input ${fieldClass("comunaId").includes("is-invalid") ? "is-invalid" : fieldClass("comunaId").includes("is-valid") ? "is-valid" : ""}`}
                                    value={form.comunaId}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {comunas.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}

                                </select>
                                {(touched.comunaId || submitted) && errors.comunaId && (
                                    <div className="invalid-feedback d-block">{errors.comunaId}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label text-white">Dirección</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    className={`input ${fieldClass("address").includes("is-invalid") ? "is-invalid" : fieldClass("address").includes("is-valid") ? "is-valid" : ""}`}
                                    placeholder="Ingrese dirección"
                                    value={form.address}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                {(touched.address || submitted) && errors.address && (
                                    <div className="invalid-feedback d-block">{errors.address}</div>
                                )}
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isAdmin"
                                    name="isAdmin"
                                    checked={form.isAdmin}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="isAdmin" className="form-check-label text-white">
                                    ¿Administrador?
                                </label>
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isVendedor"
                                    name="isVendedor"
                                    checked={form.isVendedor}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="isVendedor" className="form-check-label text-white">
                                    ¿Vendedor?
                                </label>
                            </div>


                            <div className="d-grid">
                                <button type="submit" className="btn" disabled={loading}
                                        style={{opacity: loading ? 0.8 : 1}}>
                                    {loading ? "Registrando..." : "Registrarse"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            );
        }