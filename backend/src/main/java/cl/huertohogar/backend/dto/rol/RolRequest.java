package cl.huertohogar.backend.dto.rol;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Set;

/** Crear o editar un rol. "permisos" son nombres de permisos existentes (ej: PRODUCTOS_GESTIONAR). */
public record RolRequest(
        @NotBlank @Size(min = 3, max = 50)
        @Pattern(regexp = "^[A-Za-z_ ]+$", message = "El nombre solo puede tener letras, espacios y guion bajo")
        String nombre,
        @Size(max = 255) String descripcion,
        @NotNull Set<String> permisos
) {
}
