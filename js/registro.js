// constantes
const CLAVE_USUARIOS = "phuertohogar_usuarios";
const formularioRegistro = document.getElementById('form-registro');

// interaccion css

function mostrarMensaje(titulo,mensaje){
    console.log(titulo + " " + mensaje);

    document.getElementById('titulo-modal').textContent = titulo;
    document.getElementById('mensaje-modal').textContent = mensaje;

    const miModal = new bootstrap.Modal(document.getElementById('modal1'));
    miModal.show();
}


// funciones

function probar(){
    console.log(obtenerUsuarios());
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

    if (usuarios.some((u) => u.email === email)){
        return {ok: false, msg: "Ya existe una cuenta con ese correo."};
    }

    const nuevoUsuario = {
        id: generarId(),
        nombre: nombre,
        correo: email,
        pass: password,
        fono: telefono,
        direccion: direccion
    }

    usuarios.push(nuevoUsuario); // poner usuario al final de la array
    guardarUsuarioDB(usuarios);

    return {ok: true, msg: "Cuenta creada con exito."};

}




document.addEventListener("DOMContentLoaded",() => {


    formularioRegistro.addEventListener('submit', (e) => {

    e.preventDefault(); // evitar que el formulario recargue la pagina

    const nombreUser = document.getElementById("name").value.trim();
    const correoUser = document.getElementById("mail").value.trim();
    const passwordUser = document.getElementById("password1").value;
    const password2User = document.getElementById("password2").value;
    const telefonoUser = document.getElementById("phone").value;
    const direccionUser = crearDireccion();
    
    
    if(passwordUser.value !== password2User.value){
        mostrarMensaje('error','no coinciden las contraseñas');
    }

    console.log(registrarUsuario(nombreUser,correoUser,passwordUser,telefonoUser,direccionUser));
    
});



});

