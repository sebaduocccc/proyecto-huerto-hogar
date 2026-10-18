import { Link } from "react-router-dom";
import { useState } from "react";
import { getProductos, getProducto, saveProducto, deleteProducto } from "../data/catalogo";
import type { Producto } from "../data/catalogo";

type FormState = {
    sku: string;
    name: string;
    category: string;
    price: string;
    stock: string;
    image: string;
    description: string;
};

const emptyForm: FormState = {
    sku: "", name: "", category: "", price: "", stock: "", image: "", description: "",
};

export default function AdminProductos() {
    const [productos, setProductos] = useState<Producto[]>(() => getProductos());
    const [form, setForm] = useState<FormState>(emptyForm);
    const [editingSku, setEditingSku] = useState<string | null>(null);

    const isEditing = editingSku !== null;

    const refresh = () => setProductos(getProductos());

    const resetForm = () => {
        setForm(emptyForm);
        setEditingSku(null);
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value} = e.target;
        setForm((f) => ({ ...f, [name]: value}));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const sku = form.sku.trim().toUpperCase();

        if (!isEditing && getProducto(sku)) {
            alert(`"${sku}" ya existe.`)
            return;
        }

        const existing = getProducto(sku);

        saveProducto({
            sku,
            name: form.name.trim(),
            category: form.category,
            stock: Number(form.stock),
            price: Number(form.price),
            image: form.image.trim() || "/src/assets/not-found.svg",
            description: form.description.trim(),
            longDescription: existing?.longDescription ?? { Origen: "Chile" },
        });

        resetForm();
        refresh();
        alert(`${sku} guardado correctamente`);
    };

    const handleEdit = (p: Producto) => {
        setEditingSku(p.sku);
        setForm({
            sku: p.sku,
            name: p.name,
            category: p.category,
            stock: String(p.stock),
            price: String(p.price),
            image: p.image,
            description: p.description,            
        })
    }

    const handleDelete = (sku: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar el producto ${sku}?`)) return;
        deleteProducto(sku);
        if (editingSku === sku) resetForm();
        refresh();
    }
    

    return (
        <>            
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold">Panel de Administración de Productos</h1>
                    <Link to="/" className="btn btn-outline-secondary">Volver a la Tienda</Link >
                </div>

                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    {isEditing ? `Editar Producto (${editingSku})` : "Agregar Producto"}
                                </h5>
                                <form onSubmit={handleSubmit}>                                   
                                    <div className="mb-3">
                                        <label htmlFor="sku-input" className="form-label small fw-bold">SKU</label>
                                        <input 
                                            id="sku-input"  
                                            name="sku"
                                            type="text"
                                            className="form-control" 
                                            placeholder="Ej: FR001" required 
                                            value={form.sku} 
                                            onChange={handleChange} 
                                            disabled={isEditing}
                                        />
                                        <div className="form-text">Identificador único del producto</div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="name-input" className="form-label small fw-bold">Nombre</label>
                                        <input 
                                            id="name-input"  
                                            name="name"
                                            type="text"
                                            className="form-control" 
                                            placeholder="Ej: Manzanas" required 
                                            value={form.name} 
                                            onChange={handleChange}                                             
                                        />                                        
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="category-input" className="form-label small fw-bold">Categoría</label>
                                        <select 
                                            id="category-input"  
                                            name="category"                                            
                                            className="form-select"  required
                                            value={form.category} 
                                            onChange={handleChange}                                             
                                        >  
                                            <option value="" disabled>Selecciona una categoría</option>
                                            <option value="Frutas">Frutas</option>
                                            <option value="Verduras">Verduras</option>
                                            <option value="Orgánicos">Orgánicos</option>
                                            <option value="Lácteos">Lácteos</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="stock-input" className="form-label small fw-bold">Stock</label>
                                        <input 
                                            id="stock-input"  
                                            name="stock"
                                            type="number"
                                            className="form-control" 
                                            min={0}
                                            placeholder="Ej: 1" required 
                                            value={form.stock} 
                                            onChange={handleChange}                                             
                                        />                                        
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="price-input" className="form-label small fw-bold">Precio</label>
                                        <input 
                                            id="price-input"  
                                            name="price"
                                            type="number"
                                            className="form-control" 
                                            min={1}
                                            placeholder="Ej: 1" required 
                                            value={form.price} 
                                            onChange={handleChange}                                             
                                        />                                        
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="image-input" className="form-label small fw-bold">Imágen</label>
                                        <input 
                                            id="image-input"  
                                            name="image"
                                            type="text"
                                            className="form-control" 
                                            placeholder="Ej: /img/not-found.svg"
                                            value={form.image}  
                                            onChange={handleChange}                                             
                                        />                                        
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description-input" className="form-label small fw-bold">Descripción</label>
                                        <textarea 
                                            id="description-input"  
                                            name="description"                                                                                      
                                            className="form-control"                                             
                                            rows={2}
                                            value={form.description}  
                                            onChange={handleChange}                                             
                                        />                                        
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            {isEditing ? "Actualizar Producto" : "Guardar Producto"}
                                        </button>
                                        {isEditing && (
                                            <button type="button" className="btn btn-outline-danger" onClick={resetForm}>
                                                Cancelar
                                            </button>
                                        )}                                        
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
                                    <tbody>
                                        {productos.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-4">
                                                    El catálogo está vacío
                                                </td>
                                            </tr>
                                        ) : (
                                            productos.map((p) => (
                                                <tr key = {p.sku}>
                                                    <td>{p.sku}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img src={p.image} alt=""
                                                                style={{ width: 35, height: 35, objectFit: "contain"}}/>
                                                                <span>{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{p.category}</td>
                                                    <td>{p.stock}</td>
                                                    <td>${p.price.toLocaleString("es-CL")}</td>
                                                    <td className="text-end">
                                                        <button 
                                                            className="btn btn-sm btn-primary me-1" 
                                                            onClick={() => handleEdit(p)}
                                                        >Editar</button>
                                                        <button 
                                                            className="btn btn-sm btn-danger me-1" 
                                                            onClick={() => handleDelete(p.sku)}
                                                        >Eliminar</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}