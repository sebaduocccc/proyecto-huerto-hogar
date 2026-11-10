package cl.huertohogar.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/** Refresh token emitido a un usuario. Solo se persiste el hash del valor. */
@Entity
@Table(name = "refresh_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    @Column(name = "expira_en", nullable = false)
    private LocalDateTime expiraEn;

    @Column(name = "revocado_en")
    private LocalDateTime revocadoEn;

    @Column(nullable = false)
    private boolean rotado;

    public boolean estaRevocado() {
        return revocadoEn != null;
    }

    public boolean estaExpirado(LocalDateTime ahora) {
        return ahora.isAfter(expiraEn);
    }
}
