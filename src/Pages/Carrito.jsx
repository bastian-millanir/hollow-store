import { useContext } from "react";
import { CartContext } from "../Context/Cartcontext";

function Carrito() {
    const {
        cart,
        addToCart,
        decreaseItem,
        removeFromCart,
        clearCart,
        cartTotal
    } = useContext(CartContext);

    return (
        <section>
            <h2>Carrito</h2>

            {cart.length === 0 && <p>El carrito está vacío.</p>}

            {cart.map(item => (
                <div key={item.id}>
                    <img src={item.imagen} width={80} />
                    <h4>{item.nombre}</h4>

                    <button onClick={() => decreaseItem(item.id)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => addToCart(item)}>+</button>

                    <button onClick={() => removeFromCart(item.id)}>Eliminar</button>

                    <p>Total: ${item.precio * item.cantidad}</p>
                </div>
            ))}

            <hr />
            <h3>Total general: ${cartTotal}</h3>
            <button onClick={clearCart}>Vaciar carrito</button>
        </section>
    );
}

export default Carrito;
