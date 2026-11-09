package cl.huertohogar.backend.repository;

import cl.huertohogar.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /** Login: el email se guarda normalizado en minusculas. */
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRut(String rut);

    // validaciones de unicidad al editar (excluyen al propio usuario)
    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByRutAndIdNot(String rut, Long id);

    /** No se puede eliminar un rol que todavia tiene usuarios asignados. */
    long countByRolId(Long rolId);

    /** Para no dejar el sistema sin administradores. */
    long countByRolNombreAndActivoTrue(String nombreRol);

    List<Usuario> findAllByOrderByIdAsc();
}
