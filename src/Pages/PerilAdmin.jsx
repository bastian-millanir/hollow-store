import { useEffect, useState } from "react";
import "./admin.css";

export default function PerfilAdmin() {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [preview, setPreview] = useState(null);

    const token = localStorage.getItem("token");

    // ================================
    // Cargar productos y usuarios
    // ================================
    useEffect(() => {
        loadProducts();
        loadUsers();
    }, []);

    // --- Productos ---
    const loadProducts = async () => {
        const res = await fetch("/api/products", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProducts(data);
    };

    // --- Usuarios ---
    const loadUsers = async () => {
        const res = await fetch("/api/users", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
    };

    // ================================
    // Guardar cambios de producto
    // ================================
    const saveProductChanges = async () => {
        const formData = new FormData();

        formData.append("name", editingProduct.name);
        formData.append("price", editingProduct.price);
        formData.append("stock", editingProduct.stock);

        if (editingProduct.image) formData.append("image", editingProduct.image);

        await fetch(`/api/products/${editingProduct.id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        setEditingProduct(null);
        setPreview(null);
        loadProducts();
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setEditingProduct({ ...editingProduct, image: file });
        setPreview(URL.createObjectURL(file));
    };

    // ================================
    // Cambiar rol o estado del usuario
    // ================================
    const toggleUserActive = async (id, active) => {
        await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ isActive: !active })
        });
        loadUsers();
    };

    const toggleUserRole = async (u) => {
        const newRoleState = {
            isAdmin: !u.isAdmin,
            isVendedor: u.isAdmin ? true : u.isVendedor,
        };

        await fetch(`/api/users/${u.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newRoleState)
        });

        loadUsers();
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Panel de Administración</h1>

            {/* ===================================================
                1. GESTIÓN DE PRODUCTOS 
            =================================================== */}
            <h2 className="section-title">Gestión de Productos</h2>

            <div className="product-grid">
                {products.map((p) => (
                    <div key={p.id} className="product-card">
                        <img src={p.imageUrl || "/placeholder.jpg"} className="product-img" />

                        <div className="product-info">
                            <h3>{p.name}</h3>
                            <p>Precio: ${p.price}</p>
                            <p>Stock: {p.stock}</p>
                            <p>Vendedor: {p.sellerName}</p>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={() => {
                                setEditingProduct(p);
                                setPreview(p.imageUrl);
                            }}
                        >
                            Editar
                        </button>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDICIÓN */}
            {editingProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar Producto</h2>

                        <input
                            className="input"
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, name: e.target.value })
                            }
                        />

                        <input
                            className="input"
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, price: e.target.value })
                            }
                        />

                        <input
                            className="input"
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, stock: e.target.value })
                            }
                        />

                        <input className="input" type="file" onChange={handleImage} />

                        {preview && <img className="edit-preview" src={preview} />}

                        <div className="modal-buttons">
                            <button className="btn-primary" onClick={saveProductChanges}>
                                Guardar
                            </button>
                            <button
                                className="btn-danger"
                                onClick={() => {
                                    setEditingProduct(null);
                                    setPreview(null);
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================================================
                2. GESTIÓN DE USUARIOS
            =================================================== */}
            <h2 className="section-title">Gestión de Usuarios</h2>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.isAdmin ? "Admin" : u.isVendedor ? "Vendedor" : "Comprador"}</td>
                            <td>{u.isActive ? "Activo" : "Suspendido"}</td>
                            <td>
                                <button
                                    className="btn-small"
                                    onClick={() => toggleUserActive(u.id, u.isActive)}
                                >
                                    {u.isActive ? "Suspender" : "Activar"}
                                </button>

                                <button
                                    className="btn-small"
                                    onClick={() => toggleUserRole(u)}
                                >
                                    Cambiar Rol
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
