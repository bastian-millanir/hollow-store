// src/components/producto/ProductoCard.jsx
import React from "react";

export default function ProductoCard({ imagen, nombre, descripcion, precio, stock = 0, onAdd }) {
  const disponible = Number(stock) > 0;
  const src = imagen && imagen !== "" ? imagen : "/placeholder.jpg";
  const formattedPrice = Number(precio ?? 0).toLocaleString("es-CL");

  return (
    <article className="card">
      <div className="card-media">
        <img
          src={src}
          alt={nombre}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
      </div>

      <div className="card-body">
        <h3 className="card-title">{nombre}</h3>
        <p className="card-desc">{descripcion}</p>
        <p className="card-price">${formattedPrice}</p>

        <div className="card-actions">
          <button
            className="btn btn-add"
            disabled={!disponible}
            onClick={() => onAdd && onAdd()}
          >
            {disponible ? "Agregar al carrito" : "Sin stock"}
          </button>

          <button className="btn btn-ghost">Ver detalles</button>
        </div>

        <div className="small text-muted mt-2">Stock: {stock ?? 0}</div>
      </div>
    </article>
  );
}