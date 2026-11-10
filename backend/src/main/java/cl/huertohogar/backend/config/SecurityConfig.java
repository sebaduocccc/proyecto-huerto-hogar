package cl.huertohogar.backend.config;

import cl.huertohogar.backend.security.JwtAuthFilter;
import cl.huertohogar.backend.security.JwtService;
import cl.huertohogar.backend.security.RespuestasSeguridad;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Seguridad de la API.
 * Capa 1 (aqui): que rutas son publicas y cuales exigen sesion.
 * Capa 2 (@PreAuthorize en los controladores): que PERMISO exige cada accion.
 * La autenticacion la hace JwtAuthFilter a partir del header Authorization: Bearer.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    public static final String[] SWAGGER = {"/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**"};

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtService jwtService,
                                                   RespuestasSeguridad respuestas) throws Exception {
        return http
                .cors(Customizer.withDefaults())                  // usa el bean corsConfigurationSource
                .csrf(AbstractHttpConfigurer::disable)            // el access token va en un header, no en cookie;
                                                                  // la cookie de refresh es SameSite=Strict
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(SWAGGER).permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()   // preflight CORS
                        // invitado: ver catalogo
                        .requestMatchers(HttpMethod.GET, "/api/productos/**", "/api/categorias/**").permitAll()
                        // invitado: registrarse / login / refresh / logout / comprar
                        .requestMatchers(HttpMethod.POST, "/api/auth/**", "/api/ventas").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(respuestas)
                        .accessDeniedHandler(respuestas))
                .addFilterBefore(new JwtAuthFilter(jwtService, respuestas), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /** Solo el frontend configurado puede llamar a la API desde el navegador (y enviar la cookie). */
    @Bean
    public CorsConfigurationSource corsConfigurationSource(CorsProperties cors) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(cors.allowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);   // necesario para la cookie de refresh
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    /**
     * El login lo resuelve AuthService (no se usa el formulario de Spring). Este bean solo evita que
     * Spring Boot cree un usuario en memoria con contraseña generada.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UsernameNotFoundException("Autenticación solo mediante JWT");
        };
    }
}
