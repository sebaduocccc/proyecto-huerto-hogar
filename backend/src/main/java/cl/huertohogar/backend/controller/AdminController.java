package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.OpenApiConfig;
import cl.huertohogar.backend.dto.admin.ResumenAdminResponse;
import cl.huertohogar.backend.security.Permisos;
import cl.huertohogar.backend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Administración")
@SecurityRequirement(name = OpenApiConfig.BEARER)
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/resumen")
    @PreAuthorize(Permisos.PANEL_ADMIN)
    @Operation(summary = "Resumen del panel", description = "Totales, monto vendido, stock bajo y últimas ventas. Requiere algún permiso de administración.")
    public ResumenAdminResponse resumen() {
        return adminService.resumen();
    }
}
