import { useNavigate } from 'react-router-dom';
import { useCreditCardValidator } from 'react-creditcard-validator';
import { saveCheckoutDetails } from '../data/checkout';
import { useCarrito } from '../context/CarritoContext';
import { guardarVenta } from '../data/ventas';
import { obtenerIdSesion } from '../data/usuarios';

export default function Pago(){
    const navigate = useNavigate();
    const { items, total } = useCarrito();
    const {
        getCardNumberProps,
        getExpiryDateProps,
    getCVCProps,
        meta: { erroredInputs },
    } = useCreditCardValidator();

        function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
                event.preventDefault();
                if (items.length === 0) return;

                const hasCardErrors = Object.values(erroredInputs).some(Boolean);

                if (event.currentTarget.checkValidity() && !hasCardErrors) {
                    const formData = new FormData(event.currentTarget);
                    const details = saveCheckoutDetails(formData, items); // va para el recuento de panel admin
                    guardarVenta(details, details.items, details.total, obtenerIdSesion());
                    navigate('pagocorrecto');
                } else if (hasCardErrors) {
                        navigate('pagoincorrecto');
                }
        }
  
    return(
        <>
            <h1 className="fw-bold mb-4">Mi Carrito de Compras</h1>
            {items.length === 0 && <div id="empty-cart-msg" className="text-center py-5">
                <div className="mb-3">
                    <span className="fs-1 text-muted"></span>
                </div>
                <h3>Tu carrito está vacío</h3>
                <p className="text-muted">No has añadido ningún producto.</p>
                <a href="/productos" className="btn btn-primary btn-lg mt-2">Ir a ver productos</a>
            </div>}
            <div id="cart-content" className="row g-4">
                <div className="col-lg-8">
                    <div className="table-responsive shadow-sm border bg-white">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" style={{ minWidth: '220px' }}>Producto</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col" style={{ minWidth: '130px' }}>Cantidad</th>
                                    <th scope="col">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody id="cart-table-body">
                                {items.map((item) => (
                                    <tr key={item.sku}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img src={item.image || '/src/assets/not-found.svg'} alt={item.name} style={{ width: '60px', objectFit: 'contain' }} />
                                                <span className="fw-bold">{item.name}</span>
                                            </div>
                                        </td>
                                        <td>${item.price.toLocaleString('es-CL')}</td>
                                        <td>{item.quantity}</td>
                                        <td className="fw-bold">${(item.price * item.quantity).toLocaleString('es-CL')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {items.length > 0 && <tfoot className="table-light">
                                <tr>
                                    <th scope="row" colSpan={3} className="text-end">Total</th>
                                    <td className="fw-bold">${total.toLocaleString('es-CL')}</td>
                                </tr>
                            </tfoot>}
                        </table>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm position-sticky" style={{top: '2rem'}}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Datos de la compra</h5>

                            <form id="card-form" className="mb-3" onSubmit={handleSubmit}>
                                <label>Introduzca los datos de su tarjeta</label>
                                <div className="mb-3">
                                    <input type="text" name="nombre" className="form-control" placeholder="Nombre del titular de la tarjeta" required />
                                </div>
                                <div className="mb-3">
                                    <input className="form-control" required {...getCardNumberProps()} />
                                    <small>{erroredInputs.cardNumber && erroredInputs.cardNumber}</small>
                                </div>
                                <div className="mb-3">
                                    <input className="form-control" required {...getExpiryDateProps()} />
                                    <small>{erroredInputs.expiryDate && erroredInputs.expiryDate}</small>
                                </div>
                                <div className="mb-3">
                                    <input className="form-control" required {...getCVCProps()} />
                                    <small>{erroredInputs.cvc && erroredInputs.cvc}</small>
                                </div>

                                <label>Introduzca su dirección de envío</label>
                                <div className="mb-3">
                                    <input type="text" name="direccion" className="form-control" placeholder="Dirección de envío" required />
                                </div>
                                <div className="mb-3">
                                    <input type="text" name="ciudad" className="form-control" placeholder="Ciudad" required />
                                </div>
                                <div className="mb-3">
                                    <input type="text" name="codigoPostal" className="form-control" placeholder="Código Postal" required />
                                </div>
                                <div className="mb-3">
                                    <input type="text" name="pais" className="form-control" placeholder="País" required />
                                </div>
                                <div className="mb-3">
                                    <input type="email" name="correo" className="form-control" placeholder="Correo electrónico" required />
                                </div>
                                <div className="mb-3">
                                    <input type="tel" name="telefono" className="form-control" placeholder="Teléfono de contacto" required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={items.length === 0}>
                                    Finalizar Compra
                                </button>
                            </form>

                            
                            


                            
                        </div>
                    </div>
                </div>
            </div>
            
        






        </>


    );
}