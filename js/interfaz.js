function mostrarMensaje(titulo,mensaje){
    console.log(titulo + " " + mensaje);

    document.getElementById('titulo-modal').textContent = titulo;
    document.getElementById('mensaje-modal').textContent = mensaje;

    const miModal = new bootstrap.Modal(document.getElementById('modal1'));
    miModal.show();
}