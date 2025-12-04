// File: src/Pages/Perfil.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../Context/Authcontext";

/* Componentes UI mínimos inline para no crear archivos extra */
function Card({ children, className = "", ...props }) {
  return (
    <div className={["card bg-dark text-white", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "", ...props }) {
  return (
    <div className={["card-body", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

function Button({ children, className = "btn btn-primary", ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function Input({ label, id, value, onChange, type = "text", className = "form-control", ...props }) {
  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="form-label text-white">{label}</label>}
      <input id={id} type={type} value={value || ""} onChange={onChange} className={className} {...props} />
    </div>
  );
}

function Select({ label, id, value, onChange, children, className = "form-select", ...props }) {
  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="form-label text-white">{label}</label>}
      <select id={id} value={value || ""} onChange={onChange} className={className} {...props}>
        {children}
      </select>
    </div>
  );
}

function SelectItem({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}

/* Componente Perfil */
export default function Perfil() {
  const { logout: authLogout } = useAuth();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    direccion: "",
    regionId: "",
    comunaId: ""
  });
  const [regions, setRegions] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [filteredComunas, setFilteredComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Cargar usuario desde storage al montar
  useEffect(() => {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setUser(u);
        setForm({
          nombre: u.nombre || u.name || "",
          email: u.email || "",
          direccion: u.direccion || u.address || "",
          regionId: u.region?.id || "",
          comunaId: u.comuna?.id || ""
        });
      } catch (e) {
        console.warn("No se pudo parsear user desde storage", e);
      }
    }
  }, []);

  // Cargar regiones y comunas desde API
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [rRes, cRes] = await Promise.all([
          fetch("http://localhost:8080/api/region", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/comuna", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (rRes.ok) {
          const rData = await rRes.json();
          setRegions(rData);
        } else {
          setRegions([]);
        }

        if (cRes.ok) {
          const cData = await cRes.json();
          // Normalizar: algunas APIs usan regionId o region.id
          const normalized = cData.map((c) => ({
            ...c,
            regionId: c.regionId ?? c.region?.id ?? c.regionId
          }));
          setComunas(normalized);
        } else {
          setComunas([]);
        }
      } catch (err) {
        console.error("Error cargando regiones/comunas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filtrar comunas cuando cambia regionId o comunas
  useEffect(() => {
    if (!form.regionId) {
      setFilteredComunas([]);
      return;
    }
    setFilteredComunas(comunas.filter((c) => String(c.regionId) === String(form.regionId)));
  }, [form.regionId, comunas]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!user) {
      setMessage("Usuario no cargado.");
      return;
    }

    setSaving(true);

    const payload = {
      nombre: form.nombre,
      email: form.email,
      direccion: form.direccion,
      regionId: form.regionId || null,
      comunaId: form.comunaId || null
    };

    try {
      // Ajusta la URL según tu API; aquí usamos /api/users/{id}
      const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al actualizar usuario");
      }

      const updated = await res.json();

      // Actualizar storage local/session y estado
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(updated));
      } else {
        sessionStorage.setItem("user", JSON.stringify(updated));
      }
      setUser(updated);
      setMessage("Perfil actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error al actualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // Preferir logout del contexto si existe
    try {
      if (authLogout) {
        authLogout();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/";
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  if (loading) {
    return <p className="text-white text-center py-5">Cargando perfil...</p>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <Card className="p-3">
            <CardContent>
              <h2 className="mb-4">Mi Perfil</h2>

              <form onSubmit={handleUpdate}>
                <Input
                  id="nombre"
                  label="Nombre"
                  value={form.nombre}
                  onChange={handleChange("nombre")}
                />

                <Input
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                />

                <Input
                  id="direccion"
                  label="Dirección"
                  value={form.direccion}
                  onChange={handleChange("direccion")}
                />

                <Select
                  id="region"
                  label="Región"
                  value={form.regionId}
                  onChange={handleChange("regionId")}
                >
                  <SelectItem value="">Selecciona una región</SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.nombre || r.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  id="comuna"
                  label="Comuna"
                  value={form.comunaId}
                  onChange={handleChange("comunaId")}
                >
                  <SelectItem value="">Selecciona una comuna</SelectItem>
                  {filteredComunas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre || c.name}
                    </SelectItem>
                  ))}
                </Select>

                <div className="d-flex gap-2">
                  <Button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>

                  <Button type="button" className="btn btn-secondary" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </div>

                {message && <div className="mt-3 text-info">{message}</div>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}