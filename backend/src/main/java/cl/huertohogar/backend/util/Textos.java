package cl.huertohogar.backend.util;

/** Utilidades para limpiar texto que llega desde el cliente. */
public final class Textos {

    private Textos() {
    }

    /** trim y convierte "" en null. */
    public static String limpiar(String valor) {
        if (valor == null) return null;
        String limpio = valor.trim();
        return limpio.isEmpty() ? null : limpio;
    }

    public static boolean estaVacio(String valor) {
        return valor == null || valor.isBlank();
    }

    public static String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
