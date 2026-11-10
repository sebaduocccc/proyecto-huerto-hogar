package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.OpenApiConfig;
import cl.huertohogar.backend.dto.catalogo.CategoriaRequest;
import cl.huertohogar.backend.dto.catalogo.CategoriaResponse;
import cl.huertohogar.backend.security.Permisos;
import cl.huertohogar.backend.service.CategoriaService;
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
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@Tag(name = "Categorías")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    @Operation(summary = "Listar categorías", description = "Público.")
    public List<CategoriaResponse> listar() {
        return categoriaService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de una categoría", description = "Público.")
    public CategoriaResponse obtener(@PathVariable Long id) {
        return categoriaService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize(Permisos.CATEGORIAS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Crear categoría", description = "Requiere CATEGORIAS_GESTIONAR.")
    public CategoriaResponse crear(@Valid @RequestBody CategoriaRequest request) {
        return categoriaService.crear(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize(Permisos.CATEGORIAS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Editar categoría", description = "Requiere CATEGORIAS_GESTIONAR.")
    public CategoriaResponse actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return categoriaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize(Permisos.CATEGORIAS)
    @SecurityRequirement(name = OpenApiConfig.BEARER)
    @Operation(summary = "Eliminar categoría", description = "Requiere CATEGORIAS_GESTIONAR. Falla con 409 si tiene productos.")
    public void eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
    }
}
