import type { UsuarioApi } from "./api";

// cada seccion del panel se muestra si el usuario tiene ALGUNO de estos permisos (vienen del backend).
// el vendedor tiene PRODUCTOS_VER y VENTAS_VER, asi que solo ve Productos y Ventas
export const adminLinks = [
    { to: "/admin",                 label:"Inicio",     icon:"fa-house",    permisos: ["USUARIOS_GESTIONAR"] },
    { to: "/admin/productos",       label:"Productos",  icon:"fa-carrot",   permisos: ["PRODUCTOS_GESTIONAR", "PRODUCTOS_VER"] },
    { to: "/admin/usuarios",        label:"Usuarios",   icon:"fa-users",    permisos: ["USUARIOS_GESTIONAR"] },
    { to: "/admin/ventas",          label:"Ventas",     icon:"fa-receipt",  permisos: ["VENTAS_GESTIONAR", "VENTAS_VER"] },
];

export function tienePermiso(usuario: UsuarioApi | null, ...permisos: string[]): boolean {
    if (!usuario) return false;
    return permisos.some((p) => usuario.permisos.includes(p));
}

// secciones del panel que puede ver el usuario
export function linksPermitidos(usuario: UsuarioApi | null) {
    return adminLinks.filter((l) => tienePermiso(usuario, ...l.permisos));
}

// permisos de cada ruta del panel (para Proteger en App.tsx)
export function permisosDe(ruta: string): string[] {
    return adminLinks.find((l) => l.to === ruta)?.permisos ?? [];
}
