package cl.huertohogar.backend.dto.admin;

import cl.huertohogar.backend.dto.catalogo.ProductoResponse;
import cl.huertohogar.backend.dto.venta.VentaResponse;

import java.util.List;

/** Datos del panel AdminHome. */
public record ResumenAdminResponse(
        long totalUsuarios,
        long totalProductos,
        long totalVentas,
        long totalVendido,
        List<ProductoResponse> productosStockBajo,
        List<VentaResponse> ultimasVentas
) {
}
