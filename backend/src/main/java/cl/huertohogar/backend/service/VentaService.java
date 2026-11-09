package cl.huertohogar.backend.service;

import cl.huertohogar.backend.dto.venta.ItemVentaRequest;
import cl.huertohogar.backend.dto.venta.VentaRequest;
import cl.huertohogar.backend.dto.venta.VentaResponse;
import cl.huertohogar.backend.exception.ConflictoException;
import cl.huertohogar.backend.exception.RecursoNoEncontradoException;
import cl.huertohogar.backend.exception.ReglaNegocioException;
import cl.huertohogar.backend.model.*;
import cl.huertohogar.backend.repository.ProductoRepository;
import cl.huertohogar.backend.repository.UsuarioRepository;
import cl.huertohogar.backend.repository.VentaRepository;
import cl.huertohogar.backend.util.Textos;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Proceso de compra y seguimiento de pedidos.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Registra una compra de forma atomica:
     * 1. agrupa los items repetidos del carrito,
     * 2. bloquea las filas de los productos (SELECT ... FOR UPDATE),
     * 3. valida que existan y que haya stock suficiente,
     * 4. toma los precios desde la BD (nunca confia en el precio del cliente) y calcula el total,
     * 5. descuenta el stock y guarda la venta con sus detalles.
     * Si algo falla, la transaccion se revierte completa y el stock no cambia.
     *
     * @param usuarioId id del usuario con sesion iniciada, o null si compra como invitado
     */
    @Transactional
    public VentaResponse crear(VentaRequest req, Long usuarioId) {
        Map<String, Integer> cantidades = new LinkedHashMap<>();
        for (ItemVentaRequest item : req.items()) {
            cantidades.merge(item.sku().trim().toUpperCase(), item.cantidad(), Integer::sum);
        }

        Map<String, Producto> productos = productoRepository.findAllBySkuForUpdate(cantidades.keySet()).stream()
                .collect(Collectors.toMap(Producto::getSku, Function.identity()));

        Set<String> inexistentes = new TreeSet<>(cantidades.keySet());
        inexistentes.removeAll(productos.keySet());
        if (!inexistentes.isEmpty()) {
            throw new RecursoNoEncontradoException("Productos no encontrados: " + String.join(", ", inexistentes));
        }

        List<String> sinStock = new ArrayList<>();
        cantidades.forEach((sku, cantidad) -> {
            Producto p = productos.get(sku);
            if (p.getStock() < cantidad) {
                sinStock.add(p.getNombre() + " (disponible: " + p.getStock() + ", pedido: " + cantidad + ")");
            }
        });
        if (!sinStock.isEmpty()) {
            throw new ConflictoException("Stock insuficiente para: " + String.join("; ", sinStock));
        }

        Usuario usuario = usuarioId == null ? null : usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        Venta venta = Venta.builder()
                .usuario(usuario)
                .nombre(req.nombre().trim())
                .correo(Textos.normalizarEmail(req.correo()))
                .telefono(Textos.limpiar(req.telefono()))
                .direccion(req.direccion().trim())
                .ciudad(req.ciudad().trim())
                .codigoPostal(Textos.limpiar(req.codigoPostal()))
                .pais(req.pais().trim())
                .total(0)
                .build();

        int total = 0;
        for (Map.Entry<String, Integer> e : cantidades.entrySet()) {
            Producto p = productos.get(e.getKey());
            int cantidad = e.getValue();
            int subtotal = Math.multiplyExact(p.getPrecio(), cantidad);

            p.setStock(p.getStock() - cantidad);
            venta.agregarDetalle(DetalleVenta.builder()
                    .producto(p)
                    .sku(p.getSku())
                    .nombreProducto(p.getNombre())
                    .imagen(p.getImagen())
                    .precioUnitario(p.getPrecio())
                    .cantidad(cantidad)
                    .subtotal(subtotal)
                    .build());
            total = Math.addExact(total, subtotal);
        }
        venta.setTotal(total);

        Venta guardada = ventaRepository.save(venta);
        log.info("Venta id={} registrada: total={} usuario={}", guardada.getId(), total,
                usuarioId == null ? "invitado" : usuarioId);
        return VentaResponse.desde(guardada);
    }

    // ------------------------------------------------------------------ consultas

    public List<VentaResponse> listarTodas(EstadoVenta estado) {
        List<Venta> ventas = ventaRepository.findAllByOrderByFechaDesc();
        return ventas.stream()
                .filter(v -> estado == null || v.getEstado() == estado)
                .map(VentaResponse::desde).toList();
    }

    /** Historial de compras del usuario (Perfil). */
    public List<VentaResponse> listarDeUsuario(Long usuarioId) {
        return ventaRepository.findByUsuarioIdOrderByFechaDesc(usuarioId).stream().map(VentaResponse::desde).toList();
    }

    public VentaResponse obtener(Long id) {
        return VentaResponse.desde(buscar(id));
    }

    /** Un usuario solo puede ver sus propias ventas; si no es suya responde 404 (no revela que existe). */
    public VentaResponse obtenerDeUsuario(Long id, Long usuarioId) {
        Venta venta = buscar(id);
        if (venta.getUsuario() == null || !venta.getUsuario().getId().equals(usuarioId)) {
            throw new RecursoNoEncontradoException("Venta no encontrada");
        }
        return VentaResponse.desde(venta);
    }

    // ------------------------------------------------------------------ seguimiento

    /**
     * Cambia el estado del pedido. Las ventas ENTREGADA o CANCELADA ya no cambian.
     * Al cancelar, el stock se devuelve a los productos que aun existen.
     */
    @Transactional
    public VentaResponse cambiarEstado(Long id, EstadoVenta nuevo) {
        Venta venta = buscar(id);
        EstadoVenta actual = venta.getEstado();
        if (actual == nuevo) {
            return VentaResponse.desde(venta);
        }
        if (actual == EstadoVenta.ENTREGADA || actual == EstadoVenta.CANCELADA) {
            throw new ReglaNegocioException("Una venta " + actual + " ya no puede cambiar de estado");
        }

        if (nuevo == EstadoVenta.CANCELADA) {
            devolverStock(venta);
        }
        venta.setEstado(nuevo);
        log.info("Venta id={} cambia de {} a {}", id, actual, nuevo);
        return VentaResponse.desde(venta);
    }

    private void devolverStock(Venta venta) {
        Map<String, Integer> cantidades = new HashMap<>();
        venta.getDetalles().forEach(d -> cantidades.merge(d.getSku(), d.getCantidad(), Integer::sum));
        productoRepository.findAllBySkuForUpdate(cantidades.keySet())
                .forEach(p -> p.setStock(p.getStock() + cantidades.get(p.getSku())));
    }

    private Venta buscar(Long id) {
        return ventaRepository.findWithDetallesById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Venta no encontrada"));
    }
}
