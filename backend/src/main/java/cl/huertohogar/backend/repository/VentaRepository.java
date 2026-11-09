package cl.huertohogar.backend.repository;

import cl.huertohogar.backend.model.EstadoVenta;
import cl.huertohogar.backend.model.Venta;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    // @EntityGraph carga los detalles (y el usuario) en la misma consulta, evitando el problema N+1

    /** Todas las ventas, mas recientes primero (panel admin). */
    @EntityGraph(attributePaths = {"detalles", "usuario"})
    List<Venta> findAllByOrderByFechaDesc();

    /** Ultimas 5 ventas para el resumen del panel admin. */
    @EntityGraph(attributePaths = {"detalles", "usuario"})
    List<Venta> findTop5ByOrderByFechaDesc();

    /** Historial de compras del usuario logueado. */
    @EntityGraph(attributePaths = {"detalles"})
    List<Venta> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    @EntityGraph(attributePaths = {"detalles", "usuario"})
    Optional<Venta> findWithDetallesById(Long id);

    List<Venta> findByEstadoOrderByFechaDesc(EstadoVenta estado);

    /** Total recaudado (excluye ventas canceladas), para el resumen del panel admin. */
    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.estado <> cl.huertohogar.backend.model.EstadoVenta.CANCELADA")
    long sumarTotalVendido();
}
