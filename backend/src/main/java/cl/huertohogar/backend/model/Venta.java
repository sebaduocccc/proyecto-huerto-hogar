package cl.huertohogar.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Venta / boleta. Reemplaza "phuertohogar_ventas" y "HuertoHogarCompraConfirmada" del frontend.
 * Si el cliente compro como invitado, usuario es null.
 */
@Entity
@Table(name = "venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // datos de envio y contacto (formulario de Pago)
    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 150)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @Column(nullable = false, length = 255)
    private String direccion;

    @Column(nullable = false, length = 100)
    private String ciudad;

    @Column(name = "codigo_postal", length = 20)
    private String codigoPostal;

    @Column(nullable = false, length = 60)
    private String pais;

    @Column(nullable = false)
    private Integer total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20)")
    @Builder.Default
    private EstadoVenta estado = EstadoVenta.CONFIRMADA;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetalleVenta> detalles = new ArrayList<>();

    public void agregarDetalle(DetalleVenta detalle) {
        detalle.setVenta(this);
        detalles.add(detalle);
    }

    @PrePersist
    void prePersist() {
        if (fecha == null) fecha = LocalDateTime.now();
    }
}
