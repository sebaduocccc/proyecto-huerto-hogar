

function mostrarMensaje(titulo,mensaje){
    console.log(titulo + " " + mensaje);

    document.getElementById('titulo-modal').textContent = titulo;
    document.getElementById('mensaje-modal').textContent = mensaje;

    const miModal = new bootstrap.Modal(document.getElementById('modal1'));
    miModal.show();
}

const formularioRegistro = document.getElementById('form-registro');

formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault(); // evitar que el formulario recargue la pagina

    const formularioDatos = new FormData(formularioRegistro);

    const datos = Object.fromEntries(formularioDatos.entries());

    console.log(datos);

    if (datos.password1 !== datos.password2){
        mostrarMensaje('Error','las contraseñas no coinciden.');
        return;
    }
});