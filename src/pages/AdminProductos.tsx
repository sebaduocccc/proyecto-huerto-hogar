import { Link } from "react-router-dom";

export default function AdminProductos() {
    return (
        <>            
            <div className="wrapper">
                <aside id="sidebar">
                    <div className="d-flex">
                        <button id="toggle-btn" type="button">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div className="sidebar-logo">
                            <a href="#">HuertoHogar</a>
                        </div>
                    </div>
                    <ul className="sidebar-nav">
                        <li className="sidebar-item sidebar-focus">
                            <Link to="admin-usuarios.html" className="sidebar-link">
                                <i className="fa-solid fa-users-rectangle"></i>
                                <span>Usuarios</span>
                            </Link >
                        </li>
                        
                        <li className="sidebar-item sidebar-focused-item">
                            <Link to="admin-productos.html" className="sidebar-link">
                                <i className="fa-solid fa-carrot"></i>
                                <span>Productos</span>
                            </Link >
                        </li>
                    </ul>
                </aside>
            </div>

            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold">Panel de Administración de Productos</h1>
                    <Link to="index.html" className="btn btn-outline-secondary">Volver a la Tienda</Link >
                </div>

                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3" id="form-title">Agregar Productos</h5>
                                <form id="product-form">
                                    {/* para saber si alguien está editando el catalogo */}
                                    <input type="hidden" id="is-editing" value="false"/>

                                    <div className="mb-3">
                                        <label htmlFor="sku-input" className="form-label small fw-bold">SKU</label>
                                        <input type="text" id="sku-input" className="form-control" placeholder="Ej: FR001" required/>
                                        <div className="form-text">Identificador único del producto</div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="name-input" className="form-label small fw-bold">Nombre</label>
                                        <input type="text" id="name-input" className="form-control" placeholder="Ej: Manzanas" required/>                                
                                    </div>

                                    <div className="d-grid mb-3">
                                        <label htmlFor="category-input" className="form-label small fw-bold">Categoría</label>                                
                                        <select name="category-input" id="category-input" required>
                                            <option value="" disabled selected>Selecciona una categoría</option>
                                            <option value="Frutas">Frutas</option>
                                            <option value="Verduras">Verduras</option>
                                            <option value="Orgánicos">Orgánicos</option>
                                            <option value="Lácteos">Lácteos</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="stock-input" className="form-label small fw-bold">Stock</label>
                                        <input type="number" id="stock-input" className="form-control" min="0" placeholder="Ej: 1" required/> 
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="price-input" className="form-label small fw-bold">Precio</label>
                                        <input type="text" id="price-input" className="form-control" min="1" placeholder="Ej: 1000" required/>                                
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="image-input" className="form-label small fw-bold">Imagen</label>
                                        <input type="text" id="image-input" className="form-control" placeholder="Ej: img/not-found.svg"/>           
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description-input" className="form-label small fw-bold">Descripción</label>
                                        <textarea id="description-input" className="form-control" rows={2}></textarea>                              
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" id="save-btn" className="btn btn-primary">Guardar Producto</button>
                                        <button type="button" id="cancel-btn" className="btn btn-outline-danger">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4">
                            <h5 className="fw-bold mb-3">Inventario Actual</h5>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>SKU</th>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Stock</th>
                                            <th>Precio</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-table-body"></tbody>
                                </table>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}