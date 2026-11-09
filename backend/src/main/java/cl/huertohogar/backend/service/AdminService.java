package cl.huertohogar.backend.service;

import cl.huertohogar.backend.dto.admin.ResumenAdminResponse;
import cl.huertohogar.backend.dto.venta.VentaResponse;
import cl.huertohogar.backend.repository.ProductoRepository;
import cl.huertohogar.backend.repository.UsuarioRepository;
import cl.huertohogar.backend.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Resumen para el panel AdminHome. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final VentaRepository ventaRepository;
    private final ProductoService productoService;

    public ResumenAdminResponse resumen() {
        List<VentaResponse> ultimas = ventaRepository.findTop5ByOrderByFechaDesc().stream()
                .map(VentaResponse::desde).toList();
        return new ResumenAdminResponse(
                usuarioRepository.count(),
                productoRepository.count(),
                ventaRepository.count(),
                ventaRepository.sumarTotalVendido(),
                productoService.stockBajo(ProductoService.STOCK_BAJO),
                ultimas);
    }
}
