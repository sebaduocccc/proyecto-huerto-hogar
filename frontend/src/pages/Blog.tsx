import { Link } from "react-router-dom";

export default function Blog() {
    return (
        <>
            <h1>Bienvenid@ a nuestro blog</h1>
            <p className="text-muted my-3">
                Acá podras ver nuestras recomendaciones y noticias sobre alimentacion y sostenibilidad
            </p>
            
            <div className="card mx-auto py-2 col-md-3 my-3 text-center">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <Link to="/blog/alimentacion-saludable" className="nav-link active " aria-current="page">
                            Alimentacion Saludable
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/blog/sostenibilidad" className="nav-link active " aria-current="page">
                            Sostenibilidad
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
}