import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [regions, setRegions] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [filteredComunas, setFilteredComunas] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // -----------------------------
  // Cargar usuario desde storage
  // -----------------------------
  useEffect(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  // -----------------------------
  // Cargar regiones y comunas
  // -----------------------------
  useEffect(() => {
    fetch("http://localhost:8080/api/region")
      .then((res) => res.json())
      .then(setRegions);

    fetch("http://localhost:8080/api/comuna")
      .then((res) => res.json())
      .then(setComunas);
  }, []);

  // Filtrar comunas según región
  useEffect(() => {
    if (user?.region?.id) {
      setFilteredComunas(
        comunas.filter((c) => c.regionId === user.region.id)
      );
    }
  }, [user?.region, comunas]);

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  // -----------------------------
  // Actualizar usuario
  // -----------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    const body = {
      ...user,
      region: { id: user.region.id },
      comuna: { id: user.comuna.id },
    };

    const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) return alert("Error actualizando perfil");

    alert("Perfil actualizado correctamente");

    localStorage.setItem("user", JSON.stringify(user));
  };

  if (loading) return <p className="text-white text-center">Cargando perfil...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0b0b0b] to-[#1a1a1a] text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-[#111]/60 backdrop-blur-xl border border-gray-700 shadow-2xl">
          <CardContent className="p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Mi Perfil</h1>
              <Button variant="destructive" onClick={logout}>
                Cerrar Sesión
              </Button>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                src={
                  user.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="w-28 h-28 rounded-full border-2 border-gray-600 shadow-xl"
              />

              <Input
                className="mt-4 w-64 bg-black/40 text-white border-gray-600"
                placeholder="URL del avatar"
                value={user.avatar || ""}
                onChange={(e) => setUser({ ...user, avatar: e.target.value })}
              />
            </div>

            {/* Formulario */}
            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-5">

              <div>
                <label className="text-gray-300">Nombre</label>
                <Input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="mt-1 bg-black/40 text-white border-gray-600"
                />
              </div>

              <div>
                <label className="text-gray-300">Email</label>
                <Input
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="mt-1 bg-black/40 text-white border-gray-600"
                />
              </div>

              <div>
                <label className="text-gray-300">Dirección</label>
                <Input
                  value={user.address || ""}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  className="mt-1 bg-black/40 text-white border-gray-600"
                />
              </div>

              {/* Región */}
              <div>
                <label className="text-gray-300">Región</label>
                <Select
                  value={user.region?.id?.toString() || ""}
                  onValueChange={(value) =>
                    setUser({
                      ...user,
                      region: regions.find((r) => r.id == value),
                    })
                  }
                >
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Comuna filtrada */}
              <div>
                <label className="text-gray-300">Comuna</label>
                <Select
                  value={user.comuna?.id?.toString() || ""}
                  onValueChange={(value) =>
                    setUser({
                      ...user,
                      comuna: comunas.find((c) => c.id == value),
                    })
                  }
                >
                  {filteredComunas.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <Button type="submit" className="mt-4 bg-purple-600 hover:bg-purple-700">
                Guardar Cambios
              </Button>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
