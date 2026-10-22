import { describe, expect, it, vi } from 'vitest';
import { CHECKOUT_STORAGE_KEY, saveCheckoutDetails } from '../data/checkout';

describe('saveCheckoutDetails', () => {
	it('Guarda los datos del comprador y envío sin persistir datos de la tarjeta', () => {
		const formData = new FormData();
		formData.set('nombre', 'Vicente');
		formData.set('direccion', 'Manuel Montt 123');
		formData.set('ciudad', 'Santiago');
		formData.set('codigoPostal', '8320000');
		formData.set('pais', 'Chile');
		formData.set('correo', 'vicentito@example.com');
		formData.set('telefono', '+56912345678');
		formData.set('cardNumber', '4111111111111111');
		formData.set('cvc', '123');

		const storage = { setItem: vi.fn() };
		const purchaseDate = new Date('2026-10-21T12:00:00.000Z');

		const details = saveCheckoutDetails(formData, storage, purchaseDate);

		expect(storage.setItem).toHaveBeenCalledOnce();
		expect(storage.setItem).toHaveBeenCalledWith(
			CHECKOUT_STORAGE_KEY,
			JSON.stringify({
				nombre: 'Vicente',
				direccion: 'Manuel Montt 123',
				ciudad: 'Santiago',
				codigoPostal: '8320000',
				pais: 'Chile',
				correo: 'vicentito@example.com',
				telefono: '+56912345678',
				fechaCompra: '2026-10-21T12:00:00.000Z',
			}),
		);
		expect(details).not.toHaveProperty('cardNumber');
		expect(details).not.toHaveProperty('cvc');
	});
});
