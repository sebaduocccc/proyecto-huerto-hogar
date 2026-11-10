package cl.huertohogar.backend.security;

import cl.huertohogar.backend.config.JwtProperties;
import cl.huertohogar.backend.repository.RefreshTokenRepository;
import cl.huertohogar.backend.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Flujo completo de autenticacion JWT contra el backend real.
 * refresh-reuse-grace=0s para poder probar la deteccion de reutilizacion de refresh tokens.
 */
@SpringBootTest(properties = "app.jwt.refresh-reuse-grace=0s")
@AutoConfigureMockMvc
@Transactional
class AuthIT {

    @Autowired MockMvc mvc;
    @Autowired JwtProperties jwtProperties;
    @Autowired UsuarioRepository usuarioRepository;
    @Autowired RefreshTokenRepository refreshTokenRepository;

    static final String ADMIN = "{\"email\":\"admin@huertohogar.cl\",\"password\":\"admin123\"}";

    MvcResult login(String json) throws Exception {
        return mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk()).andReturn();
    }

    String accessToken(MvcResult r) throws Exception {
        return r.getResponse().getContentAsString().replaceAll(".*\"accessToken\":\"([^\"]+)\".*", "$1");
    }

    Cookie refreshCookie(MvcResult r) {
        return r.getResponse().getCookie(jwtProperties.cookieName());
    }

    String bearer(String token) {
        return "Bearer " + token;
    }

    void registrarCliente() throws Exception {
        mvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content("""
                {"nombre":"Juan Pérez","email":"juan@mail.cl","password":"clave123","telefono":"+56912345678",
                 "rut":"11.111.111-1","fechaNacimiento":"1995-05-10","region":"RM","comuna":"Santiago","direccion":"Calle 1"}"""))
                .andExpect(status().isCreated());
    }

    // ------------------------------------------------------------------ login

    @Test
    void loginDevuelveJwtConPermisosYCookieSegura() throws Exception {
        MvcResult r = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(ADMIN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiraEn").value(900))
                .andExpect(jsonPath("$.usuario.rol").value("ADMIN"))
                .andExpect(jsonPath("$.usuario.permisos", hasItem("ROLES_GESTIONAR")))
                .andExpect(jsonPath("$.refreshToken").doesNotExist())   // nunca en el cuerpo
                .andReturn();

        String setCookie = r.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertThat(setCookie).contains("HttpOnly", "SameSite=Strict", "Path=/api/auth");

        // el JWT tiene 3 partes y sirve para entrar a rutas protegidas
        String token = accessToken(r);
        assertThat(token.split("\\.")).hasSize(3);
        mvc.perform(get("/api/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk());
    }

    @Test
    void credencialesIncorrectasDan401SinRevelarSiElCorreoExiste() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@huertohogar.cl\",\"password\":\"mala\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Correo o contraseña incorrectos"));
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"noexiste@mail.cl\",\"password\":\"mala\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Correo o contraseña incorrectos"));
    }

    @Test
    void emailNoDistingueMayusculas() throws Exception {
        login("{\"email\":\"  ADMIN@HuertoHogar.cl \",\"password\":\"admin123\"}");
    }

    // ------------------------------------------------------------------ roles en el token

    @Test
    void clienteConTokenNoEntraAAdministracion() throws Exception {
        registrarCliente();
        String token = accessToken(login("{\"email\":\"juan@mail.cl\",\"password\":\"clave123\"}"));

        mvc.perform(get("/api/cuenta/perfil").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("juan@mail.cl"));
        mvc.perform(get("/api/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/productos/FR001").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isForbidden());
    }

    @Test
    void compraConTokenQuedaAsociadaAlUsuario() throws Exception {
        registrarCliente();
        String token = accessToken(login("{\"email\":\"juan@mail.cl\",\"password\":\"clave123\"}"));
        Long id = usuarioRepository.findByEmail("juan@mail.cl").orElseThrow().getId();

        mvc.perform(post("/api/ventas").header(HttpHeaders.AUTHORIZATION, bearer(token))
                        .contentType(MediaType.APPLICATION_JSON).content("""
                                {"nombre":"Juan","correo":"juan@mail.cl","direccion":"Calle 1","ciudad":"Santiago",
                                 "pais":"Chile","items":[{"sku":"FR001","cantidad":1}]}"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuarioId").value(id));
    }

    // ------------------------------------------------------------------ tokens invalidos

    @Test
    void tokenAlteradoOExpiradoDa401() throws Exception {
        String token = accessToken(login(ADMIN));
        String alterado = token.substring(0, token.length() - 3) + (token.endsWith("aaa") ? "bbb" : "aaa");

        mvc.perform(get("/api/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(alterado)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Token inválido o expirado"));

        String expirado = Jwts.builder()
                .issuer(jwtProperties.issuer()).subject("1")
                .claim("rol", "ADMIN").claim("permisos", List.of("USUARIOS_GESTIONAR")).claim("tipo", "access")
                .issuedAt(Date.from(Instant.now().minusSeconds(3600)))
                .expiration(Date.from(Instant.now().minusSeconds(60)))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret())))
                .compact();
        mvc.perform(get("/api/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(expirado)))
                .andExpect(status().isUnauthorized());

        // un token firmado con OTRA clave tampoco sirve (alguien intentando darse permisos)
        String falso = Jwts.builder()
                .issuer(jwtProperties.issuer()).subject("1")
                .claim("rol", "ADMIN").claim("permisos", List.of("USUARIOS_GESTIONAR")).claim("tipo", "access")
                .expiration(Date.from(Instant.now().plusSeconds(600)))
                .signWith(Jwts.SIG.HS256.key().build())
                .compact();
        mvc.perform(get("/api/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(falso)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenExpiradoEnRutaPublicaTambienDa401ParaQueElFrontendRenueve() throws Exception {
        mvc.perform(get("/api/productos").header(HttpHeaders.AUTHORIZATION, bearer("basura")))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/productos")).andExpect(status().isOk());
    }

    // ------------------------------------------------------------------ refresh

    @Test
    void refreshRotaLaCookieYEmiteNuevoAccessToken() throws Exception {
        Cookie c1 = refreshCookie(login(ADMIN));

        MvcResult r2 = mvc.perform(post("/api/auth/refresh").cookie(c1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.usuario.email").value("admin@huertohogar.cl"))
                .andReturn();
        Cookie c2 = refreshCookie(r2);
        assertThat(c2.getValue()).isNotEqualTo(c1.getValue());

        mvc.perform(get("/api/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(accessToken(r2))))
                .andExpect(status().isOk());
    }

    @Test
    void refreshSinCookieDa401() throws Exception {
        mvc.perform(post("/api/auth/refresh")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/refresh").cookie(new Cookie(jwtProperties.cookieName(), "inventado")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void reutilizarUnRefreshViejoCierraTodasLasSesiones() throws Exception {
        Cookie viejo = refreshCookie(login(ADMIN));
        Cookie nuevo = refreshCookie(mvc.perform(post("/api/auth/refresh").cookie(viejo)).andReturn());

        // alguien (un atacante) usa el token viejo
        mvc.perform(post("/api/auth/refresh").cookie(viejo)).andExpect(status().isUnauthorized());
        // consecuencia: tambien se invalida el token nuevo del usuario legitimo
        mvc.perform(post("/api/auth/refresh").cookie(nuevo)).andExpect(status().isUnauthorized());
    }

    @Test
    void logoutInvalidaElRefreshYBorraLaCookie() throws Exception {
        Cookie c = refreshCookie(login(ADMIN));

        MvcResult r = mvc.perform(post("/api/auth/logout").cookie(c))
                .andExpect(status().isNoContent()).andReturn();
        assertThat(r.getResponse().getHeader(HttpHeaders.SET_COOKIE)).contains("Max-Age=0");

        mvc.perform(post("/api/auth/refresh").cookie(c)).andExpect(status().isUnauthorized());
    }

    @Test
    void cambiarElRolDeUnUsuarioCierraSusSesiones() throws Exception {
        registrarCliente();
        Cookie sesionCliente = refreshCookie(login("{\"email\":\"juan@mail.cl\",\"password\":\"clave123\"}"));
        Long id = usuarioRepository.findByEmail("juan@mail.cl").orElseThrow().getId();
        String admin = accessToken(login(ADMIN));

        mvc.perform(put("/api/usuarios/" + id).header(HttpHeaders.AUTHORIZATION, bearer(admin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Juan Pérez\",\"email\":\"juan@mail.cl\",\"rol\":\"ADMIN\"}"))
                .andExpect(status().isOk());

        assertThat(refreshTokenRepository.countByUsuarioIdAndRevocadoEnIsNull(id)).isZero();
        mvc.perform(post("/api/auth/refresh").cookie(sesionCliente)).andExpect(status().isUnauthorized());

        // al volver a entrar recibe los permisos nuevos
        login("{\"email\":\"juan@mail.cl\",\"password\":\"clave123\"}");
    }

    @Test
    void cuentaDesactivadaNoPuedeEntrar() throws Exception {
        registrarCliente();
        Long id = usuarioRepository.findByEmail("juan@mail.cl").orElseThrow().getId();
        String admin = accessToken(login(ADMIN));
        mvc.perform(put("/api/usuarios/" + id).header(HttpHeaders.AUTHORIZATION, bearer(admin))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Juan Pérez\",\"email\":\"juan@mail.cl\",\"activo\":false}"));

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"juan@mail.cl\",\"password\":\"clave123\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("La cuenta está desactivada"));
    }

    // ------------------------------------------------------------------ CORS

    @Test
    void corsPermiteSoloAlFrontend() throws Exception {
        mvc.perform(options("/api/productos")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Authorization,Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));

        mvc.perform(options("/api/productos")
                        .header(HttpHeaders.ORIGIN, "http://sitio-malicioso.com")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isForbidden());
    }
}
