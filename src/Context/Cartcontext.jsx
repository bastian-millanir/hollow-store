import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    //  Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    // Guardar carrito cada vez que cambie
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    //  AGREGAR o INCREMENTAR cantidad
    const addToCart = (item) => {
        setCart((prev) => {
            const exists = prev.find((p) => p.id === item.id);
            if (exists) {
                return prev.map((p) =>
                    p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p
                );
            }
            return [...prev, { ...item, cantidad: 1 }];
        });
    };

    //  Incrementar cantidad
    const increaseQuantity = (id) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        );
    };

    // Reducir cantidad
    const decreaseQuantity = (id) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.cantidad > 1
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
        );
    };

    //  Quitar producto por ID
    const removeFromCart = (id) =>
        setCart((prev) => prev.filter((item) => item.id !== id));

    //  Vaciar todo el carrito
    const clearCart = () => setCart([]);

    // Total final
    const cartTotal = cart.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
export default CartContext;