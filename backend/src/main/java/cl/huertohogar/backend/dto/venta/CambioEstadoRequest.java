package cl.huertohogar.backend.dto.venta;

import cl.huertohogar.backend.model.EstadoVenta;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoRequest(@NotNull EstadoVenta estado) {
}
