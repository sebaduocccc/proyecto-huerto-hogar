import { useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { getProductos } from "../data/catalogo";
import type { Producto } from "../data/catalogo";
import { useCarrito } from "../context/CarritoContext";

export default function Productos() {
    const[productos] = useState(() => getProductos());
    const { addItem } = useCarrito();

    const handleAdd = (producto: Producto, cantidad: number) => {
        addItem(producto, cantidad);
        alert(`${cantidad} unidad(es) de ${producto.name} añadido(s) al carrito.`);
    };


    return(
        <>
            <h1 className="fw-bold">
                Nuestros Productos
            </h1>
            
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center mt-3">
                {productos.map((p) => (
                    <ProductoCard key={p.sku} producto={p} onAdd={handleAdd} />                    
                ))}            
            </div>
        </>
    )
}