package cl.huertohogar.backend.service;

import cl.huertohogar.backend.config.PasswordConfig;
import cl.huertohogar.backend.dto.catalogo.ProductoRequest;
import cl.huertohogar.backend.dto.catalogo.ProductoResponse;
import cl.huertohogar.backend.dto.rol.RolRequest;
import cl.huertohogar.backend.dto.rol.RolResponse;
import cl.huertohogar.backend.dto.usuario.*;
import cl.huertohogar.backend.dto.venta.ItemVentaRequest;
import cl.huertohogar.backend.dto.venta.VentaRequest;
import cl.huertohogar.backend.dto.venta.VentaResponse;
import cl.huertohogar.backend.exception.ConflictoException;
import cl.huertohogar.backend.exception.RecursoNoEncontradoException;
import cl.huertohogar.backend.exception.ReglaNegocioException;
import cl.huertohogar.backend.model.EstadoVenta;
import cl.huertohogar.backend.repository.ProductoRepository;
import cl.huertohogar.backend.repository.RolRepository;
import cl.huertohogar.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Logica de negocio de los servicios contra el MySQL real (podman compose up -d db).
 * Cada test se revierte al terminar.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PasswordConfig.class, UsuarioService.class, RolService.class, CategoriaService.class,
        ProductoService.class, VentaService.class, AdminService.class})
class ServiciosIT {

    @Autowired UsuarioService usuarioService;
    @Autowired RolService rolService;
    @Autowired CategoriaService categoriaService;
    @Autowired ProductoService productoService;
    @Autowired VentaService ventaService;
    @Autowired AdminService adminService;
    @Autowired ProductoRepository productoRepository;
    @Autowired UsuarioRepository usuarioRepository;
    @Autowired RolRepository rolRepository;
    @Autowired PasswordEncoder passwordEncoder;

    Long adminId() {
        return usuarioRepository.findByEmail("admin@huertohogar.cl").orElseThrow().getId();
    }

    RegistroRequest registro(String email, String rut) {
        return new RegistroRequest("Juan Pérez", email, "clave123", "+56 9 1234 5678", rut,
                LocalDate.of(1995, 5, 10), "Región Metropolitana de Santiago", "Santiago", "Calle Falsa 123");
    }

    VentaRequest venta(ItemVentaRequest... items) {
        return new VentaRequest("Cliente", "Cliente@Mail.cl", "+56912345678", "Calle 1", "Santiago",
                "8320000", "Chile", List.of(items));
    }

    int stock(String sku) {
        return productoRepository.findById(sku).orElseThrow().getStock();
    }

    @Nested
    class Usuarios {

        @Test
        void registroNormalizaDatosYHasheaPassword() {
            UsuarioResponse u = usuarioService.registrar(registro("  JUAN@Mail.CL ", "11.111.111-1"));

            assertThat(u.email()).isEqualTo("juan@mail.cl");
            assertThat(u.rut()).isEqualTo("11111111-1");
            assertThat(u.telefono()).isEqualTo("+56912345678");
            assertThat(u.rol()).isEqualTo("USUARIO");
            assertThat(u.permisos()).containsExactlyInAnyOrder("PERFIL_PROPIO", "COMPRAS_PROPIAS");

            String hash = usuarioRepository.findById(u.id()).orElseThrow().getPassword();
            assertThat(hash).isNotEqualTo("clave123");
            assertThat(passwordEncoder.matches("clave123", hash)).isTrue();
        }

        @Test
        void registroRechazaEmailORutDuplicado() {
            usuarioService.registrar(registro("juan@mail.cl", "11.111.111-1"));

            assertThatThrownBy(() -> usuarioService.registrar(registro("JUAN@mail.cl", "22.222.222-2")))
                    .isInstanceOf(ConflictoException.class).hasMessageContaining("correo");
            assertThatThrownBy(() -> usuarioService.registrar(registro("otro@mail.cl", "11111111-1")))
                    .isInstanceOf(ConflictoException.class).hasMessageContaining("RUT");
        }

        @Test
        void cambiarPasswordExigeLaActual() {
            Long id = usuarioService.registrar(registro("juan@mail.cl", "11.111.111-1")).id();

            assertThatThrownBy(() -> usuarioService.cambiarPassword(id, new CambioPasswordRequest("mala", "nueva123")))
                    .isInstanceOf(ReglaNegocioException.class);

            usuarioService.cambiarPassword(id, new CambioPasswordRequest("clave123", "nueva123"));
            assertThat(passwordEncoder.matches("nueva123", usuarioRepository.findById(id).orElseThrow().getPassword())).isTrue();
        }

        @Test
        void adminNoPuedeEliminarseNiQuitarseElRol() {
            Long admin = adminId();
            assertThatThrownBy(() -> usuarioService.eliminar(admin, admin))
                    .isInstanceOf(ReglaNegocioException.class);

            UsuarioAdminRequest sinAdmin = new UsuarioAdminRequest("Administrador", "admin@huertohogar.cl", null,
                    "USUARIO", null, null, null, null, null, null, true);
            assertThatThrownBy(() -> usuarioService.actualizarPorAdmin(admin, sinAdmin, admin))
                    .isInstanceOf(ReglaNegocioException.class);
        }

        @Test
        void nuncaQuedaLaTiendaSinAdministrador() {
            Long admin = adminId();
            // otro admin intenta eliminar al unico admin activo
            assertThatThrownBy(() -> usuarioService.eliminar(admin, 9999L))
                    .isInstanceOf(ConflictoException.class);

            // con un segundo admin si se puede
            usuarioService.crearPorAdmin(new UsuarioAdminRequest("Admin 2", "admin2@huertohogar.cl", "clave123",
                    "admin", null, null, null, null, null, null, true));
            usuarioService.eliminar(admin, 9999L);
            assertThat(usuarioRepository.existsById(admin)).isFalse();
        }

        @Test
        void adminEditaSinCambiarPasswordSiVieneVacia() {
            Long id = usuarioService.registrar(registro("juan@mail.cl", "11.111.111-1")).id();
            String hashAntes = usuarioRepository.findById(id).orElseThrow().getPassword();

            UsuarioResponse editado = usuarioService.actualizarPorAdmin(id, new UsuarioAdminRequest("Juan Editado",
                    "juan@mail.cl", "", "USUARIO", "11.111.111-1", null, null, null, null, null, null), adminId());

            assertThat(editado.nombre()).isEqualTo("Juan Editado");
            assertThat(usuarioRepository.findById(id).orElseThrow().getPassword()).isEqualTo(hashAntes);
        }
    }

    @Nested
    class Roles {

        @Test
        void adminCreaRolPersonalizadoYSeLoAsignaAUnUsuario() {
            RolResponse rol = rolService.crear(new RolRequest("bodega central", "Gestiona stock",
                    Set.of("productos_gestionar")));
            assertThat(rol.nombre()).isEqualTo("BODEGA_CENTRAL");
            assertThat(rol.permisos()).containsExactly("PRODUCTOS_GESTIONAR");
            assertThat(rol.sistema()).isFalse();

            UsuarioResponse u = usuarioService.crearPorAdmin(new UsuarioAdminRequest("Bodeguero", "bodega@huertohogar.cl",
                    "clave123", "BODEGA_CENTRAL", null, null, null, null, null, null, true));
            assertThat(u.permisos()).containsExactly("PRODUCTOS_GESTIONAR");

            // no se puede borrar mientras tenga usuarios
            assertThatThrownBy(() -> rolService.eliminar(rol.id())).isInstanceOf(ConflictoException.class);
        }

        @Test
        void permisoInexistenteEsRechazado() {
            assertThatThrownBy(() -> rolService.crear(new RolRequest("RARO", null, Set.of("VOLAR"))))
                    .isInstanceOf(ReglaNegocioException.class).hasMessageContaining("VOLAR");
        }

        @Test
        void rolesDeSistemaProtegidos() {
            Long adminRol = rolRepository.findByNombre("ADMIN").orElseThrow().getId();
            Long usuarioRol = rolRepository.findByNombre("USUARIO").orElseThrow().getId();

            assertThatThrownBy(() -> rolService.actualizar(adminRol, new RolRequest("ADMIN", null, Set.of())))
                    .isInstanceOf(ReglaNegocioException.class);
            assertThatThrownBy(() -> rolService.actualizar(usuarioRol, new RolRequest("CLIENTE", null, Set.of())))
                    .isInstanceOf(ReglaNegocioException.class);
            assertThatThrownBy(() -> rolService.eliminar(usuarioRol))
                    .isInstanceOf(ReglaNegocioException.class);
        }
    }

    @Nested
    class Productos {

        @Test
        void crearYFiltrar() {
            productoService.crear(new ProductoRequest("fr010", "Peras", "frutas", 1500, 20, null, "Peras ricas",
                    Map.of("Origen", "Chile")));

            assertThat(productoService.listar("Frutas", null)).extracting(ProductoResponse::sku).contains("FR010");
            assertThat(productoService.listar(null, "peras")).extracting(ProductoResponse::sku).containsExactly("FR010");
            assertThatThrownBy(() -> productoService.crear(new ProductoRequest("FR010", "X", "Frutas", 1, 1, null, null, null)))
                    .isInstanceOf(ConflictoException.class);
            assertThatThrownBy(() -> productoService.crear(new ProductoRequest("ZZ001", "X", "Carnes", 1, 1, null, null, null)))
                    .isInstanceOf(ReglaNegocioException.class);
        }

        @Test
        void editarSinDetallesConservaLosActuales() {
            ProductoResponse p = productoService.actualizar("FR001",
                    new ProductoRequest(null, "Manzanas Fuji Premium", "Frutas", 1500, 30, null, "desc", null));

            assertThat(p.precio()).isEqualTo(1500);
            assertThat(p.detalles()).containsEntry("Variedad", "Fuji");
        }

        @Test
        void categoriaConProductosNoSeElimina() {
            Long frutas = categoriaService.listar().stream().filter(c -> c.nombre().equals("Frutas")).findFirst().orElseThrow().id();
            assertThatThrownBy(() -> categoriaService.eliminar(frutas)).isInstanceOf(ConflictoException.class);
        }
    }

    @Nested
    class Ventas {

        @Test
        void compraComoInvitadoCalculaTotalDesdeLaBDYDescuentaStock() {
            // FR001 repetido en el carrito: se agrupa
            VentaResponse v = ventaService.crear(venta(
                    new ItemVentaRequest("fr001", 2),
                    new ItemVentaRequest("PO001", 1),
                    new ItemVentaRequest("FR001", 1)), null);

            assertThat(v.usuarioId()).isNull();
            assertThat(v.correo()).isEqualTo("cliente@mail.cl");
            assertThat(v.estado()).isEqualTo(EstadoVenta.CONFIRMADA);
            assertThat(v.items()).hasSize(2);
            assertThat(v.total()).isEqualTo(3 * 1200 + 5000);
            assertThat(stock("FR001")).isEqualTo(7);
            assertThat(stock("PO001")).isEqualTo(9);
        }

        @Test
        void compraConSesionQuedaEnElHistorial() {
            Long id = usuarioService.registrar(registro("juan@mail.cl", "11.111.111-1")).id();
            VentaResponse v = ventaService.crear(venta(new ItemVentaRequest("VR001", 1)), id);

            assertThat(ventaService.listarDeUsuario(id)).extracting(VentaResponse::id).containsExactly(v.id());
            assertThat(ventaService.obtenerDeUsuario(v.id(), id).total()).isEqualTo(900);
            // otro usuario no la ve
            assertThatThrownBy(() -> ventaService.obtenerDeUsuario(v.id(), adminId()))
                    .isInstanceOf(RecursoNoEncontradoException.class);
        }

        @Test
        void stockInsuficienteNoModificaNada() {
            assertThatThrownBy(() -> ventaService.crear(venta(
                    new ItemVentaRequest("FR001", 1),
                    new ItemVentaRequest("PO001", 11)), null))
                    .isInstanceOf(ConflictoException.class).hasMessageContaining("Miel Orgánica");

            assertThat(stock("FR001")).isEqualTo(10);
            assertThat(stock("PO001")).isEqualTo(10);
        }

        @Test
        void productoInexistente() {
            assertThatThrownBy(() -> ventaService.crear(venta(new ItemVentaRequest("XX999", 1)), null))
                    .isInstanceOf(RecursoNoEncontradoException.class).hasMessageContaining("XX999");
        }

        @Test
        void cancelarDevuelveStockYEstadosFinalesNoCambian() {
            VentaResponse v = ventaService.crear(venta(new ItemVentaRequest("FR002", 4)), null);
            assertThat(stock("FR002")).isEqualTo(6);

            ventaService.cambiarEstado(v.id(), EstadoVenta.EN_PREPARACION);
            ventaService.cambiarEstado(v.id(), EstadoVenta.CANCELADA);
            assertThat(stock("FR002")).isEqualTo(10);

            assertThatThrownBy(() -> ventaService.cambiarEstado(v.id(), EstadoVenta.ENVIADA))
                    .isInstanceOf(ReglaNegocioException.class);
        }

        @Test
        void resumenAdmin() {
            ventaService.crear(venta(new ItemVentaRequest("FR003", 2)), null);
            var resumen = adminService.resumen();

            assertThat(resumen.totalProductos()).isEqualTo(9);
            assertThat(resumen.totalVentas()).isGreaterThanOrEqualTo(1);
            assertThat(resumen.totalVendido()).isGreaterThanOrEqualTo(1600);
            assertThat(resumen.ultimasVentas()).isNotEmpty();
        }
    }
}
