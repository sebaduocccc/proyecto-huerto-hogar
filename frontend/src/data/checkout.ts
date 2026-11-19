import type { CarritoItem } from '../context/CarritoContext';
import api from './api';
import type { VentaApi } from './ventas';

export const CHECKOUT_STORAGE_KEY = 'HuertoHogarCompraConfirmada';

export type CheckoutDetails = {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
    correo: string;
    telefono: string;
    fechaCompra: string;
    items: CarritoItem[];
    total: number;
};

export function saveCheckoutDetails(
    formData: FormData,
    items: CarritoItem[],
    storage: Pick<Storage, 'setItem'> = localStorage,
    purchaseDate = new Date(),
): CheckoutDetails {
    const details: CheckoutDetails = {
        nombre: String(formData.get('nombre') ?? ''),
        direccion: String(formData.get('direccion') ?? ''),
        ciudad: String(formData.get('ciudad') ?? ''),
        codigoPostal: String(formData.get('codigoPostal') ?? ''),
        pais: String(formData.get('pais') ?? ''),
        correo: String(formData.get('correo') ?? ''),
        telefono: String(formData.get('telefono') ?? ''),
        fechaCompra: purchaseDate.toISOString(),
        items: items.map((item) => ({ ...item })),
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    storage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(details));
    return details;
}

// registra la compra en el backend (POST /ventas).
// solo se manda sku y cantidad: el precio y el total los calcula el servidor y descuenta el stock.
// si hay sesion, el token se manda solo y la venta queda asociada a la cuenta.
// los datos de la tarjeta NO se envian.
export async function confirmarCompra(formData: FormData, items: CarritoItem[]) {
    const res = await api.post<VentaApi>('/ventas', {
        nombre: String(formData.get('nombre') ?? ''),
        correo: String(formData.get('correo') ?? ''),
        telefono: String(formData.get('telefono') ?? ''),
        direccion: String(formData.get('direccion') ?? ''),
        ciudad: String(formData.get('ciudad') ?? ''),
        codigoPostal: String(formData.get('codigoPostal') ?? ''),
        pais: String(formData.get('pais') ?? ''),
        items: items.map((item) => ({ sku: item.sku, cantidad: item.quantity })),
    });
    return res.data;
}
