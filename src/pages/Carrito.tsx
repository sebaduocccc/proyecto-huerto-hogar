import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';


export default function Carrito() {
    const { items, total, updateQuantity, removeItem, clearCarrito } = useCarrito();

    const handleClear = () => {
        if (confirm("¿Realmente quieres vaciar tu carrito?")) {
            clearCarrito();
        }
    };

    if(items.length === 0) {
        return (
            <>
                <h1 className="fw-bold mb-4">Mi Carrito de Compras</h1>
                    <div className="text-center py-5">
                    <h3>Tu carrito está vacío</h3>
                    <p className="text-muted">No has añadido ningún producto.</p>
                    <Link to="/productos" className="btn btn-primary btn-lg mt-2">
                        Ir a ver productos
                    </Link >
                </div>            
            </>
        )
    }
    return(
        <>
            <h1 className="fw-bold mb-4">Mi Carrito de Compras</h1>                  

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
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.sku}>
                                        <td>
                                            <div className='d-flex align-items-center gap-3'>
                                                <img 
                                                    src={item.image || "/src/assets/not-found.svg"}
                                                    alt={item.name}
                                                    style={{ width: "60px", objectFit: "contain" }}
                                                />
                                                <span className='fw-bold'>{item.name}</span>
                                            </div>
                                        </td>
                                        <td>${item.price.toLocaleString("es-CL")}</td>
                                        <td>
                                            <div className='input-group input-group-sm' style={{ width: "110px"}}>
                                                <button
                                                    type='button'
                                                    className='btn btn-outline-secondary'
                                                    onClick={() => updateQuantity(item.sku, -1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className='form-control text-center'>{item.quantity}</span>
                                                <button
                                                    type='button'
                                                    className='btn btn-outline-secondary'
                                                    onClick={() => updateQuantity(item.sku, 1)}                                                    
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className='fw-bold'>
                                            ${(item.price * item.quantity).toLocaleString("es-CL")}
                                        </td>
                                        <td className='text-end'>
                                            <button
                                                type="button"
                                                className='btn btn-outline-danger btn-sm'
                                                onClick={() => removeItem(item.sku)}
                                                aria-label={`Eliminar ${item.name}`}
                                            >
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>                        
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="d-flex justify-content-between align-item-center mt-3">
                        <Link to="/productos" className="btn btn-outline-secondary">
                            &larr; Seguir Comprando
                        </Link >
                        <button 
                            type="button" 
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleClear}
                        >
                            Vaciar Carrito
                        </button>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm position-sticky" style={{top: '2rem'}}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Resumen del Pedido</h5>

                            <hr className="my-3" />

                            <div className="d-flex justify-content-between mb-2">
                                <span>Total</span>
                                <span id="cart-total" className="fw-bold">${total.toLocaleString("es-CL")}</span>
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

                            <Link to='/carrito/pago'>
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