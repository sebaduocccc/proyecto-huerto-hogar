package cl.huertohogar.backend.dto.usuario;

import cl.huertohogar.backend.util.Telefono;
import cl.huertohogar.backend.validation.RutValido;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * Alta / edicion de usuarios desde el panel de administracion.
 * password: obligatoria al crear; al editar, si viene vacia se mantiene la actual.
 * rol: nombre del rol (ADMIN, USUARIO o uno creado por el admin). Si viene vacio se usa USUARIO.
 */
public record UsuarioAdminRequest(
        @NotBlank @Size(min = 3, max = 100) String nombre,
        @NotBlank @Email(message = "El correo no es válido") @Size(max = 150) String email,
        @Size(max = 72) String password,
        @Size(max = 50) String rol,
        @RutValido String rut,
        @Pattern(regexp = Telefono.REGEX, message = "El teléfono debe ser +56 9 seguido de 8 dígitos") String telefono,
        @Past LocalDate fechaNacimiento,
        @Size(max = 100) String region,
        @Size(max = 100) String comuna,
        @Size(max = 255) String direccion,
        Boolean activo
) {
}
