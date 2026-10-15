import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-top pt-5 pb-4">
            <div className="container"> 
                <div className="row g-4"> 

                    <div className="col-12 col-md-4"> 
                        <h5 className="fw-bold mb-3">HUERTO HOGAR</h5> 
                        <p className="text-secondary small">Tu huerto en casa</p>
                        <div className="d-flex gap-3 payment-icons fs-4 mt-3">
                            <i className="fa-brands fa-cc-visa"></i>
                            <i className="fa-brands fa-cc-mastercard"></i>
                        </div>
                    </div> 

                    <div className="col-6 col-md-3">
                        <h6 className="fw-bold mb-3">Navegación</h6>
                        <ul className="nav flex-column gap-1"> 
                            <li className="nav-item mb-2">
                                <Link to="/" className="nav-link p-0 text-body-secondary">
                                    Home
                                </Link >
                            </li> 
                            <li className="nav-item mb-2">
                                <Link to="productos" className="nav-link p-0 text-body-secondary">
                                    Productos
                                </Link >
                            </li> 
                            <li className="nav-item mb-2">
                                <Link to="nosotros" className="nav-link p-0 text-body-secondary">
                                    Nosotros
                                </Link >
                            </li> 
                            <li className="nav-item mb-2">
                                <Link to="blog" className="nav-link p-0 text-body-secondary">
                                    Blogs
                                </Link >
                            </li> 
                            <li className="nav-item mb-2">
                                <Link to="contacto" className="nav-link p-0 text-body-secondary">
                                    Contacto
                                </Link >
                            </li> 
                        </ul> 
                    </div>                

                    <div className="col-12 col-md-5"> 
                        <form> 
                            <h6 className="fw-bold mb-2">Subscríbete a nuestro boletín</h6> 
                            <p className="text-secondary small mb-3">Recibe noticias de nuevos productos</p> 
                            <div className="d-flex gap-2"> 
                                <input 
                                    id="newsletter1" 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Email address"
                                /> 
                                <button className="btn btn-primary" type="button">
                                    Subscribirse
                                </button> 
                            </div> 
                        </form> 
                    </div> 
                </div> 
                
                <div className="d-flex justify-content-between py-4 my-4 border-top text-secondary small"> 
                    <p className="mb-0">&copy; Ignacio Ponce, Sebastián Saavedra & Cristóbal Spinola | DUOC UC {new Date().getFullYear()}</p> 
                </div>
            </div>
        </footer> 
    );
}
