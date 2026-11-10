package cl.huertohogar.backend.service;

import cl.huertohogar.backend.dto.auth.AuthResponse;
import cl.huertohogar.backend.dto.auth.LoginRequest;
import cl.huertohogar.backend.dto.usuario.UsuarioResponse;
import cl.huertohogar.backend.exception.SesionInvalidaException;
import cl.huertohogar.backend.model.Usuario;
import cl.huertohogar.backend.repository.UsuarioRepository;
import cl.huertohogar.backend.security.JwtService;
import cl.huertohogar.backend.security.RefreshTokenService;
import cl.huertohogar.backend.util.Textos;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Inicio de sesion, renovacion y cierre de sesion. */
@Slf4j
@Service
public class AuthService {

    /** Resultado interno: la respuesta JSON + el refresh token que el controlador pone en la cookie. */
    public record Sesion(AuthResponse respuesta, String refreshToken) {
    }

    private static final String CREDENCIALES_INVALIDAS = "Correo o contraseña incorrectos";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    /** Hash de relleno: se compara aunque el correo no exista, para no revelar por tiempo de respuesta qué correos están registrados. */
    private final String hashDeRelleno;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.hashDeRelleno = passwordEncoder.encode("relleno-para-tiempo-constante");
    }

    @Transactional
    public Sesion login(LoginRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(Textos.normalizarEmail(req.email())).orElse(null);
        if (usuario == null) {
            passwordEncoder.matches(req.password(), hashDeRelleno);
            throw new SesionInvalidaException(CREDENCIALES_INVALIDAS);
        }
        if (!passwordEncoder.matches(req.password(), usuario.getPassword())) {
            log.info("Login fallido para usuario id={}", usuario.getId());
            throw new SesionInvalidaException(CREDENCIALES_INVALIDAS);
        }
        if (!usuario.isActivo()) {
            throw new SesionInvalidaException("La cuenta está desactivada");
        }
        log.info("Login exitoso usuario id={}", usuario.getId());
        return emitir(usuario, refreshTokenService.crear(usuario));
    }

    /** Rota el refresh token y emite un access token nuevo con los permisos ACTUALES del rol. */
    @Transactional(noRollbackFor = SesionInvalidaException.class)
    public Sesion refrescar(String refreshToken) {
        if (Textos.estaVacio(refreshToken)) {
            throw new SesionInvalidaException("No hay una sesión activa");
        }
        RefreshTokenService.Rotacion rotacion = refreshTokenService.rotar(refreshToken);
        return emitir(rotacion.usuario(), rotacion.nuevoToken());
    }

    @Transactional
    public void logout(String refreshToken) {
        if (!Textos.estaVacio(refreshToken)) {
            refreshTokenService.revocar(refreshToken);
        }
    }

    private Sesion emitir(Usuario usuario, String refreshToken) {
        AuthResponse respuesta = new AuthResponse(jwtService.generarAccessToken(usuario), "Bearer",
                jwtService.accessTtlSegundos(), UsuarioResponse.desde(usuario));
        return new Sesion(respuesta, refreshToken);
    }
}
