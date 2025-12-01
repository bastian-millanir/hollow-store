import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/Authcontext";
import "./VendedorPanel.css";

export default function VendedorPanel() {
  const { user } = useContext(AuthContext);

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ============================================
  // Cargar productos desde el backend
  // ============================================
  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/productos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ============================================
  // Subir imagen
  // ============================================
  const uploadImage = async (id) => {
    if (!imageFile) return alert("Seleccione una imagen");

    const formData = new FormData();
    formData.append("imagen", imageFile);

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/productos/${id}/imagen`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (res.ok) {
      alert("Imagen subida correctamente");
      fetchProductos();
    } else {
      alert("Error al subir imagen");
    }
  };

  // ============================================
  // Actualizar producto (nombre, precio, stock)
  // ============================================
  const updateProduct = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/productos/${selectedProduct.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct),
      }
    );

    if (res.ok) {
      alert("Producto actualizado");
      fetchProductos();
      setSelectedProduct(null);
    } else {
      alert("Error al actualizar producto");
    }
  };

  // ============================================
  // Cambiar estado activo/inactivo
  // ============================================
  const toggleEstado = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8080/api/productos/${id}/estado`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProductos();
  };

  if (loading) return <div className="loader">Cargando...</div>;

  return (
    <div className="vendedor-container">
      
      {/* Título y Perfil */}
      <div className="header">
        <h1>Panel de Vendedor</h1>
        <p>Bienvenido, <strong>{user?.name}</strong></p>
      </div>

      {/* Lista de productos */}
      <div className="productos-list">
        <h2>Productos publicados</h2>

        {productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <table className="productos-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    {prod.imagenUrl ? (
                      <img src={prod.imagenUrl} alt="" className="product-img" />
                    ) : (
                      <span className="no-img">Sin imagen</span>
                    )}
                  </td>

                  <td>{prod.nombre}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.stock}</td>

                  <td>
                    <span className={prod.activo ? "activo" : "inactivo"}>
                      {prod.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn editar"
                      onClick={() => setSelectedProduct({ ...prod })}
                    >
                      Editar
                    </button>

                    <button
                      className="btn estado"
                      onClick={() => toggleEstado(prod.id)}
                    >
                      {prod.activo ? "Desactivar" : "Activar"}
                    </button>

                    {/* Subir Imagen */}
                    <input
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />

                    <button
                      className="btn imagen"
                      onClick={() => uploadImage(prod.id)}
                    >
                      Subir Imagen
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal ✏ Editar producto */}
      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">

            <h2>Editar Producto</h2>

            <label>Nombre:</label>
            <input
              type="text"
              value={selectedProduct.nombre}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  nombre: e.target.value,
                })
              }
            />

            <label>Precio:</label>
            <input
              type="number"
              value={selectedProduct.precio}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  precio: Number(e.target.value),
                })
              }
            />

            <label>Stock:</label>
            <input
              type="number"
              value={selectedProduct.stock}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stock: Number(e.target.value),
                })
              }
            />

            <div className="modal-buttons">
              <button className="btn guardar" onClick={updateProduct}>
                Guardar Cambios
              </button>

              <button
                className="btn cancelar"
                onClick={() => setSelectedProduct(null)}
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
