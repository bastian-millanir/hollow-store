import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar.jsx";
import './components/navbar/navbar.css';
import HeroHeader from "./components/home/header/heroHeader.jsx";
import Form from "./components/form/form.jsx";
import './App.css';
import Footer from "./components/footer/Footer.jsx";
import AuthProvider from "./Context/Authcontext.jsx";

import Home from "./Pages/Home.jsx";
import Productos from "./Pages/Productos.jsx";
import Registro from "./Pages/Registro.jsx";
import Login from "./Pages/Login.jsx";
import Perfil from "./Pages/Perfil.jsx";
import VendedorPanel from "./Pages/VendedorPanel.jsx";
import PerfilAdmin from "./Pages/PerilAdmin.jsx"; // conservar nombre de archivo existente

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
                    <Navbar/>

                    <main style={{flex: 1}}>
                        <Routes>
                            <Route path="/" element={<><HeroHeader/><Home/></>}/>
                            <Route path="/productos" element={<Productos/>}/>
                            <Route path="/contacto" element={<Form/>}/>
                            <Route path="/about" element={<Home/>}/> {/* placeholder si no existe página About */}
                            <Route path="/registro" element={<Registro/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/perfil" element={<Perfil/>}/>
                            <Route path="/vendedor" element={<VendedorPanel/>}/>
                            <Route path="/admin" element={<PerfilAdmin/>}/>
                        </Routes>
                    </main>

                    <Footer/>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}