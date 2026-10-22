export default function Contacto () {
    return(
        <>
            <div className="card">
                <div className="card-header">
                    Si necesitas ayuda sobre nuestros productos o similar, contactanos por correo!
                </div>

                <div className="card-body">
                    <form name="FormularioContacto" action="/" method="get" >

                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="nombre" 
                                name="nombre" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="correo" className="form-label">Correo electrónico:</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="correo" 
                                name="correo" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="mensaje" className="form-label">Mensaje:</label>
                            <textarea className="form-control" id="mensaje" name="mensaje" rows={4} required />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            </div> 
        </>
    );
}