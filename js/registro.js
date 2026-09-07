// constantes
const CLAVE_USUARIOS = "phuertohogar_usuarios";
const formularioRegistro = document.getElementById('form-registro');

// interaccion css




// funciones






document.addEventListener("DOMContentLoaded",() => {

    formularioRegistro.addEventListener('submit', (e) => {

    e.preventDefault(); // evitar que el formulario recargue la pagina

    const nombreUser = document.getElementById("name").value.trim();
    const correoUser = document.getElementById("mail").value.trim().toLowerCase();
    const passwordUser = document.getElementById("password1").value;
    const password2User = document.getElementById("password2").value;
    const telefonoUser = document.getElementById("phone").value;
    const direccionUser = crearDireccion();
    
    
    if(passwordUser !== password2User){
        mostrarMensaje('error','las contraseñas no coinciden.');
        return;
    }

    const exito = registrarUsuario({
        nombre: nombreUser,
        email: correoUser,
        password:passwordUser,
        telefono:telefonoUser,
        direccion: direccionUser});
    });

    
});