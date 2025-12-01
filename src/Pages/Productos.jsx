import { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import productosMock from "../data/productosMock";

function Productos() {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // TODO: reemplazar por fetch al backend
        setProductos(productosMock);
    }, []);

    return (
        <section className="container py-5">
            <h2 className="text-center mb-4">Productos</h2>
            <div className="row">
                {productos.map(p => (
                    <div className="col-md-4" key={p.id}>
                        <ProductoCard {...p} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Productos;
