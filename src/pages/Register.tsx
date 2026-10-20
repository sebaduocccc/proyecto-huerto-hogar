import { use, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { regiones } from "../data/ubicaciones";


const registarUsuario = () => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rut, setRut] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');

}

export default function Register(){
    const [region, setRegion] = useState(regiones[0].region);
    const [comuna, setComuna] = useState(regiones[0].comunas[0]);

    const comunas = regiones.find(r => r.region === region)?.comunas ?? [];

    // Al cambiar de región se selecciona la primera comuna de la nueva región
    const cambiarRegion = (nuevaRegion: string) => {
        setRegion(nuevaRegion);
        setComuna(regiones.find(r => r.region === nuevaRegion)?.comunas[0] ?? '');
    };

    return(
        <div className="container py-2">
            <div className="row justify-content-center">
                <div className="card menu-sesion text-center">
                    <div className="card-body">

                        <div className="mb-5"><h2 className="card-title">Registro</h2></div>
                        
                        <form action="" id="form-registro">

                            <div className="mb-3">
                                <label className="form-label">Nombre Completo</label>
                                <input type="text" className="form-control" placeholder="Nombre" id="name" name="nombre"/>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" placeholder="john_doe@correo.cl" id="mail" name="correo"/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input type="password" className="form-control" placeholder="•••••••••••••••" id="password1" name="password1"/>
                                <div className="form-text">Asegurate de crear una contraseña segura.</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirmar Contraseña</label>
                                <input type="password" className="form-control" placeholder="•••••••••••••••" id="password2" name="password2"/>
                                <div className="form-text"></div>
                            </div>

                            <div className="mb-2">
                                <div className="alert alert-danger">Las contraseñas deben coincidir</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Telefono</label>
                                <input type="text" className="form-control" placeholder="+56 9 1234 5678" id="phone" name="telefono"/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">RUT</label>
                                <input type="text" className="form-control" placeholder="12.345.678-9" id="rut"/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Fecha de Nacimiento</label>
                                <input type="date" className="form-control" id="fechaNac"/>
                            </div>

                            <div className="row mb-3">
                                <label className="form-label">Direccion</label>
                                <div className="col-6">
                                    <select name="region" id="region" className="form-select" value={region} onChange={e => cambiarRegion(e.target.value)}>
                                        {regiones.map(r => (
                                            <option key={r.region} value={r.region}>{r.region}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <select name="comuna" id="comuna" className="form-select" value={comuna} onChange={e => setComuna(e.target.value)}>
                                        {comunas.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                
                            </div>
                            <input type="text" placeholder="Calle" className="form-control mb-3" id="address" name="direccion"/>

                            

                            

                            <button type="submit" className="btn btn-primary mb-3">Registrarme</button>
                        </form>

                    
                        <div className="mb-5">
                            <a href="/login" className="card-link">¿Ya tienes cuenta? Inicia sesión acá</a>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    );
}