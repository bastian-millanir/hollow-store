import {Link} from "react-router-dom";
import "./navbar.css"

function Navbar() {
    return (
        <>
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <div className="container-fluid d-flex justify-content-center">

                    <button className="navbar-toggler d-lg-none me-auto" type="button" data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="d-none d-lg-flex align-items-center text-center">
                        <Link id="contacto-nav" className="nav-link px-3" to="/contacto">Contacto</Link>
                        <Link id="about-nav" className="nav-link px-3" to="/about">Quienes somos</Link>
                        <Link id="logo-brand-nav" className="navbar-brand mx-3" to="/">Sleepy Hollow</Link>
                        <Link id="registro-nav" className="nav-link px-3" to="/registro">Registro</Link>
                        <Link id="login-nav" className="nav-link px-3" to="/login">Login</Link>
                    </div>

                    <div className="d-lg-none flex-grow-1 text-center">
                        <Link id="logo-brand-nav-mobile" className="navbar-brand" to="/">Sleepy Hollow</Link>
                    </div>

                </div>

                <div className="offcanvas offcanvas-start bg-dark text-white d-lg-none" tabIndex="-1"
                     id="offcanvasNavbar"
                     aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <Link id="contacto-nav-mobile" className="nav-link" to="/contacto">Contacto</Link>
                            </li>
                            <li className="nav-item">
                                <Link id="about-nav-mobile" className="nav-link" to="/about">Quienes somos</Link>
                            </li>
                            <li className="nav-item">
                                <Link id="registro-nav-mobile" className="nav-link" to="/registro">Registro</Link>
                            </li>
                            <li className="nav-item">
                                <Link id="login-nav-mobile" className="nav-link" to="/login">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar;