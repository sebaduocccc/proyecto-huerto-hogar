package cl.huertohogar.backend.service;

import cl.huertohogar.backend.dto.rol.PermisoResponse;
import cl.huertohogar.backend.dto.rol.RolRequest;
import cl.huertohogar.backend.dto.rol.RolResponse;
import cl.huertohogar.backend.exception.ConflictoException;
import cl.huertohogar.backend.exception.RecursoNoEncontradoException;
import cl.huertohogar.backend.exception.ReglaNegocioException;
import cl.huertohogar.backend.model.Permiso;
import cl.huertohogar.backend.model.Rol;
import cl.huertohogar.backend.repository.PermisoRepository;
import cl.huertohogar.backend.repository.RolRepository;
import cl.huertohogar.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

/**
 * Gestion de roles. El administrador puede crear roles nuevos combinando los permisos existentes.
 * Reglas: el rol ADMIN no se puede modificar, los roles de sistema no se renombran ni eliminan,
 * y no se elimina un rol que tenga usuarios asignados.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RolService {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<RolResponse> listar() {
        return rolRepository.findAllByOrderByIdAsc().stream().map(RolResponse::desde).toList();
    }

    public RolResponse obtener(Long id) {
        return RolResponse.desde(buscar(id));
    }

    public List<PermisoResponse> listarPermisos() {
        return permisoRepository.findAllByOrderByIdAsc().stream().map(PermisoResponse::desde).toList();
    }

    @Transactional
    public RolResponse crear(RolRequest req) {
        String nombre = normalizarNombre(req.nombre());
        if (rolRepository.existsByNombreIgnoreCase(nombre)) {
            throw new ConflictoException("Ya existe un rol llamado " + nombre);
        }
        Rol rol = Rol.builder()
                .nombre(nombre)
                .descripcion(req.descripcion())
                .sistema(false)
                .permisos(resolverPermisos(req.permisos()))
                .build();
        Rol guardado = rolRepository.save(rol);
        log.info("Rol creado: {} con permisos {}", nombre, req.permisos());
        return RolResponse.desde(guardado);
    }

    @Transactional
    public RolResponse actualizar(Long id, RolRequest req) {
        Rol rol = buscar(id);
        if (Rol.ADMIN.equals(rol.getNombre())) {
            throw new ReglaNegocioException("El rol ADMIN no se puede modificar");
        }
        String nombre = normalizarNombre(req.nombre());
        if (rol.isSistema() && !rol.getNombre().equals(nombre)) {
            throw new ReglaNegocioException("No se puede renombrar un rol del sistema");
        }
        if (rolRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new ConflictoException("Ya existe un rol llamado " + nombre);
        }
        rol.setNombre(nombre);
        rol.setDescripcion(req.descripcion());
        rol.setPermisos(resolverPermisos(req.permisos()));
        return RolResponse.desde(rol);
    }

    @Transactional
    public void eliminar(Long id) {
        Rol rol = buscar(id);
        if (rol.isSistema()) {
            throw new ReglaNegocioException("No se puede eliminar un rol del sistema");
        }
        long usuarios = usuarioRepository.countByRolId(id);
        if (usuarios > 0) {
            throw new ConflictoException("El rol tiene " + usuarios + " usuario(s) asignado(s); reasígnalos antes de eliminarlo");
        }
        rolRepository.delete(rol);
        log.info("Rol eliminado: {}", rol.getNombre());
    }

    /** "bodega central" -> "BODEGA_CENTRAL" */
    private String normalizarNombre(String nombre) {
        return nombre.trim().replaceAll("\\s+", "_").toUpperCase();
    }

    private Set<Permiso> resolverPermisos(Set<String> nombres) {
        Set<String> pedidos = nombres.stream().map(n -> n.trim().toUpperCase()).collect(Collectors.toSet());
        List<Permiso> encontrados = permisoRepository.findByNombreIn(pedidos);
        if (encontrados.size() != pedidos.size()) {
            Set<String> desconocidos = new TreeSet<>(pedidos);
            encontrados.forEach(p -> desconocidos.remove(p.getNombre()));
            throw new ReglaNegocioException("Permisos inexistentes: " + desconocidos);
        }
        return new HashSet<>(encontrados);
    }

    private Rol buscar(Long id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Rol no encontrado"));
    }
}
