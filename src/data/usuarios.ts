export type Usuario = {
    id: string;
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    direccion: string;
    comuna: string;
    region: string;
    rut: string;
    fechaNacimiento: string;
    rol: string; // "admin" o "usuario"
};

export type NuevoUsuario = Omit<Usuario, "id" | "rol">;

export type Resultado = {
    ok: boolean;
    msg: string;
};

const CLAVE_USUARIOS = "phuertohogar_usuarios";

function generarId(): string {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function obtenerUsuarios(): Usuario[] {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS) ?? "[]") as Usuario[];
    } catch (error) {
        console.log("datos corruptos en el storage " + error);
        return [];
    }
}

export function guardarUsuarioDB(usuarios: Usuario[]): void {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    console.log('usuario guardado: ' + JSON.stringify(usuarios));
}

export function registrarUsuario(datos: NuevoUsuario, rol: string = "usuario"): Resultado {
    const usuarios = obtenerUsuarios();
    const email = datos.email.trim().toLowerCase();

    if (usuarios.some((u) => u.email === email)) {
        return { ok: false, msg: "Ya existe ese correo." };
    }

    usuarios.push({ ...datos, email, id: generarId(), rol: rol });
    guardarUsuarioDB(usuarios);

    return { ok: true, msg: "Cuenta creada con exito." };
}

// crea el usuario admin si no existe, se llama al iniciar la pagina en main.tsx
export function crearAdminPorDefecto(): void {
    const usuarios = obtenerUsuarios();

    if (usuarios.some((u) => u.email === "admin@huertohogar.cl")) {
        return;
    }

    usuarios.push({
        id: generarId(),
        nombre: "Administrador",
        email: "admin@huertohogar.cl",
        password: "admin",
        telefono: "",
        direccion: "",
        comuna: "",
        region: "",
        rut: "",
        fechaNacimiento: "",
        rol: "admin"
    });
    guardarUsuarioDB(usuarios);
}

const CLAVE_SESION = "phuertohogar_session";

export function iniciarSesion(email: string, password: string, recordar: boolean): Resultado {
    const usuarios = obtenerUsuarios();
    const correo = email.trim().toLowerCase();

    const usuario = usuarios.find((u) => u.email === correo && u.password === password);

    if (!usuario) {
        return { ok: false, msg: "Correo o contraseña incorrecta." };
    }

    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);

    // si marca recordar se guarda en localStorage, si no en sessionStorage
    if (recordar) {
        localStorage.setItem(CLAVE_SESION, usuario.id);
    } else {
        sessionStorage.setItem(CLAVE_SESION, usuario.id);
    }

    return { ok: true, msg: "Iniciaste sesion correctamente." };
}

export function obtenerIdSesion(): string | null {
    return localStorage.getItem(CLAVE_SESION) ?? sessionStorage.getItem(CLAVE_SESION);
}

export function obtenerUsuarioActual(): Usuario | null {
    const id = obtenerIdSesion();
    if (!id) return null;

    return obtenerUsuarios().find((u) => u.id === id) || null;
}

export function cerrarSesion(): void {
    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);
}

export function guardarCambioUsuario(usuarioEditado: Usuario): Resultado {
    const usuarios = obtenerUsuarios();

    const indice = usuarios.findIndex((u) => u.id === usuarioEditado.id);

    if (indice === -1) {
        return { ok: false, msg: "No se encontró al usuario" };
    }

    usuarios[indice] = usuarioEditado;
    guardarUsuarioDB(usuarios);

    return { ok: true, msg: "Perfil actualizado" };
}

export function eliminarUsuario(id: string): void {
    const usuarios = obtenerUsuarios();
    guardarUsuarioDB(usuarios.filter((u) => u.id !== id));
}
