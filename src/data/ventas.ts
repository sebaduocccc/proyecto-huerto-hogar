import type { CarritoItem } from "../context/CarritoContext";
import type { CheckoutDetails } from "./checkout";

export type EstadoVenta = "pendiente" | "enviado" | "entregado" | "cancelado";
export const ESTADOS_VENTA: EstadoVenta[] = ["pendiente", "enviado", "entregado", "cancelado"];

export type Venta = {
    id: string;
    fecha: string;
    nombre: string;
    correo: string;
    idUsuario: string | null; // si no inicio sesion entonces null
    productos: CarritoItem[];
    total: number;
    estado: EstadoVenta;
};

const CLAVE_VENTAS = "phuertohogar_ventas";

export function obtenerVentas(): Venta[] {
    try {
        const raw = JSON.parse(localStorage.getItem(CLAVE_VENTAS) ?? "[]") as Venta[];
        return raw.map((v) => ({ ...v, estado: v.estado ?? "pendiente" }));
    } catch (error) {
        console.log("datos corruptos en ventas " + error);
        return [];
    }
}

export function guardarVenta(datos: CheckoutDetails, productos: CarritoItem[], total: number, idUsuario: string | null): void {
    const ventas = obtenerVentas();

    ventas.push({
        id: "v_" + Date.now().toString(36),
        fecha: datos.fechaCompra,
        nombre: datos.nombre,
        correo: datos.correo,
        idUsuario: idUsuario,
        productos: productos,
        total: total,
        estado: "pendiente"
    });

    localStorage.setItem(CLAVE_VENTAS, JSON.stringify(ventas));
}

export function cambiarEstadoVenta(id: string, estado: EstadoVenta): void {
    const ventas = obtenerVentas().map((v) => (v.id === id ? { ...v, estado: estado } : v));
    localStorage.setItem(CLAVE_VENTAS, JSON.stringify(ventas));
}
