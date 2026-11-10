package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.OpenApiConfig;
import cl.huertohogar.backend.dto.venta.CambioEstadoRequest;
import cl.huertohogar.backend.dto.venta.VentaRequest;
import cl.huertohogar.backend.dto.venta.VentaResponse;
import cl.huertohogar.backend.model.EstadoVenta;
import cl.huertohogar.backend.security.Permisos;
import cl.huertohogar.backend.security.UsuarioAutenticado;
import cl.huertohogar.backend.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@Tag(name = "Ventas")
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Confirmar compra (checkout)",
            description = """
                    Público: se puede comprar como invitado. Si se envía un token válido, la venta queda asociada a la cuenta.
                    Solo se envían SKU y cantidad: el precio y el total los calcula el servidor. Descuenta stock en la misma transacción.""")
    @ApiResponse(responseCode = "201", description = "Venta registrada; devuelve la boleta")
    @ApiResponse(responseCode = "404", description = "Algún SKU no existe")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    public VentaResponse crear(@Valid @RequestBody VentaRequest request,
                               @Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return ventaService.crear(request, usuario == null ? null : usuario.id());
    }

    @GetMapping
    @PreAuthorize(Permisos.VENTAS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Listar todas las ventas", description = "Requiere VENTAS_GESTIONAR. Filtro opcional por estado.")
    public List<VentaResponse> listar(@RequestParam(required = false) EstadoVenta estado) {
        return ventaService.listarTodas(estado);
    }

    @GetMapping("/{id}")
    @PreAuthorize(Permisos.VENTAS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Detalle de cualquier venta", description = "Requiere VENTAS_GESTIONAR.")
    public VentaResponse obtener(@PathVariable Long id) {
        return ventaService.obtener(id);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize(Permisos.VENTAS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Cambiar estado del pedido",
            description = "Requiere VENTAS_GESTIONAR. CANCELADA devuelve el stock. ENTREGADA y CANCELADA son estados finales.")
    public VentaResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstadoRequest request) {
        return ventaService.cambiarEstado(id, request.estado());
    }
}
