package cl.huertohogar.backend.service;

import cl.huertohogar.backend.dto.catalogo.ProductoRequest;
import cl.huertohogar.backend.dto.catalogo.ProductoResponse;
import cl.huertohogar.backend.exception.ConflictoException;
import cl.huertohogar.backend.exception.RecursoNoEncontradoException;
import cl.huertohogar.backend.exception.ReglaNegocioException;
import cl.huertohogar.backend.model.Categoria;
import cl.huertohogar.backend.model.Producto;
import cl.huertohogar.backend.repository.CategoriaRepository;
import cl.huertohogar.backend.repository.ProductoRepository;
import cl.huertohogar.backend.util.Textos;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoService {

    /** Umbral por defecto para alertar stock bajo en el panel admin. */
    public static final int STOCK_BAJO = 5;

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    /**
     * Catalogo con filtros opcionales.
     * @param categoria nombre de categoria (Frutas, Verduras...)
     * @param texto     busqueda libre en nombre/descripcion
     */
    public List<ProductoResponse> listar(String categoria, String texto) {
        List<Producto> productos;
        if (!Textos.estaVacio(texto)) {
            productos = productoRepository.buscar(texto.trim());
            if (!Textos.estaVacio(categoria)) {
                productos = productos.stream()
                        .filter(p -> p.getCategoria().getNombre().equalsIgnoreCase(categoria.trim()))
                        .toList();
            }
        } else if (!Textos.estaVacio(categoria)) {
            productos = productoRepository.findByCategoriaNombreIgnoreCaseOrderBySkuAsc(categoria.trim());
        } else {
            productos = productoRepository.findAllByOrderBySkuAsc();
        }
        return productos.stream().map(ProductoResponse::desde).toList();
    }

    public ProductoResponse obtener(String sku) {
        return ProductoResponse.desde(buscar(sku));
    }

    public List<ProductoResponse> stockBajo(int umbral) {
        return productoRepository.findByStockLessThanEqualOrderByStockAsc(umbral).stream()
                .map(ProductoResponse::desde).toList();
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest req) {
        if (Textos.estaVacio(req.sku())) {
            throw new ReglaNegocioException("El SKU es obligatorio");
        }
        String sku = req.sku().trim().toUpperCase();
        if (productoRepository.existsById(sku)) {
            throw new ConflictoException("Ya existe un producto con SKU " + sku);
        }
        Producto producto = new Producto();
        producto.setSku(sku);
        aplicarDatos(producto, req);
        producto.setDetalles(req.detalles() == null ? new LinkedHashMap<>() : limpiarDetalles(req.detalles()));

        Producto guardado = productoRepository.save(producto);
        log.info("Producto creado {}", sku);
        return ProductoResponse.desde(guardado);
    }

    @Transactional
    public ProductoResponse actualizar(String sku, ProductoRequest req) {
        Producto producto = buscar(sku);
        if (!Textos.estaVacio(req.sku()) && !req.sku().trim().equalsIgnoreCase(producto.getSku())) {
            throw new ReglaNegocioException("El SKU de un producto no se puede cambiar");
        }
        aplicarDatos(producto, req);
        if (req.detalles() != null) {
            producto.getDetalles().clear();
            producto.getDetalles().putAll(limpiarDetalles(req.detalles()));
        }
        return ProductoResponse.desde(producto);
    }

    @Transactional
    public void eliminar(String sku) {
        Producto producto = buscar(sku);
        // las boletas guardan copia del nombre/precio, asi que no se pierden (FK ON DELETE SET NULL)
        productoRepository.delete(producto);
        log.info("Producto eliminado {}", sku);
    }

    private void aplicarDatos(Producto producto, ProductoRequest req) {
        producto.setNombre(req.nombre().trim());
        producto.setCategoria(buscarCategoria(req.categoria()));
        producto.setPrecio(req.precio());
        producto.setStock(req.stock());
        producto.setImagen(Textos.limpiar(req.imagen()));
        producto.setDescripcion(Textos.limpiar(req.descripcion()));
    }

    private Map<String, String> limpiarDetalles(Map<String, String> detalles) {
        Map<String, String> limpio = new LinkedHashMap<>();
        detalles.forEach((k, v) -> limpio.put(k.trim(), v.trim()));
        return limpio;
    }

    private Categoria buscarCategoria(String nombre) {
        return categoriaRepository.findByNombreIgnoreCase(nombre.trim())
                .orElseThrow(() -> new ReglaNegocioException("La categoría " + nombre + " no existe"));
    }

    private Producto buscar(String sku) {
        return productoRepository.findById(sku.trim().toUpperCase())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto " + sku + " no encontrado"));
    }
}
