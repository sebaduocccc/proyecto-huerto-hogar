export default function Carrito() {
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
                                    <th scope="col" className="text-end">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody id="cart-table-body">

                            </tbody>
                        </table>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <a href="productos.html" className="btn btn-outline-secondary">
                            &larr; Seguir Comprando
                        </a>
                        <button id="clear-cart-btn" className="btn btn-outline-danger btn-sm">
                            Vaciar Carrito
                        </button>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm position-sticky" style={{top: '2rem'}}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Resumen del Pedido</h5>
                            {/* <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span id="cart-subtotal" className="fw-bold"></span>
                            </div> -->
                            <!-- <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Envío</span>
                                <span id="cart-shipping" className="fw-bold"></span>
                            </div> */}

                            <hr className="my-3" />

                            <div className="d-flex justify-content-between mb-2">
                                <span>Total</span>
                                <span id="cart-total" className="fw-bold"></span>
                            </div>

                            <form id="coupon-form" className="mb-3">
                                <label htmlFor="coupon-input" className="form-label small fw-bold text-muted">Ingresa tu cupón</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        id="coupon-input" 
                                        className="form-control text-uppercase disabled" 
                                        placeholder="No hay cupones disponibles" 
                                        aria-label="Código de descuento"
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

                            <button 
                                type="button" 
                                id="checkout-btn" 
                                className="btn btn-primary btn-lg w-100"
                            >
                                Pagar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}