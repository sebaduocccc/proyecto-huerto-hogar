import { Link } from 'react-router-dom';

export default function Pago(){
    return(
        <>
            <h1 className="fw-bold mb-4">Mi Carrito de Compras</h1>
            <div id="empty-cart-msg" className="text-center py-5 d-none">
                <div className="mb-3">
                    <span className="fs-1 text-muted"></span>
                </div>
                <h3>Tu carrito está vacío</h3>
                <p className="text-muted">No has añadido ningún producto.</p>
                <a href="productos.html" className="btn btn-primary btn-lg mt-2">Ir a ver productos</a>
            </div>
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

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm position-sticky" style={{top: '2rem'}}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Resumen del Pedido</h5>
                            <hr className="my-3" />
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total</span>
                                <span id="cart-total" className="fw-bold"></span>
                            </div>
                            <hr className="my-3" />
                            <form>
                                <label htmlFor="card-number-input" className="form-label small fw-bold text-muted">Número de Tarjeta</label>
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        id="card-number-input" 
                                        inputMode='numeric'
                                        pattern='[0-9]*'
                                        maxLength={16}
                                        className="form-control" 
                                        placeholder="0000 0000 0000 0000"                                                                             
                                    />
                                </div>
                                <label htmlFor="card-date-input" className="form-label small fw-bold text-muted">Fecha de Vencimiento</label>
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        id="card-date-input" 
                                        inputMode='numeric'
                                        pattern='[0-9]*'
                                        maxLength={4}
                                        className="form-control" 
                                        placeholder="MMAA"                                                                              
                                    />
                                </div>
                                <label htmlFor="card-cvv-input" className="form-label small fw-bold text-muted">Código de Verificación</label>
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        id="card-cvv-input" 
                                        inputMode='numeric'
                                        pattern='[0-9]*'
                                        maxLength={3}
                                        className="form-control" 
                                        placeholder="000"                                                                           
                                    />
                                </div>                                
                            </form>                                                
                            <hr className="my-3" />
                            <form id="coupon-form" className="mb-3">                              

                                <label htmlFor="coupon-input" className="form-label small fw-bold text-muted">Ingresa tu cupón</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        id="coupon-input" 
                                        className="form-control text-uppercase disabled" 
                                        placeholder="No hay cupones disponibles"                                         
                                    />
                                    <button 
                                        type="submit" 
                                        id="apply-coupon-btn" 
                                        className="btn btn-outline-secondary disabled"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                                <div id="coupon-message" className="form-text mt-1"></div>
                            </form>
                            <Link to='pagocorrecto'>
                                <button 
                                type="button" 
                                id="checkout-btn" 
                                className="btn btn-primary btn-lg w-100"
                                >
                                Pagar
                                </button>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
            
        






        </>


    );
}