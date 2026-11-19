import type { CarritoItem } from "../context/CarritoContext";
import api from "./api";

// estados que usa el backend (enum EstadoVenta)
export type EstadoVenta = "CONFIRMADA" | "EN_PREPARACION" | "ENVIADA" | "ENTREGADA" | "CANCELADA";
export const ESTADOS_VENTA: EstadoVenta[] = ["CONFIRMADA", "EN_PREPARACION", "ENVIADA", "ENTREGADA", "CANCELADA"];

// texto para mostrar en pantalla
export const NOMBRE_ESTADO: Record<EstadoVenta, string> = {
    CONFIRMADA: "Confirmada",
    EN_PREPARACION: "En preparación",
    ENVIADA: "Enviada",
    ENTREGADA: "Entregada",
    CANCELADA: "Cancelada",
};

// venta tal como la devuelve el backend (VentaResponse)
export type VentaApi = {
    id: number;
    fecha: string;
    usuarioId: number | null;
    nombre: string;
    correo: string;
    telefono: string | null;
    direccion: string;
    ciudad: string;
    codigoPostal: string | null;
    pais: string;
    subtotal: number; // suma de productos
    iva: number;      // 19% del subtotal
    envio: number;    // 0 si fue gratis
    total: number;    // subtotal + iva + envio
    estado: EstadoVenta;
    items: {
        sku: string;
        nombreProducto: string;
        imagen: string | null;
        precioUnitario: number;
        cantidad: number;
        subtotal: number;
    }[];
};

// venta como la usan las pantallas del frontend
export type Venta = {
    id: number;
    fecha: string;
    nombre: string;
    correo: string;
    idUsuario: number | null; // si no inicio sesion entonces null
    productos: CarritoItem[];
    subtotal: number;
    iva: number;
    envio: number;
    total: number;
    estado: EstadoVenta;
};

// convierte los productos de la venta al formato del carrito (name, price, quantity...)
export function productosDeVenta(v: VentaApi): CarritoItem[] {
    return v.items.map((i) => ({
        sku: i.sku,
        name: i.nombreProducto,
        price: i.precioUnitario,
        image: i.imagen || "/not-found.svg",
        quantity: i.cantidad,
    }));
}

export function ventaDesdeApi(v: VentaApi): Venta {
    return {
        id: v.id,
        fecha: v.fecha,
        nombre: v.nombre,
        correo: v.correo,
        idUsuario: v.usuarioId,
        productos: productosDeVenta(v),
        subtotal: v.subtotal,
        iva: v.iva,
        envio: v.envio,
        total: v.total,
        estado: v.estado,
    };
}

// todas las ventas, de la mas nueva a la mas antigua (requiere permiso de ventas)
export async function obtenerVentas(): Promise<Venta[]> {
    const res = await api.get<VentaApi[]>("/ventas");
    return res.data.map(ventaDesdeApi);
}

// el backend no deja cambiar una venta ENTREGADA o CANCELADA
export async function cambiarEstadoVenta(id: number, estado: EstadoVenta): Promise<void> {
    await api.patch(`/ventas/${id}/estado`, { estado });
}
