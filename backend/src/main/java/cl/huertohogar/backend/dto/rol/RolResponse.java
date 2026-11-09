package cl.huertohogar.backend.dto.rol;

import cl.huertohogar.backend.model.Permiso;
import cl.huertohogar.backend.model.Rol;

import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

public record RolResponse(Long id, String nombre, String descripcion, boolean sistema, Set<String> permisos) {
    public static RolResponse desde(Rol r) {
        return new RolResponse(r.getId(), r.getNombre(), r.getDescripcion(), r.isSistema(),
                r.getPermisos().stream().map(Permiso::getNombre).collect(Collectors.toCollection(TreeSet::new)));
    }
}
