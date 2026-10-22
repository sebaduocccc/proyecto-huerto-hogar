import { useState } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../data/catalogo";

type Props = {
    producto: Producto;
    onAdd: (producto: Producto, cantidad: number) => void;    
};


export default function ProductoCard({ producto, onAdd }: Props) {
    const [cantidad, setCantidad] = useState(1);

    return(
        <div className="col">
            <div className="card h-100 producto-card border-0 shadow-sm text-center">
                <div className="card-image-wrapper">
                    <Link to={`/productos/${producto.sku}`}>
                        <img 
                            src={producto.image}
                            className="card-img-top img-fluid mt-3" 
                            alt={producto.name} 
                            style={{height: '100px', objectFit: 'contain'}}
                        />
                    </Link >
                </div>

                <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                        <span className="badge bg-light text-secondary mb-2">
                            {producto.category}
                        </span>
                        <h5 className="card-title mb-1">
                            <Link to={`/productos/${producto.sku}`} className="producto-link text-decoration-none text-dark fw-bold">
                                {producto.name}
                            </Link >
                        </h5>
                        <p className="producto-price fw-bold text-emerald fs-5 mb-3">
                            ${producto.price.toLocaleString('es-CL')}
                        </p>
                    </div>
                    <div className="input-group my-3 align-self-center" style={{width: '130px'}}>
                        <button type="button" className="btn btn-outline-secondary btn-qty-minus" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
                            -
                        </button>
                        <span className="form-control text-center quantity-input">
                            {cantidad}
                        </span>
                        <button type="button" className="btn btn-outline-secondary btn-qty-plus"                         
                            onClick={() => setCantidad((c) => c + 1)}
                            disabled={cantidad>=producto.stock}>
                            +
                        </button>
                    </div>
                    <button type="button" className="btn btn-primary add-to-cart-btn w-100" onClick={() => onAdd(producto, cantidad)}>
                        <i className="fa-solid fa-cart-shopping me-2"></i>Añadir al carrito
                    </button>                        
                </div>
            </div>
        </div> 
    );
}
    