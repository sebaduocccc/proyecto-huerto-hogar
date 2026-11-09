package cl.huertohogar.backend.dto.catalogo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank @Size(max = 50) String nombre,
        @Size(max = 2000) String descripcion
) {
}
