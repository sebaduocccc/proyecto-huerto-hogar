package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.OpenApiConfig;
import cl.huertohogar.backend.dto.usuario.CambioPasswordRequest;
import cl.huertohogar.backend.dto.usuario.PerfilUpdateRequest;
import cl.huertohogar.backend.dto.usuario.UsuarioResponse;
import cl.huertohogar.backend.dto.venta.VentaResponse;
import cl.huertohogar.backend.security.Permisos;
import cl.huertohogar.backend.security.UsuarioAutenticado;
import cl.huertohogar.backend.service.UsuarioService;
import cl.huertohogar.backend.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints del usuario con sesion iniciada. El id SIEMPRE se toma del token,
 * nunca de la URL, asi nadie puede ver o editar la cuenta de otro.
 */
@RestController
@RequestMapping("/api/cuenta")
@RequiredArgsConstructor
@Tag(name = "Mi cuenta")
@SecurityRequirement(name = OpenApiConfig.BEARER)
public class CuentaController {

    private final UsuarioService usuarioService;
    private final VentaService ventaService;

    @GetMapping("/perfil")
    @PreAuthorize(Permisos.PERFIL_PROPIO)
    @Operation(summary = "Ver mi perfil")
    public UsuarioResponse perfil(@Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return usuarioService.obtener(usuario.id());
    }

    @PutMapping("/perfil")
    @PreAuthorize(Permisos.PERFIL_PROPIO)
    @Operation(summary = "Editar mi perfil", description = "Dirección, teléfono, RUT, etc. El correo y el rol no se cambian aquí.")
    public UsuarioResponse actualizarPerfil(@Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado usuario,
                                            @Valid @RequestBody PerfilUpdateRequest request) {
        return usuarioService.actualizarPerfil(usuario.id(), request);
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize(Permisos.PERFIL_PROPIO)
    @Operation(summary = "Cambiar mi contraseña", description = "Exige la contraseña actual.")
    public void cambiarPassword(@Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado usuario,
                                @Valid @RequestBody CambioPasswordRequest request) {
        usuarioService.cambiarPassword(usuario.id(), request);
    }

    @GetMapping("/compras")
    @PreAuthorize(Permisos.COMPRAS_PROPIAS)
    @Operation(summary = "Mi historial de compras")
    public List<VentaResponse> compras(@Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return ventaService.listarDeUsuario(usuario.id());
    }

    @GetMapping("/compras/{id}")
    @PreAuthorize(Permisos.COMPRAS_PROPIAS)
    @Operation(summary = "Detalle de una de mis compras", description = "404 si la venta no es del usuario.")
    public VentaResponse compra(@Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado usuario,
                                @PathVariable Long id) {
        return ventaService.obtenerDeUsuario(id, usuario.id());
    }
}
