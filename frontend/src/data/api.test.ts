import { AxiosError, AxiosHeaders } from "axios";
import { mensajeError } from "./api";

// crea un error de axios como los que devuelve el backend
function errorConRespuesta(status: number, data: unknown) {
    const config = { headers: new AxiosHeaders() };
    return new AxiosError("error", "ERR", config, null, {
        status, statusText: "", headers: {}, config, data,
    });
}

it("muestra el mensaje del backend", () => {
    const error = errorConRespuesta(401, { status: 401, mensaje: "Correo o contraseña incorrectos" });
    expect(mensajeError(error)).toBe("Correo o contraseña incorrectos");
});

it("en errores de validacion muestra el primer campo con error", () => {
    const error = errorConRespuesta(400, {
        mensaje: "Hay datos inválidos en la solicitud",
        campos: { telefono: "El teléfono debe ser +56 9 seguido de 8 dígitos" },
    });
    expect(mensajeError(error)).toBe("El teléfono debe ser +56 9 seguido de 8 dígitos");
});

it("avisa cuando no se puede conectar con el servidor", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");
    expect(mensajeError(error)).toBe("No se pudo conectar con el servidor.");
});

it("da un mensaje generico para otros errores", () => {
    expect(mensajeError(new Error("algo raro"))).toBe("Ocurrió un error inesperado.");
});
