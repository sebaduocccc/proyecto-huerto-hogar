package cl.huertohogar.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

/**
 * Respuestas 401/403 generadas por los filtros de seguridad (antes de llegar al controlador),
 * con el mismo formato JSON que GlobalExceptionHandler.
 */
@Component
public class RespuestasSeguridad implements AuthenticationEntryPoint, AccessDeniedHandler {

    /** 401: no hay token o no es valido. */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException ex)
            throws IOException {
        escribir(response, request, HttpStatus.UNAUTHORIZED, "Debes iniciar sesión");
    }

    /** 403: hay sesion, pero sin permiso. */
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException ex)
            throws IOException {
        escribir(response, request, HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta acción");
    }

    private void escribir(HttpServletResponse response, HttpServletRequest request, HttpStatus status, String mensaje)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("""
                {"timestamp":"%s","status":%d,"error":"%s","mensaje":"%s","path":"%s"}"""
                .formatted(LocalDateTime.now(), status.value(), status.getReasonPhrase(), mensaje,
                        request.getRequestURI().replace("\\", "").replace("\"", "")));
    }
}
