import { validarRut, validarTelefono, validarEmail, calcularEdad } from "./validaciones";

it("acepta RUTs validos con y sin puntos", () => {
    expect(validarRut("12.345.678-5")).toBe(true);
    expect(validarRut("12345678-5")).toBe(true);
    expect(validarRut("11.111.111-1")).toBe(true);
});

it("acepta RUT con digito verificador K", () => {
    expect(validarRut("10.000.013-K")).toBe(true);
    expect(validarRut("10.000.013-k")).toBe(true);
});

it("rechaza RUTs mal escritos o con digito incorrecto", () => {
    expect(validarRut("12.345.678-9")).toBe(false);
    expect(validarRut("12345678")).toBe(false);
    expect(validarRut("abc")).toBe(false);
    expect(validarRut("")).toBe(false);
});

it("valida telefonos +56 9 con 8 digitos", () => {
    expect(validarTelefono("+56 9 1234 5678")).toBe(true);
    expect(validarTelefono("+56912345678")).toBe(true);
    expect(validarTelefono("+56 9 1234 567")).toBe(false);
    expect(validarTelefono("912345678")).toBe(false);
    expect(validarTelefono("+56 2 1234 5678")).toBe(false);
});

it("valida correos", () => {
    expect(validarEmail("juan@correo.cl")).toBe(true);
    expect(validarEmail("juan@correo")).toBe(false);
    expect(validarEmail("juan correo.cl")).toBe(false);
});

it("calcula la edad", () => {
    const hoy = new Date();
    const hace20 = `${hoy.getFullYear() - 20}-01-01`;
    expect(calcularEdad(hace20)).toBeGreaterThanOrEqual(19);
    expect(calcularEdad(hace20)).toBeLessThanOrEqual(20);
});
