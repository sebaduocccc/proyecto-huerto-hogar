package cl.huertohogar.backend.exception;

/** 401: credenciales incorrectas o refresh token invalido/expirado/revocado. */
public class SesionInvalidaException extends RuntimeException {
    public SesionInvalidaException(String mensaje) {
        super(mensaje);
    }
}
