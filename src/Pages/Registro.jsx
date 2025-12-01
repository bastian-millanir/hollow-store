import { useEffect, useState } from "react";
import "./registro.css"; // estilos dark elegantes
import React from "react";




export default function Registro() {
  const [regions, setRegions] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    regionId: "",
    comunaId: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);

  // ============================
  // Cargar regiones al iniciar
  // ============================
  useEffect(() => {
    fetch("http://localhost:8080/api/region")
      .then((res) => res.json())
      .then((data) => {
        setRegions(data);
        setLoading(false);
      });
  }, []);

  // ============================
  // Cargar comunas según región
  // ============================
  useEffect(() => {
    if (!form.regionId) return;

    fetch(`http://localhost:8080/api/comuna/region/${form.regionId}`)
      .then((res) => res.json())
      .then((data) => setComunas(data));
  }, [form.regionId]);

  // ============================
  // Manejo de inputs
  // ============================
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // ============================
  // Enviar formulario
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.regionId || !form.comunaId) {
      return alert("Todos los campos son obligatorios.");
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      address: form.address,
      region: { id: form.regionId },
      comuna: { id: form.comunaId }
    };

    const res = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Usuario registrado correctamente");
      window.location.href = "/login";
    } else {
      alert("Error al registrar usuario");
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Cargando regiones...</p>;

  return (
    <div className="registro-container">
      <form onSubmit={handleSubmit} className="registro-card">

        <h1 className="registro-title">Crear Cuenta</h1>

        <input
          className="input"
          type="text"
          placeholder="Nombre Completo"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          className="input"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Dirección"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        {/* ============================
            SELECT REGIÓN
        ============================ */}
        <select
          className="input"
          value={form.regionId}
          onChange={(e) => handleChange("regionId", e.target.value)}
        >
          <option value="">Selecciona una región</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>

        {/* ============================
            SELECT COMUNA (DINÁMICO)
        ============================ */}
        <select
          className="input"
          value={form.comunaId}
          onChange={(e) => handleChange("comunaId", e.target.value)}
          disabled={!form.regionId}
        >
          <option value="">Selecciona una comuna</option>
          {comunas.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <button className="btn" type="submit">
          Registrarme
        </button>

      </form>
    </div>
  );
}
