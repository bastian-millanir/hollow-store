// src/components/ProductoCard.jsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductoCard({ imagen, nombre, descripcion, precio }) {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="card bg-dark text-white p-3">
            <img src={imagen} className="card-img-top" alt={nombre} />
            <h4>{nombre}</h4>
            <p>{descripcion}</p>
            <p>${precio}</p>
            <button className="btn btn-primary" onClick={() =>
                addToCart({ nombre, precio, imagen })
            }>
                Agregar al carrito
            </button>
        </div>
    );
}

export default ProductoCard;
