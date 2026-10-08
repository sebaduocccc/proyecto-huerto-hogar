// Constantes
const formularioLogin = document.getElementById('form-login');


// funciones




// Documento cargado
document.addEventListener("DOMContentLoaded", () => {
    
    

    formularioLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const recordar = recordarSesionBoton();
        
        const resultado = iniciarSesion({email,password,recordar});

        if (!resultado.ok){
            mostrarMensaje('Error', resultado.msg);
            return;
        }

        location.href = "index.html";
        
    });

});
