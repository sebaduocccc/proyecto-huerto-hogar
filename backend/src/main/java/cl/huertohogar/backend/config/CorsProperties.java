package cl.huertohogar.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/** Origenes del frontend autorizados a llamar a la API (prefijo app.cors). */
@ConfigurationProperties("app.cors")
public record CorsProperties(List<String> allowedOrigins) {
}
