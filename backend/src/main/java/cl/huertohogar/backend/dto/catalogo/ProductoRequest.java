package cl.huertohogar.backend.dto.catalogo;

import jakarta.validation.constraints.*;

import java.util.Map;

/**
 * Crear o editar un producto (panel AdminProductos).
 * sku: obligatorio al crear (formato AA000, ej FR001); al editar se toma el de la URL.
 * categoria: nombre de una categoria existente.
 * detalles: equivalente a longDescription (Origen, Variedad...). Al editar, si viene null se mantienen los actuales.
 */
public record ProductoRequest(
        @Pattern(regexp = "^[A-Za-z]{2}\\d{3}$", message = "El SKU debe tener 2 letras y 3 números (ej: FR001)")
        String sku,
        @NotBlank @Size(max = 100) String nombre,
        @NotBlank @Size(max = 50) String categoria,
        @NotNull @PositiveOrZero Integer precio,
        @NotNull @PositiveOrZero Integer stock,
        @Size(max = 255) String imagen,
        @Size(max = 5000) String descripcion,
        Map<@NotBlank @Size(max = 50) String, @NotBlank @Size(max = 255) String> detalles
) {
}
