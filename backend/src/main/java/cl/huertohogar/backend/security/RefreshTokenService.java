package cl.huertohogar.backend.security;

import cl.huertohogar.backend.config.JwtProperties;
import cl.huertohogar.backend.exception.SesionInvalidaException;
import cl.huertohogar.backend.model.RefreshToken;
import cl.huertohogar.backend.model.Usuario;
import cl.huertohogar.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

/**
 * Refresh tokens opacos (256 bits aleatorios) con rotacion y deteccion de reutilizacion.
 * - Al usarse, el token se revoca y se emite uno nuevo (rotacion).
 * - Si llega un token ya rotado (fuera del margen de gracia), se asume robo y se cierran
 *   TODAS las sesiones del usuario.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    public record Rotacion(Usuario usuario, String nuevoToken) {
    }

    private static final SecureRandom RANDOM = new SecureRandom();

    private final RefreshTokenRepository repository;
    private final JwtProperties props;

    @Transactional
    public String crear(Usuario usuario) {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String valor = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        LocalDateTime ahora = LocalDateTime.now();
        repository.save(RefreshToken.builder()
                .usuario(usuario)
                .tokenHash(hash(valor))
                .creadoEn(ahora)
                .expiraEn(ahora.plus(props.refreshTtl()))
                .build());
        return valor;
    }

    /** noRollbackFor: si se detecta robo, la revocacion masiva debe quedar guardada aunque se lance la excepcion. */
    @Transactional(noRollbackFor = SesionInvalidaException.class)
    public Rotacion rotar(String valor) {
        LocalDateTime ahora = LocalDateTime.now();
        RefreshToken actual = buscar(valor);
        Usuario usuario = actual.getUsuario();

        if (actual.estaRevocado()) {
            boolean dentroDeGracia = actual.isRotado()
                    && actual.getRevocadoEn().plus(props.refreshReuseGrace()).isAfter(ahora);
            if (!dentroDeGracia) {
                repository.revocarTodosDeUsuario(usuario.getId(), ahora);
                log.warn("Reutilización de refresh token del usuario id={}: se cierran todas sus sesiones", usuario.getId());
            }
            throw new SesionInvalidaException("La sesión ya no es válida");
        }
        if (actual.estaExpirado(ahora)) {
            throw new SesionInvalidaException("La sesión expiró, inicia sesión nuevamente");
        }
        if (!usuario.isActivo()) {
            repository.revocarTodosDeUsuario(usuario.getId(), ahora);
            throw new SesionInvalidaException("La cuenta está desactivada");
        }

        actual.setRevocadoEn(ahora);
        actual.setRotado(true);
        return new Rotacion(usuario, crear(usuario));
    }

    /** Logout de la sesion actual. Si el token no existe no hace nada. */
    @Transactional
    public void revocar(String valor) {
        repository.findByTokenHash(hash(valor)).ifPresent(t -> {
            if (!t.estaRevocado()) t.setRevocadoEn(LocalDateTime.now());
        });
    }

    @Transactional
    public void revocarTodos(Long usuarioId) {
        repository.revocarTodosDeUsuario(usuarioId, LocalDateTime.now());
    }

    /** Limpieza diaria (4 AM) de tokens vencidos hace mas de un dia. */
    @Scheduled(cron = "0 0 4 * * *")
    @Transactional
    public void limpiarExpirados() {
        int borrados = repository.eliminarExpiradosAntesDe(LocalDateTime.now().minusDays(1));
        if (borrados > 0) log.info("Eliminados {} refresh tokens expirados", borrados);
    }

    private RefreshToken buscar(String valor) {
        return repository.findByTokenHash(hash(valor))
                .orElseThrow(() -> new SesionInvalidaException("La sesión no es válida"));
    }

    /** SHA-256 en hex: si alguien roba la BD, no obtiene tokens usables. */
    static String hash(String valor) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(valor.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
