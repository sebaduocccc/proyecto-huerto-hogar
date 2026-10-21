import { Link } from "react-router-dom";

export default function PagoIncorrecto(){
return(
    <>
        <section className="mx-auto" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4">
                <h1 className="fw-bold">Pago incorrecto</h1>
                <p className="lead mb-1">Hubo un error al procesar el pago.</p>
                <p className="text-secondary">
                    Por favor, verifica los datos de tu tarjeta e intenta nuevamente.
                </p>
            </div>
        </section>
        <Link to="/carrito/pago" className="btn btn-primary d-block mx-auto" style={{ maxWidth: '200px' }}>
            Volver a intentar
        </Link>
    
    
    </>
);
}