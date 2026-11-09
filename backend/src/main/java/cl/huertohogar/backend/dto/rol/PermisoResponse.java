package cl.huertohogar.backend.dto.rol;

import cl.huertohogar.backend.model.Permiso;

public record PermisoResponse(Long id, String nombre, String descripcion) {
    public static PermisoResponse desde(Permiso p) {
        return new PermisoResponse(p.getId(), p.getNombre(), p.getDescripcion());
    }
}
