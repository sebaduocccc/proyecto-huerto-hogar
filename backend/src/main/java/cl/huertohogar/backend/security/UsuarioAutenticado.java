package cl.huertohogar.backend.security;

/**
 * Usuario de la peticion actual (el "principal" de Spring Security).
 * Se construye a partir del JWT; los controladores lo reciben con @AuthenticationPrincipal.
 * Es null cuando la peticion la hace un invitado.
 */
public record UsuarioAutenticado(Long id, String email, String rol) {
}
