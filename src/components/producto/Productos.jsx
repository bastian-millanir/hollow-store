import ProductoCard from './ProductoCard.jsx';
import { products } from './products.js';

function Productos() {
    return (
        <section id="productos">
            <div className="container my-5">
                <h2 className="text-center mb-4">Nuestros Productos</h2>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.map((producto) => (
                        <div className="col" key={producto.id}>
                            <ProductoCard
                                imagen={producto.imagen}
                                nombre={producto.nombre}
                                descripcion={producto.descripcion}
                                precio={producto.precio}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default Productos;