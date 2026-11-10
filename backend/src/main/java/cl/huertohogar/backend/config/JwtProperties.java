package cl.huertohogar.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/** Configuracion de tokens (prefijo app.jwt en application.yaml). */
@ConfigurationProperties("app.jwt")
public record JwtProperties(
        String secret,
        String issuer,
        Duration accessTtl,
        Duration refreshTtl,
        Duration refreshReuseGrace,
        String cookieName,
        boolean cookieSecure
) {
}
