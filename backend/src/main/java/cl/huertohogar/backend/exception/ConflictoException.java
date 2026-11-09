package cl.huertohogar.backend.exception;

/** 409: choca con el estado actual (duplicado, stock insuficiente, recurso en uso...). */
public class ConflictoException extends RuntimeException {
    public ConflictoException(String mensaje) {
        super(mensaje);
    }
}
