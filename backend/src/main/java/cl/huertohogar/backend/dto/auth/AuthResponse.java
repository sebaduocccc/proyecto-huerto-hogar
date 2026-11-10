package cl.huertohogar.backend.dto.auth;

import cl.huertohogar.backend.dto.usuario.UsuarioResponse;

/**
 * Respuesta de login y refresh. El refresh token NO viaja aqui: va en una cookie httpOnly.
 * @param expiraEn segundos de vida del accessToken
 */
public record AuthResponse(String accessToken, String tokenType, long expiraEn, UsuarioResponse usuario) {
}
