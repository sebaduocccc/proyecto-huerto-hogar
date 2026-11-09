package cl.huertohogar.backend.util;

/** Celular chileno: +56 9 y 8 digitos. Se guarda sin espacios (+56912345678). */
public final class Telefono {

    /** Permite espacios entre los digitos, igual que el frontend. */
    public static final String REGEX = "^\\s*\\+\\s*5\\s*6\\s*9(\\s*\\d){8}\\s*$";

    private Telefono() {
    }

    public static String normalizar(String telefono) {
        String limpio = Textos.limpiar(telefono);
        return limpio == null ? null : limpio.replaceAll("\\s", "");
    }
}
