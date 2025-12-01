// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// COMPONENTES GLOBALES
import Navbar from "./components/navbar/navbar.jsx";
import Footer from "./components/footer/Footer.jsx";

// PÁGINAS
import Home from "./Pages/Home.jsx";
import LoginAvanzado from "./pages/LoginAvanzado.jsx";
import RegisterAvanzado from "./pages/RegisterAvanzado.jsx";
import Productos from "./Pages/Productos.jsx";
import Carrito from "./Pages/Carrito.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Autenticación */}
        <Route path="/login" element={<LoginAvanzado />} />
        <Route path="/register" element={<RegisterAvanzado />} />

        {/* Productos */}
        <Route path="/productos" element={<Productos />} />

        {/* Carrito */}
        <Route path="/carrito" element={<Carrito />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
