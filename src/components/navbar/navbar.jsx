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
                        <a id="contacto-nav" className="nav-link px-3" href="#">Contacto</a>
                        <a id="logo-brand-nav" className="navbar-brand mx-3" href="#">Sleepy Hollow</a>
                        <a id="about-nav" className="nav-link px-3" href="#">Quienes somos</a>
                    </div>

                    <div className="d-lg-none flex-grow-1 text-center">
                        <a id="logo-brand-nav" className="navbar-brand" href="#">Sleepy Hollow</a>
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
                                <a id="contacto-nav-mobile" className="nav-link" href="#">Contacto</a>
                            </li>
                            <li className="nav-item">
                                <a id="about-nav-mobile" className="nav-link" href="#">Quienes somos</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar;