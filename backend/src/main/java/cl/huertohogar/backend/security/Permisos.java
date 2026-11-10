package cl.huertohogar.backend.security;

/**
 * Expresiones de @PreAuthorize por permiso. Se autoriza por PERMISO y no por nombre de rol,
 * asi un rol nuevo creado por el administrador funciona sin cambiar codigo.
 */
public final class Permisos {

    private Permisos() {
    }

    public static final String PERFIL_PROPIO = "hasAuthority('PERFIL_PROPIO')";
    public static final String COMPRAS_PROPIAS = "hasAuthority('COMPRAS_PROPIAS')";
    public static final String PRODUCTOS = "hasAuthority('PRODUCTOS_GESTIONAR')";
    public static final String CATEGORIAS = "hasAuthority('CATEGORIAS_GESTIONAR')";
    public static final String USUARIOS = "hasAuthority('USUARIOS_GESTIONAR')";
    public static final String ROLES = "hasAuthority('ROLES_GESTIONAR')";
    public static final String VENTAS = "hasAuthority('VENTAS_GESTIONAR')";
    /** Para asignar un rol a un usuario hay que poder listar los roles. */
    public static final String ROLES_O_USUARIOS = "hasAnyAuthority('ROLES_GESTIONAR','USUARIOS_GESTIONAR')";
    /** Cualquier permiso de administracion da acceso al panel. */
    public static final String PANEL_ADMIN = "hasAnyAuthority('PRODUCTOS_GESTIONAR','CATEGORIAS_GESTIONAR',"
            + "'USUARIOS_GESTIONAR','ROLES_GESTIONAR','VENTAS_GESTIONAR')";
}
