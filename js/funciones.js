
function probar(){
    console.log(obtenerUsuarios());
}


function recordarSesionBoton(){
    const check = document.getElementById('check1').checked;
    return check;
}

function crearDireccion(){
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;
    const direccion = document.getElementById('address').value.trim();

    return direccion + ", " + comuna + ", " + region + "."
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

function registrarUsuario({nombre, email, password, telefono, direccion}){
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
        direccion
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

    localStorage.removeItem('session');
    sessionStorage.removeItem('session');

    const almacen = recordar ? localStorage : sessionStorage;
    almacen.setItem('session', usuario.id);
    return {ok: true, msg: "iniciaste sesion correctamente"};
}