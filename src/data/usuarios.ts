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
};

export type NuevoUsuario = Omit<Usuario, "id">;

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

export function registrarUsuario(datos: NuevoUsuario): Resultado {
    const usuarios = obtenerUsuarios();
    const email = datos.email.trim().toLowerCase();

    if (usuarios.some((u) => u.email === email)) {
        return { ok: false, msg: "Ya existe ese correo." };
    }

    usuarios.push({ ...datos, email, id: generarId() });
    guardarUsuarioDB(usuarios);

    return { ok: true, msg: "Cuenta creada con exito." };
}
