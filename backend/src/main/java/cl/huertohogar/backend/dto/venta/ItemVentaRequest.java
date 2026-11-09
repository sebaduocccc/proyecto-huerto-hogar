package cl.huertohogar.backend.dto.venta;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Un producto del carrito. Solo se envia sku y cantidad: el precio lo pone el backend. */
public record ItemVentaRequest(
        @NotBlank String sku,
        @NotNull @Min(1) @Max(100) Integer cantidad
) {
}
