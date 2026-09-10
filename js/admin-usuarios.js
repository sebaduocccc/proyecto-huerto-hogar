document.addEventListener("DOMContentLoaded",() => {

    const cuerpoTabla = document.getElementById('admin-table-body');

    if (!cuerpoTabla) return;

    function renderizarTablas(){
        const usuarios = obtenerUsuarios();

        if (usuarios.length === 0){

            cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-body-secondary py-4">
                    No hay usuarios registrados en el sistema.
                </td>
            </tr>
            `;
            return;
        }

        cuerpoTabla.innerHTML = usuarios.map((u) => `
            <tr>
                <td class="fw-semibold">${u.nombre ?? "-"}</td>
                <td class="text-body-secondary">${u.email ?? "--"}</td>
                <td>${u.telefono ?? "--"}</td>
                <td>${u.comuna ?? "--"}</td>
            </tr>
        `).join('');
    }


    renderizarTablas();
});