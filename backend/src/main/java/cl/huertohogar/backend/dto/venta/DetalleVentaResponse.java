package cl.huertohogar.backend.dto.venta;

import cl.huertohogar.backend.model.DetalleVenta;

public record DetalleVentaResponse(
        String sku,
        String nombreProducto,
        String imagen,
        Integer precioUnitario,
        Integer cantidad,
        Integer subtotal
) {
    public static DetalleVentaResponse desde(DetalleVenta d) {
        return new DetalleVentaResponse(d.getSku(), d.getNombreProducto(), d.getImagen(),
                d.getPrecioUnitario(), d.getCantidad(), d.getSubtotal());
    }
}
