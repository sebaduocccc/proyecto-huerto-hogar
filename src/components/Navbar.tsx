import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { obtenerUsuarioActual, cerrarSesion } from '../data/usuarios';

export default function Navbar(){
    // useLocation hace que el navbar se vuelva a renderizar al cambiar de pagina
    // asi se actualiza despues de iniciar sesion
    useLocation();
    const navigate = useNavigate();

    const usuario = obtenerUsuarioActual();

    const salir = (e: React.MouseEvent) => {
        e.preventDefault();
        cerrarSesion();
        navigate("/login");
    };

    return(
        <header className="sticky-top bg-white shadow-sm">
        <nav className="navbar navbar-expand-lg navbar-light container">
            <a className="navbar-brand fw-bold" href="/">HUERTO HOGAR</a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
                    <li className="nav-item">
                        <Link to="/" className="nav-link active" >
                            Inicio
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="productos" className="nav-link">
                            Productos
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="nosotros" className="nav-link">
                            Nosotros
                        </Link >
                    </li>
                    <li className="nav-item">
                        <Link to="blog" className="nav-link">
                            Blogs
                        </Link >
                    </li>
                    <li className="nav-item">
                        <Link to="contacto" className="nav-link">
                            Contacto
                        </Link >
                    </li>
                    <li className="nav-item ms-lg-2">
                        <Link to="carrito">
                            <button className="btn btn-outline-emerald d-flex align-items-center gap-2" type="button">
                                <i className="fa-solid fa-cart-shopping"></i>Carrito
                            </button>
                        </Link >
                    </li>   
                    {!usuario && (
                    <li className="nav-item" id="menu-invitado">
                        <Link to="login">
                            <button className="btn btn-primary">
                                Ingresar
                            </button>
                        </Link >
                    </li>
                    )}

                    {usuario && (
                    <li className="nav-item" id="menu-usuario">
                        <div className="dropdown">
                            <a className="btn dropdown-toggle d-flex align-items-center" href="#" role="button" id="imageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    Hola, {usuario.nombre}
                            </a>

                            <ul className="dropdown-menu" aria-labelledby="imageDropdown">
                                <li>
                                    <Link to="perfil" className="dropdown-item">
                                        Mi Perfil
                                    </Link >
                                </li>
                                {usuario.rol === "admin" && (
                                <li>
                                    <Link to="/admin" className="dropdown-item">
                                        Panel Admin
                                    </Link >
                                </li>
                                )}
                                <li>
                                    <a href="#" className="dropdown-item" id="cerrar-sesion" onClick={salir}>
                                        Cerrar Sesión
                                    </a>
                                </li>
                            </ul>
                            </div>
                    </li>
                    )}

                </ul>
            </div>
        </nav>
    </header>

    );
}