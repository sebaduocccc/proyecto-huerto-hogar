import type { CarritoItem } from "../context/CarritoContext";
import type { CheckoutDetails } from "./checkout";

export type Venta = {
    id: string;
    fecha: string;
    nombre: string;
    correo: string;
    idUsuario: string | null; // si no inicio sesion entonces null
    productos: CarritoItem[];
    total: number;
};

const CLAVE_VENTAS = "phuertohogar_ventas";

export function obtenerVentas(): Venta[] {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_VENTAS) ?? "[]") as Venta[];
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
    });

    localStorage.setItem(CLAVE_VENTAS, JSON.stringify(ventas));
}
