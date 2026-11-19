import { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { obtenerProductos } from "../data/catalogo";
import { mensajeError } from "../data/api";
import type { Producto } from "../data/catalogo";
import { useCarrito } from "../context/CarritoContext";
import { Link, useSearchParams } from "react-router-dom";

const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // se cargan todos los productos del backend, el filtro se hace aca en el navegador
    useEffect(() => {
        obtenerProductos()
            .then(setProductos)
            .catch((err) => setError(mensajeError(err)))
            .finally(() => setCargando(false));
    }, []);
    const { addItem } = useCarrito();
    const [searchParams, setSearchParams] = useSearchParams();

    const q = searchParams.get("q")?.trim() ?? "";
    const categoria = searchParams.get("categoria") ?? "";

    const categorias = [...new Set(productos.map((p) => p.category))].sort();

    const filtered = productos.filter(
        (p) =>
            (!q || normalize(p.name).includes(normalize(q))) &&
            (!categoria || p.category === categoria)        
    );

    const handleCategoria = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = new URLSearchParams(searchParams);
        if (e.target.value) next.set("categoria", e.target.value);
        else next.delete("categoria");
        setSearchParams(next);
    };

    const handleAdd = (producto: Producto, cantidad: number) => {
        addItem(producto, cantidad);
        alert(`Carrito actualizado.`);
    };


    return(
        <>
            <h1 className="fw-bold">
                {q ? `Resultados para "${q}"`: "Nuestros Productos" }
            </h1>

            <div className="row my-3">
                <div className="col-12 col-sm-6 col-lg-4">
                    <label htmlFor="categoria-select" className="form-label small fw-bold">
                        Categoría
                    </label>
                    <select
                        id="categoria-select"
                        className="form-select"
                        value={categoria}
                        onChange={handleCategoria}
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {cargando ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status"></div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-5">
                    <h3 className="text-muted">No se encontraron productos.</h3>
                    <Link to="/productos" className="btn btn-primary mt-3">
                        Ver todos
                    </Link>
                </div>
            ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center mt-3">
                {filtered.map((p) => (
                    <ProductoCard key={p.sku} producto={p} onAdd={handleAdd} />                    
                ))}            
            </div>
            )}
        </>
    )
}