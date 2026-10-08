document.addEventListener("DOMContentLoaded", () => {

    const cuerpoTabla = document.getElementById('admin-table-body');
    const formulario = document.getElementById('user-form');

    if (!cuerpoTabla || !formulario) return;

    const tituloForm = document.getElementById('form-title');
    const contador = document.getElementById('contador-usuarios');
    const btnGuardar = document.getElementById('save-btn');
    const btnCancelar = document.getElementById('cancel-btn');
    const ayudaPassword = document.getElementById('password-help');

    const campoId = document.getElementById('editing-id');
    const campoNombre = document.getElementById('nombre');
    const campoCorreo = document.getElementById('correo');
    const campoRol = document.getElementById('rol');
    const campoPassword = document.getElementById('password');
    const campoPassword2 = document.getElementById('password2');
    const campoRut = document.getElementById('rut');
    const campoTelefono = document.getElementById('telefono');
    const campoFechaNacimiento = document.getElementById('fechaNacimiento');
    const campoRegion = document.getElementById('region');
    const campoComuna = document.getElementById('comuna');
    const campoDireccion = document.getElementById('direccion');

    const usuariosDemo = [
        {
            nombre: "Sebastián Saavedra",
            email: "admin@huertohogar.cl",
            password: "admin123",
            telefono: "+56 9 8765 4321",
            direccion: "Av. Providencia #1234",
            comuna: "Providencia",
            region: "Región Metropolitana de Santiago",
            rut: "12.345.678-9",
            fechaNacimiento: "1995-04-12",
            rol: "admin"
        },
        {
            nombre: "Camila Rojas",
            email: "camila.rojas@correo.com",
            password: "camila123",
            telefono: "+56 9 5544 3322",
            direccion: "Calle Valparaíso #880",
            comuna: "Viña del Mar",
            region: "Valparaíso",
            rut: "17.654.321-0",
            fechaNacimiento: "1999-11-03",
            rol: "usuario"
        },
        {
            nombre: "Matías Fuentes",
            email: "matias.fuentes@correo.com",
            password: "matias123",
            telefono: "+56 9 2211 9900",
            direccion: "Barros Arana #455",
            comuna: "Concepción",
            region: "Región del Biobío",
            rut: "20.111.222-3",
            fechaNacimiento: "2001-06-27",
            rol: "usuario"
        }
    ];

    function sembrarUsuarios(){
        if (localStorage.getItem(CLAVE_USUARIOS)) return;

        guardarUsuarioDB(usuariosDemo.map((u) => ({ id: generarId(), ...u })));
    }

    function escapar(valor){
        return String(valor ?? "").replace(/[&<>"']/g, (c) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[c]);
    }

    function mostrar(valor){
        const texto = String(valor ?? "").trim();
        return texto === "" ? "--" : escapar(texto);
    }

    function nombreRol(rol){
        return rol === "admin" ? "Administrador" : "Usuario Común";
    }

    function direccionUsuario(usuario){
        const tieneDatos = [usuario.direccion, usuario.comuna, usuario.region].some(Boolean);
        return tieneDatos ? formatearDireccion(usuario) : "";
    }

    function guardarUsuario(id, datos){
        if (id) return actualizarPerfil({ id_user: id, ...datos });

        const creado = registrarUsuario(datos);

        if (!creado.ok) return creado;

        const nuevo = obtenerUsuarios().find((u) => u.email === datos.email);

        return actualizarPerfil({ id_user: nuevo.id, rol: datos.rol });
    }

    function renderizarTablas(){
        const usuarios = obtenerUsuarios();
        const idActual = obtenerIdSesion();

        contador.textContent = usuarios.length === 1
            ? "1 usuario"
            : `${usuarios.length} usuarios`;

        if (usuarios.length === 0){
            cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-body-secondary py-4">
                    No hay usuarios registrados en el sistema.
                </td>
            </tr>
            `;
            return;
        }

        cuerpoTabla.innerHTML = usuarios.map((u) => `
            <tr>
                <td><code class="small" title="${escapar(u.id)}">${escapar(String(u.id).slice(0, 8))}</code></td>
                <td class="fw-semibold">${mostrar(u.nombre)}</td>
                <td class="text-body-secondary">${mostrar(u.email)}</td>
                <td>${mostrar(u.rut)}</td>
                <td>${mostrar(u.telefono)}</td>
                <td>${mostrar(direccionUsuario(u))}</td>
                <td>${mostrar(u.fechaNacimiento)}</td>
                <td>
                    <span class="badge ${u.rol === "admin" ? "text-bg-success" : "text-bg-secondary"}">
                        ${nombreRol(u.rol)}
                    </span>
                </td>
                <td class="text-end text-nowrap">
                    <button type="button" class="btn btn-sm btn-outline-primary me-1" data-accion="editar" data-id="${escapar(u.id)}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="${escapar(u.id)}" ${u.id === idActual ? "disabled title='No puedes eliminar tu propia sesión'" : ""}>Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    function reiniciarFormulario(){
        formulario.reset();
        campoId.value = "";
        tituloForm.textContent = "Crear Usuario";
        btnGuardar.textContent = "Guardar Usuario";
        ayudaPassword.textContent = "Mínimo 4 caracteres.";
        btnCancelar.classList.add('d-none');
        campoRegion.dispatchEvent(new Event('change'));
    }

    function editarUsuario(id){
        const usuario = obtenerUsuarios().find((u) => u.id === id);

        if (!usuario){
            mostrarMensaje('Error', 'No se encontró al usuario.');
            renderizarTablas();
            return;
        }

        campoId.value = usuario.id;
        campoNombre.value = usuario.nombre ?? "";
        campoCorreo.value = usuario.email ?? "";
        campoRol.value = usuario.rol === "admin" ? "admin" : "usuario";
        campoPassword.value = "";
        campoPassword2.value = "";
        campoRut.value = usuario.rut ?? "";
        campoTelefono.value = usuario.telefono ?? "";
        campoFechaNacimiento.value = usuario.fechaNacimiento ?? "";
        campoDireccion.value = usuario.direccion ?? "";

        if (usuario.region){
            campoRegion.value = usuario.region;
        }
        campoRegion.dispatchEvent(new Event('change'));

        if (usuario.comuna){
            campoComuna.value = usuario.comuna;
        }

        tituloForm.textContent = "Editar Usuario";
        btnGuardar.textContent = "Actualizar Usuario";
        ayudaPassword.textContent = "Déjala en blanco para mantener la contraseña actual.";
        btnCancelar.classList.remove('d-none');

        formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function eliminarUsuario(id){
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find((u) => u.id === id);

        if (!usuario) return;

        if (id === obtenerIdSesion()){
            mostrarMensaje('Error', 'No puedes eliminar el usuario con el que iniciaste sesión.');
            return;
        }

        if (!confirm(`¿Eliminar al usuario ${usuario.nombre || usuario.email}?`)) return;

        guardarUsuarioDB(usuarios.filter((u) => u.id !== id));

        if (campoId.value === id){
            reiniciarFormulario();
        }

        renderizarTablas();
        mostrarMensaje('Listo', 'Usuario eliminado correctamente.');
    }

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = campoId.value;
        const editando = id !== "";
        const password = campoPassword.value;

        if (password !== campoPassword2.value){
            mostrarMensaje('Error', 'Las contraseñas no coinciden.');
            return;
        }

        if ((!editando || password !== "") && password.length < 4){
            mostrarMensaje('Error', 'La contraseña debe tener al menos 4 caracteres.');
            return;
        }

        const resultado = guardarUsuario(id, {
            nombre: campoNombre.value.trim(),
            email: campoCorreo.value.trim().toLowerCase(),
            password,
            rol: campoRol.value,
            telefono: campoTelefono.value.trim(),
            direccion: campoDireccion.value.trim(),
            comuna: campoComuna.value,
            region: campoRegion.value,
            rut: campoRut.value.trim(),
            fechaNacimiento: campoFechaNacimiento.value
        });

        if (!resultado.ok){
            mostrarMensaje('Error', resultado.msg);
            return;
        }

        reiniciarFormulario();
        renderizarTablas();
        mostrarMensaje('Listo', editando
            ? 'Usuario actualizado correctamente.'
            : 'Usuario creado correctamente.');
    });

    cuerpoTabla.addEventListener('click', (e) => {
        const boton = e.target.closest('button[data-accion]');

        if (!boton) return;

        if (boton.dataset.accion === "editar"){
            editarUsuario(boton.dataset.id);
        } else {
            eliminarUsuario(boton.dataset.id);
        }
    });

    btnCancelar.addEventListener('click', reiniciarFormulario);

    sembrarUsuarios();
    renderizarTablas();
});
