package cl.huertohogar.backend.repository;

import cl.huertohogar.backend.model.Producto;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, String> {

    List<Producto> findAllByOrderBySkuAsc();

    /** Filtro por categoria del catalogo (Frutas, Verduras, ...). */
    List<Producto> findByCategoriaNombreIgnoreCaseOrderBySkuAsc(String categoria);

    /** Busqueda por texto en nombre o descripcion (barra de busqueda del frontend). */
    @Query("""
            SELECT p FROM Producto p
            WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
               OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))
            ORDER BY p.sku
            """)
    List<Producto> buscar(@Param("texto") String texto);

    /** Productos con stock bajo, para el panel de administracion. */
    List<Producto> findByStockLessThanEqualOrderByStockAsc(int stock);

    /** No se puede eliminar una categoria que todavia tiene productos. */
    boolean existsByCategoriaId(Long categoriaId);

    /**
     * Bloquea las filas de los productos (SELECT ... FOR UPDATE) mientras se registra una venta,
     * para que dos compras simultaneas no vendan el mismo stock.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Producto p WHERE p.sku IN :skus ORDER BY p.sku")
    List<Producto> findAllBySkuForUpdate(@Param("skus") Collection<String> skus);
}
