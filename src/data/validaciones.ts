// Valida un RUT chileno: formato 12.345.678-5 o 12345678-5 y digito verificador correcto
export function validarRut(rut: string): boolean {
    const texto = rut.trim();

    if (!/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/.test(texto)) {
        return false;
    }

    const limpio = texto.replace(/\./g, "").replace("-", "").toUpperCase();
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    // algoritmo modulo 11: se multiplica cada digito de derecha a izquierda por 2,3,4,5,6,7,2,3...
    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = String(resto);
    if (resto === 11) dvEsperado = "0";
    if (resto === 10) dvEsperado = "K";

    return dv === dvEsperado;
}

// Valida un celular chileno: +56 9 y 8 digitos, los espacios no importan
export function validarTelefono(telefono: string): boolean {
    const limpio = telefono.replace(/\s/g, "");
    return /^\+569\d{8}$/.test(limpio);
}

export function validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// calcula la edad a partir de una fecha "aaaa-mm-dd"
export function calcularEdad(fecha: string): number {
    const nacimiento = new Date(fecha + "T00:00:00");
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}
