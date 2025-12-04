import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../components/home/gothic-swipper.css";
import ProductoCard from "../components/producto/ProductoCard.jsx";

export default function GothicSwiper() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch("http://localhost:8080/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar productos");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setProductos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Error desconocido");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  if (loading) return <p className="text-center py-4 text-white">Cargando slider...</p>;
  if (error) return <p className="text-center py-4 text-danger">Error: {error}</p>;
  if (productos.length === 0) return null;

  return (
    <section className="gothic-swiper container py-5">
      <h2 className="swiper-title text-center mb-4">Novedades Oscuras</h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
      >
        {productos.map((p) => {
          const imagen = p.imagen || p.imageUrl || p.image || p.imagenUrl || "/placeholder.jpg";
          const nombre = p.nombre || p.name || "Sin nombre";
          const descripcion = p.descripcion || p.description || "";
          const precio = p.precio ?? p.price ?? 0;
          const stock = p.stock ?? p.cantidad ?? 0;
          const id = p.id ?? p._id;

          return (
            <SwiperSlide key={id}>
              <div className="slide-card">
                <ProductoCard
                  imagen={imagen}
                  nombre={nombre}
                  descripcion={descripcion}
                  precio={precio}
                  stock={stock}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}