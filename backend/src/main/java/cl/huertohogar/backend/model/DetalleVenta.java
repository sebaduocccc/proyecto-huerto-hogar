package cl.huertohogar.backend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Linea de una venta. Guarda una "foto" del producto (sku, nombre, precio) al momento de la compra,
 * asi la boleta no cambia si despues se edita o elimina el producto.
 */
@Entity
@Table(name = "detalle_venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    /** Referencia al producto; queda en null si el producto se elimina del catalogo. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_sku")
    private Producto producto;

    @Column(nullable = false, length = 10)
    private String sku;

    @Column(name = "nombre_producto", nullable = false, length = 100)
    private String nombreProducto;

    @Column(length = 255)
    private String imagen;

    @Column(name = "precio_unitario", nullable = false)
    private Integer precioUnitario;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Integer subtotal;
}
