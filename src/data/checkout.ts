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
};

export function saveCheckoutDetails(
    formData: FormData,
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
    };

    storage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(details));
    return details;
}