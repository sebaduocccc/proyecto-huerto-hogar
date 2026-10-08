document.addEventListener("DOMContentLoaded",() => {

    const userData = obtenerUsuarioActual();

    if (!userData){
        location.href = "login.html";
        return;
    }

    const formPerfil = document.getElementById('form-perfil');
    const nombreCompleto = document.getElementById('nombre');
    const rut = document.getElementById('rut');
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const address = document.getElementById('address');
    const selectRegion = document.getElementById('region');
    const selectComuna = document.getElementById('comuna');
    const telefono = document.getElementById('telefono');

    nombreCompleto.value = userData.nombre ?? "";
    rut.value = userData.rut ?? "";
    fechaNacimiento.value = userData.fechaNacimiento ?? "";
    address.value = userData.direccion ?? "";
    telefono.value = userData.telefono ?? "";

    if (userData.region){
        selectRegion.value = userData.region;
        selectRegion.dispatchEvent(new Event('change'));
    }

    if (userData.comuna){
        selectComuna.value = userData.comuna;
    }


    formPerfil.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuarioActual = obtenerUsuarioActual();

        usuarioActual.nombre = nombreCompleto.value;
        usuarioActual.rut = rut.value;
        usuarioActual.fechaNacimiento = fechaNacimiento.value;
        usuarioActual.direccion = address.value;
        usuarioActual.region = selectRegion.value;
        usuarioActual.comuna = selectComuna.value;
        usuarioActual.telefono = telefono.value;

        console.log(usuarioActual);
        
        const resultado = guardarCambioUsuario(usuarioActual);

        mostrarMensaje(resultado.ok ? 'Exito' : 'Error', resultado.msg);

    });

});
