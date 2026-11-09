
const CLAVE_USUARIOS = "phuertohogar_usuarios";
const CLAVE_SESION   = "phuertohogar_session";

function probar(){
    console.log(obtenerUsuarios());
}


function recordarSesionBoton(){
    const check = document.getElementById('check1').checked;
    return check;
}

// Devuelve las tres partes por separado para poder editarlas de forma
// independiente en el perfil.
function crearDireccion(){
    return {
        direccion: document.getElementById('address').value.trim(),
        comuna: document.getElementById('comuna').value,
        region: document.getElementById('region').value
    };
}

// Une las partes solo cuando hay que mostrar la direccion completa.
function formatearDireccion({direccion, comuna, region}){
    return [direccion, comuna, region].filter(Boolean).join(", ") + ".";
}

function generarId(){
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function guardarUsuarioDB(usuarios){
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function obtenerUsuarios(){
    try{
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch (error){
        console.log("datos corruptos en el storage " + error);
        return [];
    }
}

function registrarUsuario({nombre, email, password, telefono, direccion, comuna, region, rut, fechaNacimiento}){
    const usuarios = obtenerUsuarios();

    console.log("sampa");
    console.log(usuarios);
    console.log("sampo");

    if(usuarios.some((u) => u.email === email)){
        return { ok: false, msg: "Ya existe ese correo."};
    }
    

    const nuevoUsuario = {
        id: generarId(),
        nombre,
        email,
        password,
        telefono,
        direccion,
        comuna,
        region,
        rut,
        fechaNacimiento
    };  

    usuarios.push(nuevoUsuario); // poner usuario al final de la array
    guardarUsuarioDB(usuarios);

    return {ok: true, msg: "Cuenta creada con exito."};

}


function iniciarSesion({email,password, recordar}){
    const usuarios = obtenerUsuarios();
    const correo = email.trim().toLowerCase();

    const usuario = usuarios.find((u) => u.email === correo && u.password === password);

    if (!usuario){
        return {ok: false, msg: "Correo o contaseña incorrecta."};
    }

    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);

    const almacen = recordar ? localStorage : sessionStorage;
    almacen.setItem(CLAVE_SESION, usuario.id);
    return {ok: true, msg: "iniciaste sesion correctamente"};
}

function obtenerIdSesion() {
    return localStorage.getItem(CLAVE_SESION) ?? sessionStorage.getItem(CLAVE_SESION);
}

function obtenerUsuarioActual() {
    const id = obtenerIdSesion();
    if (!id) return null;

    return obtenerUsuarios().find((u) => u.id === id) || null;
}


function cerrarSesion(){
    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);
    location.href = "login.html";
}

function actualizarPerfil({id_user, ...cambios}){
    const usuarios = obtenerUsuarios();

    
    const indice = usuarios.findIndex((u) => u.id === id_user)

        if(indice === -1){
            return {ok: false, msg: "No se encontró al usuario."};
        }
    

    
        if (cambios.email){
            cambios.email = cambios.email.trim().toLowerCase();

            const correoOcupado = usuarios.some((u) => u.email === cambios.email && u.id !== id_user);

            if(correoOcupado){
                return {ok: false, msg: "el correo ya esta en uso."}
            }
        }


        Object.keys(cambios).forEach((clave) => {
            if (cambios[clave] === undefined || cambios[clave] === ""){
                delete cambios[clave];
            }
        });

        usuarios[indice] = { ...usuarios[indice], ...cambios};

        guardarUsuarioDB(usuarios)

        return {ok: true, msg: "Perfil actualizado.", usuario: usuarios[indice]};
}

function guardarCambioUsuario(usuarioEditado){
    const usuarios = obtenerUsuarios();

    const indice = usuarios.findIndex((u) => u.id === usuarioEditado.id);

    if (indice === -1){
        return {ok: false, msg: "No se encontró a el usuario"}
    }

    usuarios[indice] = usuarioEditado;
    guardarUsuarioDB(usuarios)

    return {ok: true, msg: "Perfil actualizado"}
}