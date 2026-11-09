package cl.huertohogar.backend.exception;

/** 400: la peticion es valida en formato pero viola una regla de negocio. */
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
