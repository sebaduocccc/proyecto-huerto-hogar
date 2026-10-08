import '../App.css';

function Navbar(){
    return(
        <header className="sticky-top bg-white shadow-sm">
        <nav className="navbar navbar-expand-lg navbar-light container">
            <a className="navbar-brand fw-bold" href="index.html">HUERTO HOGAR</a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
                    <li className="nav-item">
                        <a className="nav-link active" href="index.html">Inicio</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="productos.html">Productos</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link" href="nosotros.html">Nosotros</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="blog.html">Blogs</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="contacto.html">Contacto</a>
                    </li>
                    <li className="nav-item ms-lg-2">
                        <a href="carrito.html">
                            <button className="btn btn-outline-emerald d-flex align-items-center gap-2" type="button">
                                <i className="fa-solid fa-cart-shopping"></i>Carrito
                            </button>
                        </a>
                    </li>   
                    <li className="nav-item d-none" id="menu-invitado">                        
                        <a href="login.html"><button className="btn btn-primary">Ingresar</button></a>
                    </li>

                    <li className="nav-item d-none" id="menu-usuario">
                        <div className="dropdown">
                            <a className="btn dropdown-toggle d-flex align-items-center" href="#" role="button" id="imageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    Mi Cuenta
                            </a>

                            <ul className="dropdown-menu" aria-labelledby="imageDropdown">
                                <li><a href="perfil.html" className="dropdown-item">Mi Perfil</a></li>
                                <li><a href="#" className="dropdown-item" id="cerrar-sesion">Cerrar Sesión</a></li>
                            </ul>
                            </div>
                    </li>

                </ul>
            </div>
        </nav>
    </header>

    );
}

export default Navbar;