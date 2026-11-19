import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mensajeError } from "../data/api";

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setEnviando(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            // ej: "Correo o contraseña incorrectos" o "No se pudo conectar con el servidor."
            setError(mensajeError(err));
        } finally {
            setEnviando(false);
        }
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

                            <div className="mb-5">
                                <Link to="/register" className="card-link">¿No tienes cuenta? Registrate</Link>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <button type="submit" className="btn btn-primary mb-3" disabled={enviando}>
                                {enviando ? "Ingresando..." : "Iniciar Sesión"}
                            </button>
                        </form>



                    </div>
                </div>
            </div>
    </div>
    );
}
