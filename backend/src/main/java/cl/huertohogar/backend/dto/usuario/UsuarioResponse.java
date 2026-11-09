package cl.huertohogar.backend.dto.usuario;

import cl.huertohogar.backend.model.Permiso;
import cl.huertohogar.backend.model.Usuario;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

/** Datos publicos de un usuario. Nunca incluye la contraseña. */
public record UsuarioResponse(
        Long id,
        String nombre,
        String email,
        String rut,
        String telefono,
        String direccion,
        String comuna,
        String region,
        LocalDate fechaNacimiento,
        String rol,
        Set<String> permisos,
        boolean activo,
        LocalDateTime createdAt
) {
    public static UsuarioResponse desde(Usuario u) {
        Set<String> permisos = u.getRol().getPermisos().stream()
                .map(Permiso::getNombre)
                .collect(Collectors.toCollection(TreeSet::new));
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getEmail(), u.getRut(), u.getTelefono(),
                u.getDireccion(), u.getComuna(), u.getRegion(), u.getFechaNacimiento(),
                u.getRol().getNombre(), permisos, u.isActivo(), u.getCreatedAt());
    }
}
