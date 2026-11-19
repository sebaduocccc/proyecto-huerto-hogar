import { useState } from "react";
import { Navigate } from "react-router-dom";
import { regiones } from "../data/ubicaciones";
import { useAuth } from "../context/AuthContext";
import api, { mensajeError, type UsuarioApi, type Resultado } from "../data/api";

export default function Perfil(){
    // Proteger ya espero a que cargue la sesion, asi que aqui el usuario ya esta listo
    const { usuario, setUsuario } = useAuth();

    // se rellenan los campos con los datos del usuario
    const [nombre, setNombre] = useState(usuario?.nombre ?? '');
    const [rut, setRut] = useState(usuario?.rut ?? '');
    const [fechaNacimiento, setFechaNacimiento] = useState(usuario?.fechaNacimiento ?? '');
    const [telefono, setTelefono] = useState(usuario?.telefono ?? '');
    const [region, setRegion] = useState(usuario?.region || regiones[0].region);
    const [comuna, setComuna] = useState(usuario?.comuna || regiones[0].comunas[0]);
    const [direccion, setDireccion] = useState(usuario?.direccion ?? '');
    const [mensaje, setMensaje] = useState<Resultado | null>(null);
    const [enviando, setEnviando] = useState(false);

    // si no hay sesion lo mandamos al login
    if (!usuario){
        return <Navigate to="/login"/>;
    }

    const comunas = regiones.find(r => r.region === region)?.comunas ?? [];

    const cambiarRegion = (nuevaRegion: string) => {
        setRegion(nuevaRegion);
        setComuna(regiones.find(r => r.region === nuevaRegion)?.comunas[0] ?? '');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEnviando(true);

        try {
            // los campos vacios se mandan como null, si no el backend los rechaza
            // (ej: el admin no tiene rut ni telefono)
            const res = await api.put<UsuarioApi>("/cuenta/perfil", {
                nombre: nombre.trim(),
                rut: rut.trim() || null,
                fechaNacimiento: fechaNacimiento || null,
                telefono: telefono.trim() || null,
                region: region,
                comuna: comuna,
                direccion: direccion.trim() || null
            });

            // se actualiza el usuario del contexto, asi el navbar muestra el nombre nuevo
            setUsuario(res.data);
            setMensaje({ ok: true, msg: "Perfil actualizado" });
        } catch (err) {
            setMensaje({ ok: false, msg: mensajeError(err) });
        } finally {
            setEnviando(false);
        }
    };

    return(
        <div className="container py-5">
            <div className="row justify-content-center text-center">
                <div className="card menu-perfil d-flex justify-content-center align-items-center min-vh-50">
                    <div className="card-body">

                        <div className="mb-5"><h2 className="card-title">Mi Perfil</h2></div>

                        <form id="form-perfil" onSubmit={handleSubmit}>

                            <div className="mb-5">
                                <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                                <input type="text" className="form-control" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)}/>
                            </div>

                            <div className="mb-5">
                                <label htmlFor="rut" className="form-label">RUT</label>
                                <input type="text" className="form-control" id="rut" value={rut} onChange={e => setRut(e.target.value)}/>
                            </div>

                            <div className="mb-5">
                                <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                                <input type="date" className="form-control" id="fechaNacimiento" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)}/>
                            </div>

                            <div className="mb-5">
                                <label htmlFor="telefono" className="form-label">Telefono de Contacto</label>
                                <input type="text" className="form-control" id="telefono" value={telefono} onChange={e => setTelefono(e.target.value)}/>
                            </div>

                            <div className="row mb-3">
                                <label className="form-label">Direccion</label>
                                <div className="col-6">
                                    <select id="region" className="form-select" name="region" value={region} onChange={e => cambiarRegion(e.target.value)}>
                                        {regiones.map(r => (
                                            <option key={r.region} value={r.region}>{r.region}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <select id="comuna" className="form-select" name="comuna" value={comuna} onChange={e => setComuna(e.target.value)}>
                                        {comunas.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <input type="text" placeholder="Calle" className="form-control mb-3" id="address" name="direccion" value={direccion} onChange={e => setDireccion(e.target.value)}/>
                            </div>

                            {mensaje && (
                                <div className={mensaje.ok ? "alert alert-success" : "alert alert-danger"}>{mensaje.msg}</div>
                            )}

                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary" disabled={enviando}>
                                    {enviando ? "Guardando..." : "Actualizar"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
    </div>
    );
}
