export default function Login(){
    return(

        <div className="container py-5">
            <div className="row justify-content-center text-center">
                <div className="card menu-login d-flex justify-content-center align-items-center min-vh-50">
                    <div className="card-body">

                        <div className="mb-5"><h2 className="card-title">Iniciar Sesión</h2></div>
                        
                        <form action="" id="form-login">

                            <div className="mb-5">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" id="email"/>
                            </div>

                            <div className="mb-1">
                                <label className="form-label">Contraseña</label>
                                <input type="password" className="form-control" id="password"/>
                                <div className="form-text">No compartas tu contraseña con nadie.</div>
                            </div>

                            <div className="mb-2">
                                <a href="register" className="card-link">¿No tienes cuenta? Registrate</a>
                            </div>

                            <div className="mb-5 form-check d-flex justify-content-center gap-2">
                                <input type="checkbox" className="form-check-input" id="check1"/>
                                <label className="form-check-label">Recordar</label>
                            </div>

                            <button type="submit" className="btn btn-primary mb-3">Iniciar Sesión</button>
                        </form>

                    
                        
                    </div>
                </div>
            </div>
    </div>
    );
}