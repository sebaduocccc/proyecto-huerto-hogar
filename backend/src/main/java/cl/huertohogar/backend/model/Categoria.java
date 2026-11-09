package cl.huertohogar.backend.model;

import jakarta.persistence.*;
import lombok.*;

/** Categoria de productos (Frutas, Verduras, Organicos, Lacteos). */
@Entity
@Table(name = "categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;
}
