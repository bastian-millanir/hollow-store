// src/Pages/Productos.jsx
import { useEffect, useState, useContext } from "react";
import ProductoCard from "../components/producto/ProductoCard.jsx";
import { CartContext } from "../Context/Cartcontext";

export default function Productos() {
  const { addToCart } = useContext(CartContext);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products");
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <p className="text-center py-5">Cargando productos...</p>;
  if (error) return <p className="text-center py-5 text-danger">Error: {error}</p>;

  return (
    <section className="container py-5">
      <h2 className="text-center mb-4">Productos</h2>
      <div className="row">
        {productos.map((p) => {
          const imagen = p.imagen || p.imageUrl || p.image || p.imagenUrl || "";
          const nombre = p.nombre || p.name || "Sin nombre";
          const descripcion = p.descripcion || p.description || p.desc || "";
          const precio = p.precio ?? p.price ?? 0;
          const stock = p.stock ?? p.cantidad ?? 0;
          const id = p.id ?? p._id;

          return (
            <div className="col-md-4" key={id}>
              <ProductoCard
                imagen={imagen}
                nombre={nombre}
                descripcion={descripcion}
                precio={precio}
                stock={stock}
                onAdd={() =>
                  addToCart &&
                  addToCart({
                    id,
                    nombre,
                    precio,
                    imagen,
                    stock,
                  })
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}