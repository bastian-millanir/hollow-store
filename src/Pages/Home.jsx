import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../Context/Cartcontext";
import "./home.css";

export default function Home() {
    const { user, logout } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);

    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        // Puedes reemplazar esto con fetch al backend
        setFeatured([
            {
                id: 1,
                nombre: "Polera Dark Edition",
                precio: 19990,
                imagen: "https://via.placeholder.com/600x400/171722/8e44ad?text=Polera",
            },
            {
                id: 2,
                nombre: "Chaqueta Nocturna",
                precio: 39990,
                imagen: "https://via.placeholder.com/600x400/171722/6f42c1?text=Chaqueta",
            },
            {
                id: 3,
                nombre: "Zapatillas Shadow",
                precio: 45990,
                imagen: "https://via.placeholder.com/600x400/171722/4b2354?text=Zapatillas",
            }
        ]);
    }, []);

    return (
        <main className="home-root">

            {/* ──────────────────────────────── Banner superior ─────────────────────────────── */}
            <div id="banner-anuncios-home">
                  40% de descuento en temporada Dark — Envíos a todo Chile
            </div>

            {/* ──────────────────────────────── HERO ─────────────────────────────── */}
            <section className="hero">
                <div className="hero-inner">
                    <h1 className="brand-title">
                        Dark<span className="brand-accent">Store</span>
                    </h1>

                    <p className="hero-sub">
                        Moda urbana oscura — calidad premium y envíos rápidos.
                    </p>

                    <div className="hero-actions">
                        {!user ? (
                            <>
                                <Link to="/login" className="btn btn-outline">
                                    Iniciar sesión
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="welcome">
                                    Hola, <strong>{user.nombre || user.email}</strong>
                                </span>
                                <button className="btn btn-outline" onClick={logout}>
                                    Cerrar sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────── CARRUSEL DE OFERTAS ─────────────────────────────── */}
            <div className="carousel-container">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    spaceBetween={20}
                    slidesPerView={1}
                    loop
                    className="swiper-dark"
                >
                    <SwiperSlide>
                        <div className="slide-item">
                            <h3>Oferta 1: Poleras Dark 2x1</h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="slide-item">
                            <h3>Envíos gratis sobre $30.000</h3>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="slide-item">
                            <h3>Nueva colección Nocturna disponible</h3>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* ──────────────────────────────── PRODUCTOS DESTACADOS ─────────────────────────────── */}
            <section className="featured container">
                <h2 className="section-title">Productos destacados</h2>

                <div className="grid">
                    {featured.map((p) => (
                        <article className="card" key={p.id}>
                            <div className="card-media">
                                <img src={p.imagen} alt={p.nombre} />
                            </div>

                            <div className="card-body">
                                <h3 className="card-title">{p.nombre}</h3>
                                <p className="card-price">${p.precio.toLocaleString()}</p>

                                <div className="card-actions">
                                    <button
                                        className="btn btn-add"
                                        onClick={() => addToCart(p)}
                                    >
                                        Agregar al carrito
                                    </button>

                                    <Link to={`/productos/${p.id}`} className="btn btn-ghost">
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
