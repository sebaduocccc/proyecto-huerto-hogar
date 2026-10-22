import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../data/usuarios";

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recordar, setRecordar] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const resultado = iniciarSesion(email, password, recordar);

        if (!resultado.ok){
            setError(resultado.msg);
            return;
        }

        navigate("/");
    };

    return(

        <div className="container py-5">
            <div className="row justify-content-center text-center">
                <div className="card menu-login d-flex justify-content-center align-items-center min-vh-50">
                    <div className="card-body">

                        <div className="mb-5"><h2 className="card-title">Iniciar Sesión</h2></div>

                        <form id="form-login" onSubmit={handleSubmit}>

                            <div className="mb-5">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>

                            <div className="mb-1">
                                <label className="form-label">Contraseña</label>
                                <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)}/>
                                <div className="form-text">No compartas tu contraseña con nadie.</div>
                            </div>

                            <div className="mb-2">
                                <Link to="/register" className="card-link">¿No tienes cuenta? Registrate</Link>
                            </div>

                            <div className="mb-5 form-check d-flex justify-content-center gap-2">
                                <input type="checkbox" className="form-check-input" id="check1" checked={recordar} onChange={e => setRecordar(e.target.checked)}/>
                                <label htmlFor="check1" className="form-check-label">Recordar</label>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <button type="submit" className="btn btn-primary mb-3">Iniciar Sesión</button>
                        </form>



                    </div>
                </div>
            </div>
    </div>
    );
}
