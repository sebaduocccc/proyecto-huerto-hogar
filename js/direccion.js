document.addEventListener("DOMContentLoaded", () => {
    const comunas = ['chetume'];
    const regiones = [];

    const select = document.getElementById('comunas');
    comunas.forEach(comuna => {
        const opt = document.createElement('option');
        opt.value = comuna;
        opt.textContent = comuna;
        select.appendChild(opt);
    })
});