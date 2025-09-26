import Navbar from "./components/navbar/navbar.jsx";
import './components/navbar/navbar.css'
import Productos from "./components/producto/Productos.jsx";
import HeroHeader from "./components/home/header/heroHeader.jsx";

function App() {

  return (
    <>
        <Navbar/>
        <HeroHeader/>
        <Productos/>
    </>
  )
}

export default App
