import { useState } from "react";
import { Link } from "react-router-dom";
import ProductoCard from "../components/ProductoCard";
import { getProductos } from "../data/catalogo";
import type { Producto } from "../data/catalogo";
import { useCarrito } from "../context/CarritoContext";


export default function Home() {
    const [productos] = useState(()=> getProductos().slice(0,4));
    const {addItem} = useCarrito();

    const handleAdd = (producto: Producto, cantidad: number) => {
        addItem(producto, cantidad);
        alert(`${cantidad} unidad(es) de ${producto.name} añadido(s) al carrito.`);
    };

    return (
        <>
            <section className="hero mb-5 bg-light p-4 p-lg-5 shadow-sm">
                <div className="row align-items-center g-4 px-md-5">
                    <div className="col-lg-6 text-center text-lg-start order-2 order-lg-1">
                        <h1 className="display-5 fw-bold">Huerto Hogar</h1>
                        <p className="lead">Revisa nuestros productos de temporada</p>
                        <a href="/productos" className="btn btn-primary btn-lg px-4">Ver Productos</a>
                    </div>
                    <div className="col-lg-6 text-center order-1 order-lg-2">
                        <Link to="/productos">
                            <img 
                                src="src/assets/huerto-hogar.webp" 
                                className="img-fluid shadow-sm 
                                rounded" alt="Huerto Hogar"
                            />
                        </Link>
                    </div>
                </div>
            </section> 

            {productos.length === 0 ? (
                <div className="text-center py-5">
                    <h3 className="text-muted">No hay productos disponibles.</h3>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 justify-content-center mt-3">
                    {productos.map((p) => (
                        <ProductoCard key={p.sku} producto={p} onAdd={handleAdd}/>
                    ))}
                </div>
            )}
        </>
    );
}