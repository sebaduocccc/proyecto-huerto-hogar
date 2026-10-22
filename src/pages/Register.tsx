import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { regiones } from "../data/ubicaciones";
import { registrarUsuario, type Resultado } from "../data/usuarios";
import { validarRut, validarTelefono, validarEmail, calcularEdad } from "../data/validaciones";


export default function Register(){
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rut, setRut] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [region, setRegion] = useState(regiones[0].region);
    const [comuna, setComuna] = useState(regiones[0].comunas[0]);
    const [direccion, setDireccion] = useState('');
    const [mensaje, setMensaje] = useState<Resultado | null>(null);

    const comunas = regiones.find(r => r.region === region)?.comunas ?? [];
    const passwordsDistintas = confirmarPassword !== '' && password !== confirmarPassword;

    // Al cambiar de región se selecciona la primera comuna de la nueva región
    const cambiarRegion = (nuevaRegion: string) => {
        setRegion(nuevaRegion);
        setComuna(regiones.find(r => r.region === nuevaRegion)?.comunas[0] ?? '');
    };

    const limpiarFormulario = () => {
        setNombre('');
        setEmail('');
        setPassword('');
        setConfirmarPassword('');
        setTelefono('');
        setRut('');
        setFechaNacimiento('');
        cambiarRegion(regiones[0].region);
        setDireccion('');
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // evitar que el formulario recargue la pagina

        // comprobaciones antes de registrar
        let error = '';

        if (nombre.trim().length < 3){
            error = 'El nombre debe tener al menos 3 letras.';
        } else if (!validarEmail(email)){
            error = 'El correo no es válido.';
        } else if (password.length < 4){
            error = 'La contraseña debe tener al menos 4 caracteres.';
        } else if (password !== confirmarPassword){
            error = 'Las contraseñas no coinciden.';
        } else if (!validarTelefono(telefono)){
            error = 'El teléfono debe ser +56 9 seguido de 8 dígitos (ej: +56 9 1234 5678).';
        } else if (!validarRut(rut)){
            error = 'El RUT no es válido (ej: 12.345.678-5).';
        } else if (fechaNacimiento === ''){
            error = 'Debes ingresar tu fecha de nacimiento.';
        } else if (calcularEdad(fechaNacimiento) < 18){
            error = 'Debes ser mayor de 18 años para registrarte.';
        } else if (direccion.trim() === ''){
            error = 'Debes ingresar tu dirección.';
        }

        if (error !== ''){
            setMensaje({ ok: false, msg: error });
            return;
        }

        const resultado = registrarUsuario({
            nombre: nombre.trim(),
            email,
            password,
            telefono,
            direccion: direccion.trim(),
            comuna,
            region,
            rut,
            fechaNacimiento
        });

        setMensaje(resultado);
        if (resultado.ok) limpiarFormulario();
    };

    return(
        <div className="container py-2">
            <div className="row justify-content-center">
                <div className="card menu-sesion text-center">
                    <div className="card-body">

                        <div className="mb-5"><h2 className="card-title">Registro</h2></div>

                        <form id="form-registro" onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">Nombre Completo</label>
                                <input type="text" className="form-control" placeholder="Nombre" id="name" name="nombre" value={nombre} onChange={e => setNombre(e.target.value)}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" placeholder="john_doe@correo.cl" id="mail" name="correo" value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input type="password" className="form-control" placeholder="•••••••••••••••" id="password1" name="password1" value={password} onChange={e => setPassword(e.target.value)}/>
                                <div className="form-text">Asegurate de crear una contraseña segura.</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirmar Contraseña</label>
                                <input type="password" className="form-control" placeholder="•••••••••••••••" id="password2" name="password2" value={confirmarPassword} onChange={e => setConfirmarPassword(e.target.value)}/>
                                <div className="form-text"></div>
                            </div>

                            {passwordsDistintas && (
                                <div className="mb-2">
                                    <div className="alert alert-danger">Las contraseñas deben coincidir</div>
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Telefono</label>
                                <input type="text" className="form-control" placeholder="+56 9 1234 5678" id="phone" name="telefono" value={telefono} onChange={e => setTelefono(e.target.value)}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">RUT</label>
                                <input type="text" className="form-control" placeholder="12.345.678-9" id="rut" value={rut} onChange={e => setRut(e.target.value)}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Fecha de Nacimiento</label>
                                <input type="date" className="form-control" id="fechaNac" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)}/>
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
                            <input type="text" placeholder="Calle" className="form-control mb-3" id="address" name="direccion" value={direccion} onChange={e => setDireccion(e.target.value)}/>

                            {mensaje && (
                                <div className={`alert ${mensaje.ok ? 'alert-success' : 'alert-danger'}`}>{mensaje.msg}</div>
                            )}

                            <button type="submit" className="btn btn-primary mb-3">Registrarme</button>
                        </form>


                        <div className="mb-5">
                            <Link to="/login" className="card-link">¿Ya tienes cuenta? Inicia sesión acá</Link>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    );
}
