import {
    obtenerUsuarios, registrarUsuario, crearAdminPorDefecto, iniciarSesion,
    obtenerUsuarioActual, cerrarSesion, guardarCambioUsuario, eliminarUsuario
} from "./usuarios";

const datosPrueba = {
    nombre: "Rodridovich",
    email: "juan@bluexpress.cl",
    password: "1234",
    telefono: "+56 9 1111 2222",
    direccion: "Manuela Montes #666",
    comuna: "Santiago",
    region: "Región Metropolitana de Santiago",
    rut: "11.111.111-1",
    fechaNacimiento: "2000-01-01",
};

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
});

it("no hay usuarios si el storage esta vacio", () => {
    expect(obtenerUsuarios()).toEqual([]);
});

it("devuelve una lista vacia si los datos estan corruptos", () => {
    localStorage.setItem("phuertohogar_usuarios", "esto no es json");
    expect(obtenerUsuarios()).toEqual([]);
});

it("registra un usuario con rol usuario", () => {
    const resultado = registrarUsuario(datosPrueba);

    expect(resultado.ok).toBe(true);
    expect(obtenerUsuarios().length).toBe(1);
    expect(obtenerUsuarios()[0].rol).toBe("usuario");
});

it("guarda el correo en minusculas", () => {
    registrarUsuario({ ...datosPrueba, email: "  JUAN@Correo.CL " });
    expect(obtenerUsuarios()[0].email).toBe("juan@correo.cl");
});

it("no deja registrar un correo repetido", () => {
    registrarUsuario(datosPrueba);
    const resultado = registrarUsuario(datosPrueba);

    expect(resultado.ok).toBe(false);
    expect(obtenerUsuarios().length).toBe(1);
});

it("crea el admin por defecto solo una vez", () => {
    crearAdminPorDefecto();
    crearAdminPorDefecto();

    const admins = obtenerUsuarios().filter((u) => u.email === "admin@huertohogar.cl");
    expect(admins.length).toBe(1);
    expect(admins[0].rol).toBe("admin");
});

it("inicia sesion con datos correctos", () => {
    registrarUsuario(datosPrueba);
    const resultado = iniciarSesion("juan@bluexpress.cl", "1234", false);

    expect(resultado.ok).toBe(true);
    expect(obtenerUsuarioActual()?.nombre).toBe("Rodridovich");
});

it("no inicia sesion con contraseña incorrecta", () => {
    registrarUsuario(datosPrueba);
    const resultado = iniciarSesion("juan@bluexpress.cl", "mala", false);

    expect(resultado.ok).toBe(false);
    expect(obtenerUsuarioActual()).toBeNull();
});

it("con recordar guarda la sesion en localStorage y sin recordar en sessionStorage", () => {
    registrarUsuario(datosPrueba);

    iniciarSesion("juan@bluexpress.cl", "1234", true);
    expect(localStorage.getItem("phuertohogar_session")).not.toBeNull();
    expect(sessionStorage.getItem("phuertohogar_session")).toBeNull();

    iniciarSesion("juan@bluexpress.cl", "1234", false);
    expect(localStorage.getItem("phuertohogar_session")).toBeNull();
    expect(sessionStorage.getItem("phuertohogar_session")).not.toBeNull();
});

it("cierra la sesion", () => {
    registrarUsuario(datosPrueba);
    iniciarSesion("juan@bluexpress.cl", "1234", true);
    cerrarSesion();

    expect(obtenerUsuarioActual()).toBeNull();
});

it("actualiza los datos de un usuario", () => {
    registrarUsuario(datosPrueba);
    const usuario = obtenerUsuarios()[0];

    const resultado = guardarCambioUsuario({ ...usuario, nombre: "Juan Editado" });

    expect(resultado.ok).toBe(true);
    expect(obtenerUsuarios()[0].nombre).toBe("Juan Editado");
});

it("no actualiza un usuario que no existe", () => {
    registrarUsuario(datosPrueba);
    const usuario = obtenerUsuarios()[0];

    const resultado = guardarCambioUsuario({ ...usuario, id: "no-existe" });
    expect(resultado.ok).toBe(false);
});

it("elimina un usuario", () => {
    registrarUsuario(datosPrueba);
    const usuario = obtenerUsuarios()[0];

    eliminarUsuario(usuario.id);
    expect(obtenerUsuarios().length).toBe(0);
});
