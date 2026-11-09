package cl.huertohogar.backend.dto.usuario;

import cl.huertohogar.backend.util.Telefono;
import cl.huertohogar.backend.validation.MayorDeEdad;
import cl.huertohogar.backend.validation.RutValido;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

/** El usuario edita su propio perfil (pagina Perfil). El email y el rol no se cambian aqui. */
public record PerfilUpdateRequest(
        @NotBlank @Size(min = 3, max = 100) String nombre,
        @Pattern(regexp = Telefono.REGEX, message = "El teléfono debe ser +56 9 seguido de 8 dígitos") String telefono,
        @RutValido String rut,
        @Past @MayorDeEdad LocalDate fechaNacimiento,
        @Size(max = 100) String region,
        @Size(max = 100) String comuna,
        @Size(max = 255) String direccion
) {
}
