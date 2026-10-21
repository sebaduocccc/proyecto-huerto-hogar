import { useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { getProductos } from "../data/catalogo";
import type { Producto } from "../data/catalogo";
import { useCarrito } from "../context/CarritoContext";
import { Link, useSearchParams } from "react-router-dom";

const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Productos() {
    const[productos] = useState(() => getProductos());
    const { addItem } = useCarrito();
    const [searchParams] = useSearchParams();

    const q = searchParams.get("q")?.trim() ?? "";

    const filtered = q
        ? productos.filter((p) => normalize(p.name).includes(normalize(q)))
        : productos;

    const handleAdd = (producto: Producto, cantidad: number) => {
        addItem(producto, cantidad);
        alert(`${cantidad} unidad(es) de ${producto.name} añadido(s) al carrito.`);
    };


    return(
        <>
            <h1 className="fw-bold">
                {q ? `Resultados para "${q}"`: "Nuestros Productos" }
            </h1>
            
            {filtered.length === 0 ? (
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