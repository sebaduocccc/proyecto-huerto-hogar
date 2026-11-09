package cl.huertohogar.backend.repository;

import cl.huertohogar.backend.model.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PermisoRepository extends JpaRepository<Permiso, Long> {

    Optional<Permiso> findByNombre(String nombre);

    /** Para asignar permisos a un rol a partir de sus nombres. */
    List<Permiso> findByNombreIn(Collection<String> nombres);

    List<Permiso> findAllByOrderByIdAsc();
}
