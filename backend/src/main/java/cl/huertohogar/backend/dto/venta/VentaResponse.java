package cl.huertohogar.backend.dto.venta;

import cl.huertohogar.backend.model.EstadoVenta;
import cl.huertohogar.backend.model.Venta;

import java.time.LocalDateTime;
import java.util.List;

/** Boleta / detalle de una venta. usuarioId es null si fue una compra como invitado. */
public record VentaResponse(
        Long id,
        LocalDateTime fecha,
        Long usuarioId,
        String nombre,
        String correo,
        String telefono,
        String direccion,
        String ciudad,
        String codigoPostal,
        String pais,
        Integer total,
        EstadoVenta estado,
        List<DetalleVentaResponse> items
) {
    public static VentaResponse desde(Venta v) {
        return new VentaResponse(v.getId(), v.getFecha(),
                v.getUsuario() == null ? null : v.getUsuario().getId(),
                v.getNombre(), v.getCorreo(), v.getTelefono(), v.getDireccion(), v.getCiudad(),
                v.getCodigoPostal(), v.getPais(), v.getTotal(), v.getEstado(),
                v.getDetalles().stream().map(DetalleVentaResponse::desde).toList());
    }
}
