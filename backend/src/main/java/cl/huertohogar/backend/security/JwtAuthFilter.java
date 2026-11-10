package cl.huertohogar.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Lee "Authorization: Bearer <token>", lo valida y deja al usuario autenticado en el SecurityContext.
 * - Sin header: la peticion sigue como invitado (las reglas de SecurityConfig deciden).
 * - Token invalido o expirado: 401 inmediato, para que el frontend renueve con /api/auth/refresh.
 *   (Asi una compra con sesion vencida no se registra por error como compra de invitado.)
 * No es @Component a proposito: solo debe ejecutarse dentro de la cadena de Spring Security.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String PREFIJO = "Bearer ";

    private final JwtService jwtService;
    private final RespuestasSeguridad respuestas;

    public JwtAuthFilter(JwtService jwtService, RespuestasSeguridad respuestas) {
        this.jwtService = jwtService;
        this.respuestas = respuestas;
    }

    /** Los endpoints de autenticacion no usan el access token (refresh se llama justo cuando expiro). */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith(PREFIJO)) {
            chain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(PREFIJO.length()).trim();
            SecurityContextHolder.getContext().setAuthentication(jwtService.autenticar(token));
        } catch (JwtException | IllegalArgumentException e) {
            SecurityContextHolder.clearContext();
            respuestas.escribir(request, response, HttpStatus.UNAUTHORIZED, "Token inválido o expirado");
            return;
        }
        chain.doFilter(request, response);
    }
}
