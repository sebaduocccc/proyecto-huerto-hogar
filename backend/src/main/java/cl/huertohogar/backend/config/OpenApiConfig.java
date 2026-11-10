package cl.huertohogar.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Configuration;

/** Documentacion OpenAPI / Swagger UI disponible en /swagger-ui.html */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Huerto Hogar API",
                version = "1.0",
                description = """
                        API REST de la tienda online Huerto Hogar.

                        - **Público (invitado):** catálogo, categorías, registro, login y compra.
                        - **Usuario registrado:** perfil propio e historial de compras.
                        - **Administración:** productos, categorías, usuarios, roles y ventas, según los permisos del rol.

                        Para probar endpoints protegidos: inicia sesión, copia el `accessToken` y pégalo en **Authorize**.
                        """,
                contact = @Contact(name = "Equipo Huerto Hogar")
        ),
        tags = {
                @Tag(name = "Autenticación", description = "Registro, inicio de sesión y renovación de tokens"),
                @Tag(name = "Productos", description = "Catálogo de productos"),
                @Tag(name = "Categorías", description = "Categorías del catálogo"),
                @Tag(name = "Ventas", description = "Checkout y seguimiento de pedidos"),
                @Tag(name = "Mi cuenta", description = "Perfil e historial del usuario con sesión iniciada"),
                @Tag(name = "Usuarios", description = "Administración de usuarios"),
                @Tag(name = "Roles y permisos", description = "Administración de roles personalizados"),
                @Tag(name = "Administración", description = "Resumen del panel de administración")
        }
)
@SecurityScheme(
        name = OpenApiConfig.BEARER,
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER,
        description = "Pega solo el accessToken (sin la palabra Bearer)"
)
public class OpenApiConfig {
    public static final String BEARER = "bearerAuth";
}
