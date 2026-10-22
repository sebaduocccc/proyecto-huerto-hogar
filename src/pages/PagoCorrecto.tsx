import { Link } from 'react-router-dom';
import { CHECKOUT_STORAGE_KEY, type CheckoutDetails } from '../data/checkout';

export default function PagoCorrecto(){
    const savedDetails = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    const details = savedDetails ? JSON.parse(savedDetails) as CheckoutDetails : null;

    return(
        <section className="mx-auto" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4">
                <h1 className="fw-bold">Gracias por tu compra</h1>
                <p className="lead mb-1">El pago fue procesado correctamente.</p>
                {details && (
                    <p className="text-secondary">
                        Pedido realizado el {new Date(details.fechaCompra).toLocaleString('es-CL')}
                    </p>
                )}
            </div>

            {details ? (
                <div className="row g-4">
                    <div className="col-md-6">
                        <section className="card h-100 border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold mb-3">Resumen de la compra</h2>
                                <dl className="mb-0">
                                    <div className="d-flex justify-content-between gap-3 py-2 border-bottom">
                                        <dt className="fw-normal text-secondary">Estado</dt>
                                        <dd className="mb-0 fw-semibold text-success">Confirmada</dd>
                                    </div>
                                    <div className="d-flex justify-content-between gap-3 py-2">
                                        <dt className="fw-normal text-secondary">Método de pago</dt>
                                        <dd className="mb-0">Tarjeta</dd>
                                    </div>
                                </dl>
                                <p className="small text-secondary mb-0">
                                    Por seguridad, no mostramos ni guardamos los datos de la tarjeta.
                                </p>
                            </div>
                        </section>
                    </div>
                    <div className="col-md-6">
                        <section className="card h-100 border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold mb-3">Datos del usuario</h2>
                                <dl className="mb-0">
                                    <div className="py-2 border-bottom">
                                        <dt className="fw-normal text-secondary">Nombre</dt>
                                        <dd className="mb-0">{details.nombre}</dd>
                                    </div>
                                    <div className="py-2 border-bottom">
                                        <dt className="fw-normal text-secondary">Correo electrónico</dt>
                                        <dd className="mb-0">{details.correo}</dd>
                                    </div>
                                    <div className="py-2">
                                        <dt className="fw-normal text-secondary">Teléfono</dt>
                                        <dd className="mb-0">{details.telefono}</dd>
                                    </div>
                                </dl>
                            </div>
                        </section>
                    </div>
                    <div className="col-12">
                        <section className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold mb-3">Dirección de envío</h2>
                                <p className="mb-0">
                                    {details.direccion}, {details.ciudad}, {details.codigoPostal}, {details.pais}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                <div className="alert alert-info text-center" role="status">
                    No hay detalles de una compra reciente en este navegador.
                </div>
            )}

            <div className="text-center mt-4">
                <Link to="/productos" className="btn btn-primary">Seguir comprando</Link>
            </div>
        </section>
    );
}