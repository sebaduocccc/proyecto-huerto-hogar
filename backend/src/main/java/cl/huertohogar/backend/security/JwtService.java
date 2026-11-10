package cl.huertohogar.backend.security;

import cl.huertohogar.backend.config.JwtProperties;
import cl.huertohogar.backend.model.Permiso;
import cl.huertohogar.backend.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Genera y verifica los access tokens (JWT firmados con HMAC-SHA256).
 * El token lleva el id (sub), email, rol y permisos, asi el backend autoriza sin consultar la BD
 * en cada peticion. Como dura poco (15 min), un cambio de rol se refleja en la siguiente renovacion.
 */
@Service
public class JwtService {

    private static final String TIPO_ACCESS = "access";

    private final JwtProperties props;
    private final SecretKey clave;

    public JwtService(JwtProperties props) {
        this.props = props;
        // lanza WeakKeyException al arrancar si el secreto tiene menos de 256 bits
        this.clave = Keys.hmacShaKeyFor(Decoders.BASE64.decode(props.secret()));
    }

    public String generarAccessToken(Usuario usuario) {
        Instant ahora = Instant.now();
        List<String> permisos = usuario.getRol().getPermisos().stream().map(Permiso::getNombre).sorted().toList();
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .issuer(props.issuer())
                .subject(String.valueOf(usuario.getId()))
                .claim("email", usuario.getEmail())
                .claim("rol", usuario.getRol().getNombre())
                .claim("permisos", permisos)
                .claim("tipo", TIPO_ACCESS)
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(props.accessTtl())))
                .signWith(clave, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Verifica firma, expiracion, emisor y tipo, y construye la autenticacion de Spring Security.
     * Authorities = permisos del rol + "ROLE_<rol>".
     *
     * @throws JwtException si el token no es valido
     */
    public Authentication autenticar(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(clave)
                .requireIssuer(props.issuer())
                .require("tipo", TIPO_ACCESS)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Long id = Long.valueOf(claims.getSubject());
        String email = claims.get("email", String.class);
        String rol = claims.get("rol", String.class);

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + rol));
        List<?> permisos = claims.get("permisos", List.class);
        if (permisos != null) {
            permisos.forEach(p -> authorities.add(new SimpleGrantedAuthority(String.valueOf(p))));
        }

        return UsernamePasswordAuthenticationToken.authenticated(new UsuarioAutenticado(id, email, rol), null, authorities);
    }

    public long accessTtlSegundos() {
        return props.accessTtl().toSeconds();
    }
}
