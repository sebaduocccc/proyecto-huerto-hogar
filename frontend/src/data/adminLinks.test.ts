import { linksPermitidos, tienePermiso } from "./adminLinks";
import type { UsuarioApi } from "./api";

// usuario de prueba con los permisos indicados
function usuarioCon(rol: string, permisos: string[]): UsuarioApi {
    return {
        id: 1, nombre: "Prueba", email: "prueba@correo.cl", rut: null, telefono: null, direccion: null,
        comuna: null, region: null, fechaNacimiento: null, rol, permisos, activo: true, createdAt: "",
    };
}

const admin = usuarioCon("ADMIN", ["PERFIL_PROPIO", "COMPRAS_PROPIAS", "PRODUCTOS_GESTIONAR", "CATEGORIAS_GESTIONAR",
    "USUARIOS_GESTIONAR", "ROLES_GESTIONAR", "VENTAS_GESTIONAR", "PRODUCTOS_VER", "VENTAS_VER"]);
const vendedor = usuarioCon("VENDEDOR", ["PERFIL_PROPIO", "COMPRAS_PROPIAS", "PRODUCTOS_VER", "VENTAS_VER"]);
const cliente = usuarioCon("USUARIO", ["PERFIL_PROPIO", "COMPRAS_PROPIAS"]);

it("el admin ve todas las secciones del panel", () => {
    expect(linksPermitidos(admin).map((l) => l.to))
        .toEqual(["/admin", "/admin/productos", "/admin/usuarios", "/admin/ventas"]);
});

it("el vendedor solo ve productos y ventas", () => {
    expect(linksPermitidos(vendedor).map((l) => l.to)).toEqual(["/admin/productos", "/admin/ventas"]);
});

it("el vendedor no puede editar productos ni cambiar estados", () => {
    expect(tienePermiso(vendedor, "PRODUCTOS_GESTIONAR")).toBe(false);
    expect(tienePermiso(vendedor, "VENTAS_GESTIONAR")).toBe(false);
});

it("el cliente y el invitado no ven el panel", () => {
    expect(linksPermitidos(cliente)).toHaveLength(0);
    expect(linksPermitidos(null)).toHaveLength(0);
});
