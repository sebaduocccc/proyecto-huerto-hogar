package cl.huertohogar.backend.dto.usuario;

import cl.huertohogar.backend.util.Telefono;
import cl.huertohogar.backend.validation.MayorDeEdad;
import cl.huertohogar.backend.validation.RutValido;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

/** Registro publico de un cliente (pagina Register del frontend). */
public record RegistroRequest(
        @NotBlank @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
        String nombre,

        @NotBlank @Email(message = "El correo no es válido") @Size(max = 150)
        String email,

        @NotBlank @Size(min = 4, max = 72, message = "La contraseña debe tener entre 4 y 72 caracteres")
        String password,

        @NotBlank @Pattern(regexp = Telefono.REGEX, message = "El teléfono debe ser +56 9 seguido de 8 dígitos")
        String telefono,

        @NotBlank @RutValido
        String rut,

        @NotNull(message = "Debes ingresar tu fecha de nacimiento") @Past @MayorDeEdad
        LocalDate fechaNacimiento,

        @NotBlank @Size(max = 100) String region,
        @NotBlank @Size(max = 100) String comuna,
        @NotBlank(message = "Debes ingresar tu dirección") @Size(max = 255) String direccion
) {
}
