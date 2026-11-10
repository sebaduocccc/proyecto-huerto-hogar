package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.config.JwtProperties;
import cl.huertohogar.backend.dto.ErrorResponse;
import cl.huertohogar.backend.dto.auth.AuthResponse;
import cl.huertohogar.backend.dto.auth.LoginRequest;
import cl.huertohogar.backend.dto.usuario.RegistroRequest;
import cl.huertohogar.backend.dto.usuario.UsuarioResponse;
import cl.huertohogar.backend.service.AuthService;
import cl.huertohogar.backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.time.Duration;

/**
 * Autenticacion con dos tokens:
 * - accessToken (JWT, 15 min) en el cuerpo: el frontend lo guarda en memoria y lo manda en "Authorization: Bearer".
 * - refreshToken (7 dias) en cookie httpOnly + SameSite=Strict, limitada a /api/auth: JavaScript no puede leerla
 *   (protege contra XSS) y permite recuperar la sesion al recargar la pagina llamando a /refresh.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación")
public class AuthController {

    private static final String RUTA_COOKIE = "/api/auth";

    private final UsuarioService usuarioService;
    private final AuthService authService;
    private final JwtProperties jwtProperties;

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar una cuenta de cliente",
            description = "Crea un usuario con rol USUARIO. Valida RUT, teléfono (+56 9), edad mínima de 18 años y correo único.")
    @ApiResponse(responseCode = "201", description = "Cuenta creada")
    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Correo o RUT ya registrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public UsuarioResponse registrar(@Valid @RequestBody RegistroRequest request) {
        return usuarioService.registrar(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión",
            description = "Devuelve el accessToken (JWT) y los datos del usuario, y deja el refresh token en una cookie httpOnly.")
    @ApiResponse(responseCode = "200", description = "Sesión iniciada")
    @ApiResponse(responseCode = "401", description = "Correo o contraseña incorrectos", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return conCookie(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar la sesión",
            description = "Usa la cookie de refresh para emitir un accessToken nuevo (y rota la cookie). " +
                    "El frontend lo llama al cargar la página y cuando el accessToken expira.")
    @ApiResponse(responseCode = "200", description = "Sesión renovada")
    @ApiResponse(responseCode = "401", description = "No hay sesión o expiró", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request) {
        return conCookie(authService.refrescar(leerCookie(request)));
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesión", description = "Revoca el refresh token y borra la cookie.")
    @ApiResponse(responseCode = "204", description = "Sesión cerrada")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(leerCookie(request));
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie("", Duration.ZERO).toString())
                .build();
    }

    // ------------------------------------------------------------------ cookie

    private ResponseEntity<AuthResponse> conCookie(AuthService.Sesion sesion) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie(sesion.refreshToken(), jwtProperties.refreshTtl()).toString())
                .body(sesion.respuesta());
    }

    private ResponseCookie cookie(String valor, Duration duracion) {
        return ResponseCookie.from(jwtProperties.cookieName(), valor)
                .httpOnly(true)
                .secure(jwtProperties.cookieSecure())
                .sameSite("Strict")
                .path(RUTA_COOKIE)
                .maxAge(duracion)
                .build();
    }

    private String leerCookie(HttpServletRequest request) {
        Cookie c = WebUtils.getCookie(request, jwtProperties.cookieName());
        return c == null ? null : c.getValue();
    }
}
