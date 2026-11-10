package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.OpenApiConfig;
import cl.huertohogar.backend.dto.rol.PermisoResponse;
import cl.huertohogar.backend.dto.rol.RolRequest;
import cl.huertohogar.backend.dto.rol.RolResponse;
import cl.huertohogar.backend.security.Permisos;
import cl.huertohogar.backend.service.RolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Roles y permisos")
@SecurityRequirement(name = OpenApiConfig.BEARER)
public class RolController {

    private final RolService rolService;

    @GetMapping("/roles")
    @PreAuthorize(Permisos.ROLES_O_USUARIOS)
    @Operation(summary = "Listar roles", description = "Requiere ROLES_GESTIONAR o USUARIOS_GESTIONAR (para asignar roles).")
    public List<RolResponse> listar() {
        return rolService.listar();
    }

    @GetMapping("/roles/{id}")
    @PreAuthorize(Permisos.ROLES_O_USUARIOS)
    @Operation(summary = "Detalle de un rol")
    public RolResponse obtener(@PathVariable Long id) {
        return rolService.obtener(id);
    }

    @PostMapping("/roles")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize(Permisos.ROLES)
    @Operation(summary = "Crear rol personalizado",
            description = "Requiere ROLES_GESTIONAR. Combina permisos existentes, ej: {\"nombre\":\"BODEGUERO\",\"permisos\":[\"PRODUCTOS_GESTIONAR\"]}")
    public RolResponse crear(@Valid @RequestBody RolRequest request) {
        return rolService.crear(request);
    }

    @PutMapping("/roles/{id}")
    @PreAuthorize(Permisos.ROLES)
    @Operation(summary = "Editar rol", description = "Requiere ROLES_GESTIONAR. ADMIN no se puede modificar; los roles de sistema no se renombran.")
    public RolResponse actualizar(@PathVariable Long id, @Valid @RequestBody RolRequest request) {
        return rolService.actualizar(id, request);
    }

    @DeleteMapping("/roles/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize(Permisos.ROLES)
    @Operation(summary = "Eliminar rol", description = "Requiere ROLES_GESTIONAR. No se eliminan roles de sistema ni roles con usuarios asignados.")
    public void eliminar(@PathVariable Long id) {
        rolService.eliminar(id);
    }

    @GetMapping("/permisos")
    @PreAuthorize(Permisos.ROLES)
    @Operation(summary = "Listar permisos disponibles", description = "Requiere ROLES_GESTIONAR.")
    public List<PermisoResponse> permisos() {
        return rolService.listarPermisos();
    }
}
