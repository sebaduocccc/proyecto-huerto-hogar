package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.OpenApiConfig;
import cl.huertohogar.backend.dto.usuario.UsuarioAdminRequest;
import cl.huertohogar.backend.dto.usuario.UsuarioResponse;
import cl.huertohogar.backend.security.Permisos;
import cl.huertohogar.backend.security.UsuarioAutenticado;
import cl.huertohogar.backend.service.UsuarioService;
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

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios")
@SecurityRequirement(name = OpenApiConfig.BEARER)
@PreAuthorize(Permisos.USUARIOS)
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Requiere USUARIOS_GESTIONAR.")
    public List<UsuarioResponse> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de un usuario", description = "Requiere USUARIOS_GESTIONAR.")
    public UsuarioResponse obtener(@PathVariable Long id) {
        return usuarioService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear usuario con cualquier rol", description = "Requiere USUARIOS_GESTIONAR. 'rol' es el nombre del rol (ADMIN, USUARIO o uno personalizado).")
    public UsuarioResponse crear(@Valid @RequestBody UsuarioAdminRequest request) {
        return usuarioService.crearPorAdmin(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar usuario", description = "Requiere USUARIOS_GESTIONAR. Password vacía = se mantiene. No puedes quitarte tu propio rol de admin.")
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioAdminRequest request,
                                      @Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado admin) {
        return usuarioService.actualizarPorAdmin(id, request, admin.id());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar usuario", description = "Requiere USUARIOS_GESTIONAR. No puedes eliminarte a ti mismo ni al último admin. Sus compras se conservan.")
    public void eliminar(@PathVariable Long id,
                         @Parameter(hidden = true) @AuthenticationPrincipal UsuarioAutenticado admin) {
        usuarioService.eliminar(id, admin.id());
    }
}
