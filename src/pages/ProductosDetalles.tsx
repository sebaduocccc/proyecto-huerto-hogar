import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProducto } from "../data/catalogo";
import { useCarrito } from "../context/CarritoContext";

export default function ProductosDetalles() {
    const {sku} = useParams<{sku: string}>();
    const {addItem} = useCarrito();

    const producto = sku ? getProducto(sku) : undefined;

    const [cantidad, setCantidad] = useState(1);    

    if (!producto) {
        return(
            <div className="text-center py-5">
                <h2>Producto no encontrado</h2>
                <p className="text-muted">El producto que buscas no existe o fue removido</p>                
                <Link to="/productos" className="btn btn-primary mt-3">
                    &larr; Volver al catálogo
                </Link >
            </div>
        );
    }    

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        addItem(producto, cantidad);
        alert(`Carrito actualizado.`);
    }

    return(
        <>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" className="link-secondary text-decoration-none">
                            Inicio
                        </Link >
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/productos" className="link-secondary text-decoration-none">
                            Productos
                        </Link >
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {producto.name}
                    </li>
                </ol>
            </nav>

            <section className="product-detail mb-5">
                <div className="row g-4 align-items-start">

                    <div className="col-lg-6">
                        <div className="card border-0 bg-light p-4 mb-3 text-center shadow-sm">
                            <img 
                                src={producto.image}
                                className="img-fluid" 
                                alt={producto.name}
                                style={{maxHeight: "400px", objectFit: "contain"}}
                            />
                        </div>                        
                    </div>

                    <div className="col-lg-6">                        
                        <h1 className="display-5 fw-bold mb-2">{producto.name}</h1>

                        <p className="text-muted mb-3">
                            SKU: {producto.sku} | Categoría: {producto.category}
                        </p>

                        <div className="d-flex align-items-center gap-3 my-3">
                            <span className="fs-1 fw-bold text-emerald">
                                ${producto.price.toLocaleString("es-CL")}
                            </span>                
                        </div>
                    
                        <div className="mb-3">
                            Stock: {producto.stock}
                        </div>

                        <p className="lead mb-4">{producto.description}</p>

                        <hr className="my-4"/>

                        <form className="mb-4" onSubmit={handleSubmit}>
                            <div className="row g-3 align-items-center">
                                <div className="col-auto">
                                    <label htmlFor="quantity-input" className="col-form-label fw-bold">Cantidad:</label>
                                </div>
                                <div className="col-auto">
                                    <div className="input-group" style={{width: "130px"}}>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            onClick={() => setCantidad((c) => Math.max(1, c-1))}
                                        >
                                            -
                                        </button>
                                        <span className="form-control text-center quantity-input">
                                            {cantidad}
                                        </span>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            onClick={() => setCantidad((c) => (c+1))}
                                            disabled={cantidad>=producto.stock}                                        
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-auto flex-grow-1">
                                    <button 
                                        type="submit"                                         
                                        className="btn btn-primary btn-lg w-100"
                                        disabled={cantidad>producto.stock}
                                    >
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section className="my-5">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <span className="nav-link active">
                            Descripción
                        </span>               
                    </li>
                </ul>
                <div className="tab-content p-4 bg-light border border-top-0">
                    {producto.longDescription ? (
                        <ul className="list-unstyled mb-0">
                            {Object.entries(producto.longDescription).map(([clave, valor]) => (
                                <li key={clave} className="py-1 border-bottom">
                                    <strong className="text-dark">{clave}:</strong>{" "}
                                    <span className="text-secondary">{valor}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mb-0">Sin información adicional disponible.</p>
                    )}                    
                </div>
            </section>
        </>
    );
}