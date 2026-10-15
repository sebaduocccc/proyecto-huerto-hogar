import { Link } from "react-router-dom";


export default function Home() {
    return (
        <>
            <section className="hero mb-5 bg-light p-4 p-lg-5 shadow-sm">
                <div className="row align-items-center g-4 px-md-5">
                    <div className="col-lg-6 text-center text-lg-start order-2 order-lg-1">
                        <h1 className="display-5 fw-bold">Huerto Hogar</h1>
                        <p className="lead">Revisa nuestros productos de temporada</p>
                        <a href="productos.html" className="btn btn-primary btn-lg px-4">Ver Productos</a>
                    </div>
                    <div className="col-lg-6 text-center order-1 order-lg-2">
                        <Link to="/productos">
                            <img 
                                src={'src/assets/huerto-hogar.webp'} 
                                className="img-fluid shadow-sm 
                                rounded" alt="Huerto Hogar"
                            />
                        </Link>
                    </div>
                </div>
            </section> 

            <div 
                id="products-catalog" 
                className="row row-cols-1 row-cols-sm2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center mt-3"
            />
        </>
    )
}