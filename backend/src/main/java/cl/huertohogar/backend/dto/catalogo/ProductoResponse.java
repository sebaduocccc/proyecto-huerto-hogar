package cl.huertohogar.backend.dto.catalogo;

import cl.huertohogar.backend.model.Producto;

import java.util.LinkedHashMap;
import java.util.Map;

public record ProductoResponse(
        String sku,
        String nombre,
        String categoria,
        Integer precio,
        Integer stock,
        String imagen,
        String descripcion,
        Map<String, String> detalles
) {
    public static ProductoResponse desde(Producto p) {
        return new ProductoResponse(p.getSku(), p.getNombre(), p.getCategoria().getNombre(), p.getPrecio(),
                p.getStock(), p.getImagen(), p.getDescripcion(), new LinkedHashMap<>(p.getDetalles()));
    }
}
