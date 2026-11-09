import { Link } from "react-router-dom";
import { useState } from "react";
import { regiones } from "../data/ubicaciones";
import { obtenerUsuarios, registrarUsuario, guardarCambioUsuario, eliminarUsuario, obtenerIdSesion } from "../data/usuarios";
import type { Usuario } from "../data/usuarios";

type FormState = {
    nombre: string;
    email: string;
    rol: string;
    password: string;
    password2: string;
    rut: string;
    telefono: string;
    fechaNacimiento: string;
    region: string;
    comuna: string;
    direccion: string;
};

const emptyForm: FormState = {
    nombre: "", email: "", rol: "", password: "", password2: "", rut: "", telefono: "",
    fechaNacimiento: "", region: regiones[0].region, comuna: regiones[0].comunas[0], direccion: "",
};

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>(() => obtenerUsuarios());
    const [form, setForm] = useState<FormState>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);

    const isEditing = editingId !== null;
    const idSesion = obtenerIdSesion();

    const comunas = regiones.find(r => r.region === form.region)?.comunas ?? [];

    const refresh = () => setUsuarios(obtenerUsuarios());

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // si cambia la region se pone la primera comuna de esa region
        if (name === "region") {
            const primeraComuna = regiones.find(r => r.region === value)?.comunas[0] ?? "";
            setForm((f) => ({ ...f, region: value, comuna: primeraComuna }));
            return;
        }

        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.password !== form.password2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // al editar se puede dejar la contraseña en blanco
        if ((!isEditing || form.password !== "") && form.password.length < 4) {
            alert("La contraseña debe tener al menos 4 caracteres.");
            return;
        }

        const email = form.email.trim().toLowerCase();

        if (isEditing) {
            const usuarioViejo = usuarios.find((u) => u.id === editingId);
            if (!usuarioViejo) return;

            if (usuarios.some((u) => u.email === email && u.id !== editingId)) {
                alert("El correo ya esta en uso.");
                return;
            }

            guardarCambioUsuario({
                ...usuarioViejo,
                nombre: form.nombre.trim(),
                email: email,
                rol: form.rol,
                password: form.password === "" ? usuarioViejo.password : form.password,
                rut: form.rut.trim(),
                telefono: form.telefono.trim(),
                fechaNacimiento: form.fechaNacimiento,
                region: form.region,
                comuna: form.comuna,
                direccion: form.direccion.trim(),
            });
        } else {
            const resultado = registrarUsuario({
                nombre: form.nombre.trim(),
                email: email,
                password: form.password,
                rut: form.rut.trim(),
                telefono: form.telefono.trim(),
                fechaNacimiento: form.fechaNacimiento,
                region: form.region,
                comuna: form.comuna,
                direccion: form.direccion.trim(),
            }, form.rol);

            if (!resultado.ok) {
                alert(resultado.msg);
                return;
            }
        }

        resetForm();
        refresh();
        alert(isEditing ? "Usuario actualizado correctamente." : "Usuario creado correctamente.");
    };

    const handleEdit = (u: Usuario) => {
        setEditingId(u.id);
        setForm({
            nombre: u.nombre,
            email: u.email,
            rol: u.rol === "admin" ? "admin" : "usuario",
            password: "",
            password2: "",
            rut: u.rut,
            telefono: u.telefono,
            fechaNacimiento: u.fechaNacimiento,
            region: u.region || regiones[0].region,
            comuna: u.comuna || regiones[0].comunas[0],
            direccion: u.direccion,
        });
    }

    const handleDelete = (u: Usuario) => {
        if (u.id === idSesion) {
            alert("No puedes eliminar el usuario con el que iniciaste sesión.");
            return;
        }
        if (!confirm(`¿Eliminar al usuario ${u.nombre || u.email}?`)) return;
        eliminarUsuario(u.id);
        if (editingId === u.id) resetForm();
        refresh();
    }

    // muestra "--" si el campo esta vacio
    const mostrar = (valor: string) => {
        return valor ? valor : "--";
    }

    return (
        <>
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold">Gestión de Usuarios</h1>
                    <Link to="/" className="btn btn-outline-secondary">Volver a la Tienda</Link>
                </div>

                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    {isEditing ? "Editar Usuario" : "Crear Usuario"}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label small fw-bold">Nombre Completo</label>
                                        <input id="nombre" name="nombre" type="text" className="form-control" placeholder="Nombre" required
                                            value={form.nombre} onChange={handleChange}/>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label small fw-bold">Correo</label>
                                        <input id="email" name="email" type="email" className="form-control" placeholder="john_doe@correo.com" required
                                            value={form.email} onChange={handleChange}/>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="rol" className="form-label small fw-bold">Rol</label>
                                        <select id="rol" name="rol" className="form-select" required
                                            value={form.rol} onChange={handleChange}>
                                            <option value="" disabled>Selecciona un rol</option>
                                            <option value="usuario">Usuario Común</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label small fw-bold">Contraseña</label>
                                        <input id="password" name="password" type="password" className="form-control" placeholder="•••••••••••••••"
                                            value={form.password} onChange={handleChange}/>
                                        <div className="form-text">
                                            {isEditing ? "Déjala en blanco para mantener la contraseña actual." : "Mínimo 4 caracteres."}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password2" className="form-label small fw-bold">Confirmar Contraseña</label>
                                        <input id="password2" name="password2" type="password" className="form-control" placeholder="•••••••••••••••"
                                            value={form.password2} onChange={handleChange}/>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="rut" className="form-label small fw-bold">RUT</label>
                                        <input id="rut" name="rut" type="text" className="form-control" placeholder="12.345.678-9"
                                            value={form.rut} onChange={handleChange}/>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label small fw-bold">Telefono</label>
                                        <input id="telefono" name="telefono" type="text" className="form-control" placeholder="+56 9 1234 5678"
                                            value={form.telefono} onChange={handleChange}/>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="fechaNacimiento" className="form-label small fw-bold">Fecha de Nacimiento</label>
                                        <input id="fechaNacimiento" name="fechaNacimiento" type="date" className="form-control"
                                            value={form.fechaNacimiento} onChange={handleChange}/>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="region" className="form-label small fw-bold">Región</label>
                                        <select id="region" name="region" className="form-select"
                                            value={form.region} onChange={handleChange}>
                                            {regiones.map(r => (
                                                <option key={r.region} value={r.region}>{r.region}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="comuna" className="form-label small fw-bold">Comuna</label>
                                        <select id="comuna" name="comuna" className="form-select"
                                            value={form.comuna} onChange={handleChange}>
                                            {comunas.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="direccion" className="form-label small fw-bold">Dirección</label>
                                        <input id="direccion" name="direccion" type="text" className="form-control" placeholder="Pacotilla #288"
                                            value={form.direccion} onChange={handleChange}/>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            {isEditing ? "Actualizar Usuario" : "Guardar Usuario"}
                                        </button>
                                        {isEditing && (
                                            <button type="button" className="btn btn-outline-danger" onClick={resetForm}>
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Base de Datos de Usuarios</h5>
                                <span className="badge text-bg-secondary">
                                    {usuarios.length === 1 ? "1 usuario" : `${usuarios.length} usuarios`}
                                </span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Id</th>
                                            <th>Nombre Completo</th>
                                            <th>Correo</th>
                                            <th>Rut</th>
                                            <th>Telefono</th>
                                            <th>Direccion</th>
                                            <th>Fecha de Nacimiento</th>
                                            <th>Rol</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-muted py-4">
                                                    No hay usuarios registrados en el sistema.
                                                </td>
                                            </tr>
                                        ) : (
                                            usuarios.map((u) => (
                                                <tr key={u.id}>
                                                    <td><code className="small" title={u.id}>{u.id.slice(0, 8)}</code></td>
                                                    <td className="fw-semibold">{mostrar(u.nombre)}</td>
                                                    <td className="text-body-secondary">{mostrar(u.email)}</td>
                                                    <td>{mostrar(u.rut)}</td>
                                                    <td>{mostrar(u.telefono)}</td>
                                                    <td>{mostrar([u.direccion, u.comuna, u.region].filter(Boolean).join(", "))}</td>
                                                    <td>{mostrar(u.fechaNacimiento)}</td>
                                                    <td>
                                                        <span className={u.rol === "admin" ? "badge text-bg-success" : "badge text-bg-secondary"}>
                                                            {u.rol === "admin" ? "Administrador" : "Usuario Común"}
                                                        </span>
                                                    </td>
                                                    <td className="text-end text-nowrap">
                                                        <button
                                                            className="btn btn-sm btn-primary me-1"
                                                            onClick={() => handleEdit(u)}
                                                        >Editar</button>
                                                        <button
                                                            className="btn btn-sm btn-danger me-1"
                                                            onClick={() => handleDelete(u)}
                                                            disabled={u.id === idSesion}
                                                        >Eliminar</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
