package cl.huertohogar.backend.service;

import cl.huertohogar.backend.dto.usuario.*;
import cl.huertohogar.backend.exception.ConflictoException;
import cl.huertohogar.backend.exception.RecursoNoEncontradoException;
import cl.huertohogar.backend.exception.ReglaNegocioException;
import cl.huertohogar.backend.model.Rol;
import cl.huertohogar.backend.model.Usuario;
import cl.huertohogar.backend.repository.RefreshTokenRepository;
import cl.huertohogar.backend.repository.RolRepository;
import cl.huertohogar.backend.repository.UsuarioRepository;
import cl.huertohogar.backend.util.Rut;
import cl.huertohogar.backend.util.Telefono;
import cl.huertohogar.backend.util.Textos;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;

    // ------------------------------------------------------------------ registro publico

    /** Registro de un cliente: siempre queda con rol USUARIO. */
    @Transactional
    public UsuarioResponse registrar(RegistroRequest req) {
        Usuario usuario = Usuario.builder()
                .nombre(req.nombre().trim())
                .email(Textos.normalizarEmail(req.email()))
                .password(passwordEncoder.encode(req.password()))
                .rut(Rut.normalizar(req.rut()))
                .telefono(Telefono.normalizar(req.telefono()))
                .fechaNacimiento(req.fechaNacimiento())
                .region(Textos.limpiar(req.region()))
                .comuna(Textos.limpiar(req.comuna()))
                .direccion(Textos.limpiar(req.direccion()))
                .rol(buscarRol(Rol.USUARIO))
                .build();

        validarUnicidad(usuario.getEmail(), usuario.getRut(), null);
        Usuario guardado = usuarioRepository.save(usuario);
        log.info("Usuario registrado id={} email={}", guardado.getId(), guardado.getEmail());
        return UsuarioResponse.desde(guardado);
    }

    // ------------------------------------------------------------------ lectura

    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAllByOrderByIdAsc().stream().map(UsuarioResponse::desde).toList();
    }

    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.desde(buscar(id));
    }

    // ------------------------------------------------------------------ perfil propio

    @Transactional
    public UsuarioResponse actualizarPerfil(Long usuarioId, PerfilUpdateRequest req) {
        Usuario usuario = buscar(usuarioId);
        String rut = Rut.normalizar(req.rut());
        validarUnicidad(usuario.getEmail(), rut, usuarioId);

        usuario.setNombre(req.nombre().trim());
        usuario.setRut(rut);
        usuario.setTelefono(Telefono.normalizar(req.telefono()));
        usuario.setFechaNacimiento(req.fechaNacimiento());
        usuario.setRegion(Textos.limpiar(req.region()));
        usuario.setComuna(Textos.limpiar(req.comuna()));
        usuario.setDireccion(Textos.limpiar(req.direccion()));
        return UsuarioResponse.desde(usuario);
    }

    @Transactional
    public void cambiarPassword(Long usuarioId, CambioPasswordRequest req) {
        Usuario usuario = buscar(usuarioId);
        if (!passwordEncoder.matches(req.passwordActual(), usuario.getPassword())) {
            throw new ReglaNegocioException("La contraseña actual no es correcta");
        }
        usuario.setPassword(passwordEncoder.encode(req.passwordNueva()));
        cerrarSesiones(usuarioId);   // las sesiones abiertas con la clave antigua dejan de servir
    }

    // ------------------------------------------------------------------ administracion

    @Transactional
    public UsuarioResponse crearPorAdmin(UsuarioAdminRequest req) {
        if (Textos.estaVacio(req.password()) || req.password().length() < 4) {
            throw new ReglaNegocioException("La contraseña debe tener al menos 4 caracteres");
        }
        Usuario usuario = new Usuario();
        aplicarDatosAdmin(usuario, req);
        usuario.setPassword(passwordEncoder.encode(req.password()));
        usuario.setActivo(req.activo() == null || req.activo());

        validarUnicidad(usuario.getEmail(), usuario.getRut(), null);
        Usuario guardado = usuarioRepository.save(usuario);
        log.info("Admin creó usuario id={} con rol {}", guardado.getId(), guardado.getRol().getNombre());
        return UsuarioResponse.desde(guardado);
    }

    /**
     * @param solicitanteId id del administrador que hace el cambio (no puede quitarse su propio acceso)
     */
    @Transactional
    public UsuarioResponse actualizarPorAdmin(Long id, UsuarioAdminRequest req, Long solicitanteId) {
        Usuario usuario = buscar(id);
        boolean eraAdminActivo = esAdminActivo(usuario);
        Long rolAnterior = usuario.getRol().getId();
        boolean estabaActivo = usuario.isActivo();

        aplicarDatosAdmin(usuario, req);
        if (req.activo() != null) usuario.setActivo(req.activo());
        boolean cambiaPassword = !Textos.estaVacio(req.password());
        if (cambiaPassword) {
            if (req.password().length() < 4) {
                throw new ReglaNegocioException("La contraseña debe tener al menos 4 caracteres");
            }
            usuario.setPassword(passwordEncoder.encode(req.password()));
        }

        boolean dejaDeSerAdmin = eraAdminActivo && !esAdminActivo(usuario);
        if (dejaDeSerAdmin && id.equals(solicitanteId)) {
            throw new ReglaNegocioException("No puedes quitarte el rol de administrador ni desactivar tu propia cuenta");
        }
        if (dejaDeSerAdmin) {
            validarQueQuedeOtroAdmin();
        }

        validarUnicidad(usuario.getEmail(), usuario.getRut(), id);

        // si cambian sus permisos o su acceso, debe volver a iniciar sesion para obtener un token nuevo
        if (cambiaPassword || !rolAnterior.equals(usuario.getRol().getId()) || (estabaActivo && !usuario.isActivo())) {
            cerrarSesiones(id);
        }
        return UsuarioResponse.desde(usuario);
    }

    @Transactional
    public void eliminar(Long id, Long solicitanteId) {
        Usuario usuario = buscar(id);
        if (id.equals(solicitanteId)) {
            throw new ReglaNegocioException("No puedes eliminar el usuario con el que iniciaste sesión");
        }
        if (esAdminActivo(usuario)) {
            validarQueQuedeOtroAdmin();
        }
        // sus ventas se conservan (usuario_id queda en NULL por la FK ON DELETE SET NULL)
        usuarioRepository.delete(usuario);
        log.info("Usuario id={} eliminado por id={}", id, solicitanteId);
    }

    // ------------------------------------------------------------------ helpers

    private void aplicarDatosAdmin(Usuario usuario, UsuarioAdminRequest req) {
        usuario.setNombre(req.nombre().trim());
        usuario.setEmail(Textos.normalizarEmail(req.email()));
        usuario.setRol(buscarRol(Textos.estaVacio(req.rol()) ? Rol.USUARIO : req.rol().trim().toUpperCase()));
        usuario.setRut(Rut.normalizar(req.rut()));
        usuario.setTelefono(Telefono.normalizar(req.telefono()));
        usuario.setFechaNacimiento(req.fechaNacimiento());
        usuario.setRegion(Textos.limpiar(req.region()));
        usuario.setComuna(Textos.limpiar(req.comuna()));
        usuario.setDireccion(Textos.limpiar(req.direccion()));
    }

    private void cerrarSesiones(Long usuarioId) {
        int revocadas = refreshTokenRepository.revocarTodosDeUsuario(usuarioId, LocalDateTime.now());
        if (revocadas > 0) log.info("Se cerraron {} sesiones del usuario id={}", revocadas, usuarioId);
    }

    private boolean esAdminActivo(Usuario u) {
        return u.isActivo() && Rol.ADMIN.equals(u.getRol().getNombre());
    }

    /** La tienda nunca puede quedar sin al menos un administrador activo. */
    private void validarQueQuedeOtroAdmin() {
        if (usuarioRepository.countByRolNombreAndActivoTrue(Rol.ADMIN) <= 1) {
            throw new ConflictoException("Debe existir al menos un administrador activo");
        }
    }

    private void validarUnicidad(String email, String rut, Long idExcluir) {
        boolean emailUsado = idExcluir == null
                ? usuarioRepository.existsByEmail(email)
                : usuarioRepository.existsByEmailAndIdNot(email, idExcluir);
        if (emailUsado) throw new ConflictoException("Ya existe una cuenta con ese correo");

        if (rut != null) {
            boolean rutUsado = idExcluir == null
                    ? usuarioRepository.existsByRut(rut)
                    : usuarioRepository.existsByRutAndIdNot(rut, idExcluir);
            if (rutUsado) throw new ConflictoException("Ya existe una cuenta con ese RUT");
        }
    }

    private Rol buscarRol(String nombre) {
        return rolRepository.findByNombre(nombre)
                .orElseThrow(() -> new ReglaNegocioException("El rol " + nombre + " no existe"));
    }

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }
}
