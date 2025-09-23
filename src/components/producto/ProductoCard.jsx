function ProductoCard({ imagen, nombre, descripcion, precio }) {
    return (
        <div className="card h-100 text-white bg-dark border border-secondary shadow-lg">
            <img src={imagen} className="card-img-top" alt={nombre} style={{ objectFit: 'cover', height: '250px' }} />
            <div className="card-body">
                <h5 className="card-title">{nombre}</h5>
                <p className="card-text">{descripcion}</p>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5">${precio}</span>
                <button className="btn btn-outline-light btn-sm">Agregar al carrito</button>
            </div>
        </div>
    );
}

export default ProductoCard;