package cl.huertohogar.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Producto del catalogo. Reemplaza "CatalogoProductos" del localStorage del frontend.
 * El SKU (ej: FR001) es la clave primaria, igual que en el frontend.
 */
@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @Column(length = 10)
    private String sku;

    @Column(nullable = false, length = 100)
    private String nombre;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    /** Precio en pesos chilenos (sin decimales). */
    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 255)
    private String imagen;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    /** Equivale a "longDescription" del frontend: pares clave/valor como Origen, Variedad. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "producto_detalle", joinColumns = @JoinColumn(name = "producto_sku"))
    @MapKeyColumn(name = "clave", length = 50)
    @Column(name = "valor", nullable = false, length = 255)
    @Builder.Default
    private Map<String, String> detalles = new LinkedHashMap<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
