package cl.huertohogar.backend.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CambioPasswordRequest(
        @NotBlank String passwordActual,
        @NotBlank @Size(min = 4, max = 72, message = "La contraseña debe tener entre 4 y 72 caracteres") String passwordNueva
) {
}
