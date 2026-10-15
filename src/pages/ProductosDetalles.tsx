import { Link } from "react-router-dom";

export default function ProductosDetalles() {
    return(
        <>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="index.html" className="link-secondary text-decoration-none">
                            Inicio
                        </Link >
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="productos.html" className="link-secondary text-decoration-none">
                            Productos
                        </Link >
                    </li>
                    <li className="breadcrumb-item active" id="breadcrumb-product-name" aria-current="page"/>
                </ol>
            </nav>

            <section className="product-detail mb-5">
                <div className="row g-4 align-items-start">

                    <div className="col-lg-6">
                        <div className="card border-0 bg-light p-4 mb-3 text-center shadow-sm">
                            <img 
                                id="product-image" 
                                src="img/not-found.svg" 
                                className="img-fluid" 
                                alt="Cargando producto" 
                                style={{maxHeight: "400px", objectFit: "contain"}}
                            />
                        </div>
                        <div id="product-thumbnails" className="d-flex gap-2"></div>
                    </div>

                    <div className="col-lg-6">
                        <span id="product-badge" className="badge bg-mustard mb-2 px-3 py-2 fs-6 d-none"></span>
                        <h1 id="product-title" className="display-5 fw-bold mb-2"></h1>

                        <p className="text-muted mb-3">
                            SKU: <span id="product-sku"></span> | Categoría: <span id="product-category"></span>
                        </p>

                        <div className="d-flex align-items-center gap-3 my-3">
                            <span id="product-price" className="fs-1 fw-bold text-emerald"></span>                
                        </div>
                    
                        <div className="mb-3">
                            Stock: <span id="product-stock-badge" className="mb-3"></span>
                        </div>

                        <p id="product-description" className="lead mb-4"></p>

                        <hr className="my-4"/>

                        <form id="add-to-cart-form" className="mb-4">
                            <div className="row g-3 align-items-center">
                                <div className="col-auto">
                                    <label htmlFor="quantity-input" className="col-form-label fw-bold">Cantidad:</label>
                                </div>
                                <div className="col-auto">
                                    <div className="input-group" style={{width: "130px"}}>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            id="btn-minus"
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            id="quantity-input" 
                                            className="form-control text-center" 
                                            value="1" min="1"
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            id="btn-plus"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-auto flex-grow-1">
                                    <button 
                                        type="submit" 
                                        id="add-to-cart-btn" 
                                        className="btn btn-primary btn-lg w-100"
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
                <ul className="nav nav-tabs" id="productTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button 
                            className="nav-link active" 
                            id="desc-tab" 
                            data-bs-toggle="tab" 
                            data-bs-target="#desc-pane" 
                            type="button" role="tab"
                        >
                            Descripción
                        </button>
                    </li>
                </ul>
                <div className="tab-content p-4 bg-light border border-top-0" id="productTabContent">
                    <div className="tab-pane fade show active" id="desc-pane" role="tabpanel">
                        <p id="product-long-desc" className="mb-0">
                            Sin información adicional disponible.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}