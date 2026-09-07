document.addEventListener("DOMContentLoaded",() => {


    const menuInvitado = document.getElementById('menu-invitado');
    const menuUsuario = document.getElementById('menu-usuario');

    if (!menuInvitado || !menuUsuario) return;

    const usuario = obtenerUsuarioActual();

    if(usuario){
        menuUsuario.classList.remove('d-none');
        
        const btnSalir = document.getElementById('cerrar-sesion');
        
        if (btnSalir){
            btnSalir.addEventListener('click', (e) => {
                e.preventDefault();
                cerrarSesion();
            });
        }
    } else {
        menuInvitado.classList.remove('d-none');
    }

});