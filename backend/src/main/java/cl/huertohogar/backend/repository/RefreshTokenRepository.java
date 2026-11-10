package cl.huertohogar.backend.repository;

import cl.huertohogar.backend.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /**
     * Cierra todas las sesiones de un usuario (cambio de rol/contraseña, desactivacion, robo detectado).
     * Es un UPDATE masivo: flushAutomatically guarda antes los cambios pendientes y clearAutomatically
     * descarta las entidades en memoria, para que lecturas posteriores vean la revocacion.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE RefreshToken t SET t.revocadoEn = :ahora WHERE t.usuario.id = :usuarioId AND t.revocadoEn IS NULL")
    int revocarTodosDeUsuario(@Param("usuarioId") Long usuarioId, @Param("ahora") LocalDateTime ahora);

    long countByUsuarioIdAndRevocadoEnIsNull(Long usuarioId);

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.expiraEn < :limite")
    int eliminarExpiradosAntesDe(@Param("limite") LocalDateTime limite);
}
