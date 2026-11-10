package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.OpenApiConfig;
import cl.huertohogar.backend.dto.catalogo.ProductoRequest;
import cl.huertohogar.backend.dto.catalogo.ProductoResponse;
import cl.huertohogar.backend.security.Permisos;
import cl.huertohogar.backend.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@Tag(name = "Productos")
public class ProductoController {

    private final ProductoService productoService;

    // ---------- publico ----------

    @GetMapping
    @Operation(summary = "Listar el catálogo", description = "Público. Filtros opcionales por categoría y por texto (nombre o descripción).")
    public List<ProductoResponse> listar(
            @Parameter(description = "Nombre de la categoría, ej: Frutas") @RequestParam(required = false) String categoria,
            @Parameter(description = "Texto a buscar, ej: miel") @RequestParam(required = false) String q) {
        return productoService.listar(categoria, q);
    }

    @GetMapping("/{sku}")
    @Operation(summary = "Detalle de un producto", description = "Público.")
    @ApiResponse(responseCode = "404", description = "No existe el producto")
    public ProductoResponse obtener(@PathVariable String sku) {
        return productoService.obtener(sku);
    }

    // ---------- administracion ----------

    @GetMapping("/stock-bajo")
    @PreAuthorize(Permisos.PRODUCTOS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Productos con stock bajo", description = "Requiere PRODUCTOS_GESTIONAR.")
    public List<ProductoResponse> stockBajo(@RequestParam(defaultValue = "" + ProductoService.STOCK_BAJO) int umbral) {
        return productoService.stockBajo(umbral);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize(Permisos.PRODUCTOS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Crear producto", description = "Requiere PRODUCTOS_GESTIONAR. El SKU debe ser único (ej: FR010).")
    @ApiResponse(responseCode = "409", description = "SKU duplicado")
    public ProductoResponse crear(@Valid @RequestBody ProductoRequest request) {
        return productoService.crear(request);
    }

    @PutMapping("/{sku}")
    @PreAuthorize(Permisos.PRODUCTOS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Editar producto", description = "Requiere PRODUCTOS_GESTIONAR. Si 'detalles' es null se conservan los actuales.")
    public ProductoResponse actualizar(@PathVariable String sku, @Valid @RequestBody ProductoRequest request) {
        return productoService.actualizar(sku, request);
    }

    @DeleteMapping("/{sku}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize(Permisos.PRODUCTOS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Eliminar producto", description = "Requiere PRODUCTOS_GESTIONAR. Las boletas antiguas conservan el nombre y precio.")
    public void eliminar(@PathVariable String sku) {
        productoService.eliminar(sku);
    }
}
