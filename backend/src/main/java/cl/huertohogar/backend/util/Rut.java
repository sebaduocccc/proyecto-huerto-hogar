package cl.huertohogar.backend.util;

import java.util.regex.Pattern;

/** Validacion y normalizacion de RUT chileno (misma logica que validaciones.ts del frontend). */
public final class Rut {

    private static final Pattern FORMATO = Pattern.compile("^\\d{1,2}\\.?\\d{3}\\.?\\d{3}-[\\dkK]$");

    private Rut() {
    }

    /** Acepta 12.345.678-5 o 12345678-5 y verifica el digito verificador (modulo 11). */
    public static boolean esValido(String rut) {
        if (rut == null) return false;
        String texto = rut.trim();
        if (!FORMATO.matcher(texto).matches()) return false;

        String limpio = texto.replace(".", "").replace("-", "").toUpperCase();
        String cuerpo = limpio.substring(0, limpio.length() - 1);
        char dv = limpio.charAt(limpio.length() - 1);

        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : Character.forDigit(resto, 10);
        return dv == esperado;
    }

    /** Guarda siempre el mismo formato: sin puntos, con guion y K mayuscula (12345678-5). */
    public static String normalizar(String rut) {
        String limpio = Textos.limpiar(rut);
        if (limpio == null) return null;
        return limpio.replace(".", "").toUpperCase();
    }
}
