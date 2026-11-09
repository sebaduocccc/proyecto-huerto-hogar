package cl.huertohogar.backend.repository;

import cl.huertohogar.backend.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombre(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);

    /** Para validar nombre unico al editar un rol (excluye el propio). */
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    List<Rol> findAllByOrderByIdAsc();
}
