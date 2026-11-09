package cl.huertohogar.backend.repository;

import cl.huertohogar.backend.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas de los repositorios contra el MySQL real (podman compose up -d db).
 * Cada test corre en una transaccion que se revierte al final.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RepositoriosIT {

    @Autowired UsuarioRepository usuarioRepository;
    @Autowired RolRepository rolRepository;
    @Autowired PermisoRepository permisoRepository;
    @Autowired CategoriaRepository categoriaRepository;
    @Autowired ProductoRepository productoRepository;
    @Autowired VentaRepository ventaRepository;

    @Test
    void adminPorDefectoTieneRolAdminConTodosLosPermisos() {
        Usuario admin = usuarioRepository.findByEmail("admin@huertohogar.cl").orElseThrow();

        assertThat(admin.getRol().getNombre()).isEqualTo(Rol.ADMIN);
        assertThat(admin.getRol().getPermisos()).hasSize((int) permisoRepository.count());
        assertThat(usuarioRepository.countByRolNombreAndActivoTrue(Rol.ADMIN)).isEqualTo(1);
    }

    @Test
    void sePuedeCrearUnRolNuevoConPermisos() {
        Rol bodeguero = Rol.builder().nombre("BODEGUERO").descripcion("Gestiona stock").build();
        bodeguero.getPermisos().addAll(permisoRepository.findByNombreIn(List.of("PRODUCTOS_GESTIONAR")));
        rolRepository.save(bodeguero);

        Rol guardado = rolRepository.findByNombre("BODEGUERO").orElseThrow();
        assertThat(guardado.isSistema()).isFalse();
        assertThat(guardado.getPermisos()).extracting(Permiso::getNombre).containsExactly("PRODUCTOS_GESTIONAR");
        assertThat(rolRepository.existsByNombreIgnoreCase("bodeguero")).isTrue();
    }

    @Test
    void catalogoMigradoDelFrontend() {
        assertThat(productoRepository.count()).isEqualTo(9);
        assertThat(categoriaRepository.findAllByOrderByNombreAsc()).hasSize(4);

        Producto manzana = productoRepository.findById("FR001").orElseThrow();
        assertThat(manzana.getCategoria().getNombre()).isEqualTo("Frutas");
        assertThat(manzana.getDetalles()).containsEntry("Origen", "Chile").containsEntry("Variedad", "Fuji");
    }

    @Test
    void filtrosYBusquedaDeProductos() {
        assertThat(productoRepository.findByCategoriaNombreIgnoreCaseOrderBySkuAsc("frutas"))
                .extracting(Producto::getSku).containsExactly("FR001", "FR002", "FR003");
        assertThat(productoRepository.buscar("miel")).extracting(Producto::getSku).containsExactly("PO001");
        assertThat(productoRepository.findByStockLessThanEqualOrderByStockAsc(10)).hasSize(9);
        assertThat(productoRepository.existsByCategoriaId(1L)).isTrue();
    }

    @Test
    void ventaComoInvitadoConDetalles() {
        List<Producto> bloqueados = productoRepository.findAllBySkuForUpdate(List.of("FR001", "PO001"));
        assertThat(bloqueados).hasSize(2);

        Venta venta = Venta.builder()
                .nombre("Invitado").correo("invitado@mail.cl")
                .direccion("Calle 123").ciudad("Santiago").pais("Chile")
                .total(0).build();
        int total = 0;
        for (Producto p : bloqueados) {
            venta.agregarDetalle(DetalleVenta.builder()
                    .producto(p).sku(p.getSku()).nombreProducto(p.getNombre()).imagen(p.getImagen())
                    .precioUnitario(p.getPrecio()).cantidad(2).subtotal(p.getPrecio() * 2).build());
            total += p.getPrecio() * 2;
        }
        venta.setTotal(total);
        Venta guardada = ventaRepository.saveAndFlush(venta);

        Venta leida = ventaRepository.findWithDetallesById(guardada.getId()).orElseThrow();
        assertThat(leida.getUsuario()).isNull();
        assertThat(leida.getEstado()).isEqualTo(EstadoVenta.CONFIRMADA);
        assertThat(leida.getDetalles()).hasSize(2);
        assertThat(leida.getTotal()).isEqualTo(2 * 1200 + 2 * 5000);
        assertThat(ventaRepository.sumarTotalVendido()).isGreaterThanOrEqualTo(12400);
    }

    @Test
    void historialDeComprasPorUsuario() {
        Usuario admin = usuarioRepository.findByEmail("admin@huertohogar.cl").orElseThrow();
        Venta venta = Venta.builder()
                .usuario(admin).nombre(admin.getNombre()).correo(admin.getEmail())
                .direccion("Calle 1").ciudad("Santiago").pais("Chile").total(1000).build();
        ventaRepository.saveAndFlush(venta);

        assertThat(ventaRepository.findByUsuarioIdOrderByFechaDesc(admin.getId())).hasSize(1);
    }
}
