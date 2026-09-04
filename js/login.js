// Constantes
const CLAVE_USUARIOS = "phuertohogar_usuarios";
const formularioLogin = document.getElementById('form-login');


// funciones




// Documento cargado
document.addEventListener("DOMContentLoaded", () => {
    
    

    formularioLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const recordar = recordarSesionBoton();
        
        iniciarSesion({email,password,recordar});
        
    });

});