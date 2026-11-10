package cl.huertohogar.backend.controller;

import cl.huertohogar.backend.repository.UsuarioRepository;
import cl.huertohogar.backend.security.UsuarioAutenticado;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Pruebas HTTP de la API completa (controlador -> servicio -> MySQL), con rollback por test.
 * El usuario autenticado se simula; en la tarea de seguridad saldra del JWT.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ApiIT {

    @Autowired MockMvc mvc;
    @Autowired UsuarioRepository usuarioRepository;

    /** Simula un usuario con sesion y los permisos indicados. */
    RequestPostProcessor como(Long id, String rol, String... permisos) {
        var authorities = Arrays.stream(permisos).map(SimpleGrantedAuthority::new).toList();
        return authentication(new UsernamePasswordAuthenticationToken(
                new UsuarioAutenticado(id, "test@mail.cl", rol), null, authorities));
    }

    RequestPostProcessor admin() {
        Long id = usuarioRepository.findByEmail("admin@huertohogar.cl").orElseThrow().getId();
        return como(id, "ADMIN", "PERFIL_PROPIO", "COMPRAS_PROPIAS", "PRODUCTOS_GESTIONAR", "CATEGORIAS_GESTIONAR",
                "USUARIOS_GESTIONAR", "ROLES_GESTIONAR", "VENTAS_GESTIONAR");
    }

    static final String REGISTRO = """
            {"nombre":"Juan Pérez","email":"juan@mail.cl","password":"clave123","telefono":"+56 9 1234 5678",
             "rut":"11.111.111-1","fechaNacimiento":"1995-05-10","region":"Región Metropolitana de Santiago",
             "comuna":"Santiago","direccion":"Calle Falsa 123"}""";

    static final String VENTA = """
            {"nombre":"Cliente","correo":"cliente@mail.cl","direccion":"Calle 1","ciudad":"Santiago","pais":"Chile",
             "items":[{"sku":"FR001","cantidad":2},{"sku":"PL001","cantidad":1}]}""";

    // ------------------------------------------------------------------ invitado

    @Test
    void invitadoVeCatalogoYCategorias() throws Exception {
        mvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(9)));
        mvc.perform(get("/api/productos").param("categoria", "Verduras"))
                .andExpect(jsonPath("$[*].sku", contains("VR001", "VR002", "VR003")));
        mvc.perform(get("/api/productos/FR001"))
                .andExpect(jsonPath("$.nombre").value("Manzanas Fuji"))
                .andExpect(jsonPath("$.categoria").value("Frutas"))
                .andExpect(jsonPath("$.detalles.Origen").value("Chile"));
        mvc.perform(get("/api/categorias")).andExpect(jsonPath("$", hasSize(4)));
    }

    @Test
    void productoInexistenteDa404ConFormatoDeError() throws Exception {
        mvc.perform(get("/api/productos/XX999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.mensaje").value(containsString("XX999")));
    }

    @Test
    void invitadoSeRegistraSinExponerPassword() throws Exception {
        mvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content(REGISTRO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rol").value("USUARIO"))
                .andExpect(jsonPath("$.rut").value("11111111-1"))
                .andExpect(jsonPath("$.password").doesNotExist());

        mvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content(REGISTRO))
                .andExpect(status().isConflict());
    }

    @Test
    void registroInvalidoDevuelveErroresPorCampo() throws Exception {
        mvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON)
                        .content(REGISTRO.replace("11.111.111-1", "11.111.111-2")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.rut").exists());
    }

    @Test
    void invitadoCompraSinCuenta() throws Exception {
        mvc.perform(post("/api/ventas").contentType(MediaType.APPLICATION_JSON).content(VENTA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuarioId").value(nullValue()))
                .andExpect(jsonPath("$.total").value(2 * 1200 + 1000))
                .andExpect(jsonPath("$.estado").value("CONFIRMADA"))
                .andExpect(jsonPath("$.items", hasSize(2)));

        mvc.perform(get("/api/productos/FR001")).andExpect(jsonPath("$.stock").value(8));
    }

    @Test
    void stockInsuficienteDa409() throws Exception {
        mvc.perform(post("/api/ventas").contentType(MediaType.APPLICATION_JSON)
                        .content(VENTA.replace("\"cantidad\":2", "\"cantidad\":50")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensaje").value(containsString("Stock insuficiente")));
    }

    // ------------------------------------------------------------------ restricciones

    @Test
    void invitadoNoAccedeAZonasPrivadas() throws Exception {
        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Debes iniciar sesión"));
        mvc.perform(get("/api/productos/stock-bajo")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/cuenta/perfil")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/usuarios")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/resumen")).andExpect(status().isUnauthorized());
    }

    @Test
    void clienteNoAccedeAAdministracion() throws Exception {
        var cliente = como(999L, "USUARIO", "PERFIL_PROPIO", "COMPRAS_PROPIAS");
        mvc.perform(get("/api/usuarios").with(cliente)).andExpect(status().isForbidden());
        mvc.perform(get("/api/ventas").with(cliente)).andExpect(status().isForbidden());
        mvc.perform(get("/api/admin/resumen").with(cliente)).andExpect(status().isForbidden());
        mvc.perform(delete("/api/productos/FR001").with(cliente))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.mensaje").value("No tienes permisos para realizar esta acción"));
    }

    @Test
    void rolPersonalizadoSoloAccedeASusPermisos() throws Exception {
        var bodeguero = como(999L, "BODEGUERO", "PRODUCTOS_GESTIONAR");
        mvc.perform(get("/api/productos/stock-bajo").with(bodeguero)).andExpect(status().isOk());
        mvc.perform(get("/api/admin/resumen").with(bodeguero)).andExpect(status().isOk());
        mvc.perform(get("/api/usuarios").with(bodeguero)).andExpect(status().isForbidden());
    }

    // ------------------------------------------------------------------ cuenta

    @Test
    void usuarioVeYEditaSuPerfilYSusCompras() throws Exception {
        mvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content(REGISTRO));
        Long id = usuarioRepository.findByEmail("juan@mail.cl").orElseThrow().getId();
        var juan = como(id, "USUARIO", "PERFIL_PROPIO", "COMPRAS_PROPIAS");

        mvc.perform(get("/api/cuenta/perfil").with(juan))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("juan@mail.cl"));

        mvc.perform(put("/api/cuenta/perfil").with(juan).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Juan P.\",\"direccion\":\"Nueva 456\",\"telefono\":\"+56987654321\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.direccion").value("Nueva 456"));

        // compra con sesion -> queda en su historial
        mvc.perform(post("/api/ventas").with(juan).contentType(MediaType.APPLICATION_JSON).content(VENTA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuarioId").value(id));
        mvc.perform(get("/api/cuenta/compras").with(juan)).andExpect(jsonPath("$", hasSize(1)));
    }

    // ------------------------------------------------------------------ administracion (CRUD)

    @Test
    void adminCrudProductos() throws Exception {
        String nuevo = """
                {"sku":"FR010","nombre":"Peras","categoria":"Frutas","precio":1500,"stock":20,
                 "descripcion":"Peras dulces","detalles":{"Origen":"Chile"}}""";
        mvc.perform(post("/api/productos").with(admin()).contentType(MediaType.APPLICATION_JSON).content(nuevo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku").value("FR010"));

        mvc.perform(put("/api/productos/FR010").with(admin()).contentType(MediaType.APPLICATION_JSON)
                        .content(nuevo.replace("1500", "1800")))
                .andExpect(jsonPath("$.precio").value(1800));

        mvc.perform(delete("/api/productos/FR010").with(admin())).andExpect(status().isNoContent());
        mvc.perform(get("/api/productos/FR010")).andExpect(status().isNotFound());
    }

    @Test
    void adminCreaRolYUsuarioConEseRol() throws Exception {
        mvc.perform(post("/api/roles").with(admin()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Bodeguero\",\"permisos\":[\"PRODUCTOS_GESTIONAR\"]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("BODEGUERO"));

        mvc.perform(post("/api/usuarios").with(admin()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Pedro\",\"email\":\"pedro@huertohogar.cl\",\"password\":\"clave123\",\"rol\":\"BODEGUERO\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.permisos", contains("PRODUCTOS_GESTIONAR")));

        mvc.perform(get("/api/permisos").with(admin())).andExpect(jsonPath("$", hasSize(7)));
    }

    @Test
    void adminGestionaEstadoDeVentasYVeResumen() throws Exception {
        String body = mvc.perform(post("/api/ventas").contentType(MediaType.APPLICATION_JSON).content(VENTA))
                .andReturn().getResponse().getContentAsString();
        String id = body.replaceAll(".*\"id\":(\\d+).*", "$1");

        mvc.perform(patch("/api/ventas/" + id + "/estado").with(admin()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\":\"ENVIADA\"}"))
                .andExpect(jsonPath("$.estado").value("ENVIADA"));
        mvc.perform(patch("/api/ventas/" + id + "/estado").with(admin()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\":\"VOLANDO\"}"))
                .andExpect(status().isBadRequest());

        mvc.perform(get("/api/ventas").with(admin()).param("estado", "ENVIADA"))
                .andExpect(jsonPath("$[*].id", hasItem(Integer.valueOf(id))));
        mvc.perform(get("/api/admin/resumen").with(admin()))
                .andExpect(jsonPath("$.totalProductos").value(9))
                .andExpect(jsonPath("$.ultimasVentas").isNotEmpty());
    }

    @Test
    void adminNoPuedeEliminarse() throws Exception {
        Long id = usuarioRepository.findByEmail("admin@huertohogar.cl").orElseThrow().getId();
        mvc.perform(delete("/api/usuarios/" + id).with(admin())).andExpect(status().isBadRequest());
    }

    // ------------------------------------------------------------------ swagger

    @Test
    void swaggerDocumentaLaApi() throws Exception {
        mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("Huerto Hogar API"))
                .andExpect(jsonPath("$.paths['/api/productos'].post").exists())
                .andExpect(jsonPath("$.components.securitySchemes.bearerAuth").exists());
    }
}
