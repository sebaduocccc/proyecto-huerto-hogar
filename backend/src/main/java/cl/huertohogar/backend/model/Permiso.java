package cl.huertohogar.backend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Permiso atomico del sistema (ej: PRODUCTOS_GESTIONAR).
 * Los permisos se asignan a roles; la seguridad del backend se basa en estos permisos,
 * por lo que un rol nuevo creado por un administrador funciona sin tocar codigo.
 */
@Entity
@Table(name = "permiso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(length = 255)
    private String descripcion;
}
