import axios from "axios";
import api from "./api";

export type Producto = {
    sku: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description: string;
    longDescription: Record<string, string>;
};

// producto tal como lo devuelve el backend (ProductoResponse)
type ProductoApi = {
    sku: string;
    nombre: string;
    categoria: string;
    precio: number;
    stock: number;
    imagen: string | null;
    descripcion: string | null;
    detalles: Record<string, string>;
};

// convierte los nombres del backend a los que usa el frontend,
// asi las paginas y componentes no tienen que cambiar
function desdeApi(p: ProductoApi): Producto {
    return {
        sku: p.sku,
        name: p.nombre,
        category: p.categoria,
        price: p.precio,
        stock: p.stock,
        image: p.imagen || "/not-found.svg",
        description: p.descripcion ?? "",
        longDescription: p.detalles ?? {},
    };
}

export async function obtenerProductos(): Promise<Producto[]> {
    const res = await api.get<ProductoApi[]>("/productos");
    return res.data.map(desdeApi);
}

// devuelve undefined si el producto no existe (404)
export async function obtenerProducto(sku: string): Promise<Producto | undefined> {
    try {
        const res = await api.get<ProductoApi>(`/productos/${encodeURIComponent(sku)}`);
        return desdeApi(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return undefined;
        }
        throw error;
    }
}

export type Categoria = {
    id: number;
    nombre: string;
    descripcion: string | null;
};

export async function obtenerCategorias(): Promise<Categoria[]> {
    const res = await api.get<Categoria[]>("/categorias");
    return res.data;
}

// crea (POST) o edita (PUT) un producto en el backend.
// al editar, si longDescription viene null el backend conserva los detalles que tenia
export async function guardarProducto(producto: Omit<Producto, "longDescription"> & { longDescription: Record<string, string> | null }, esNuevo: boolean): Promise<void> {
    const datos = {
        sku: producto.sku,
        nombre: producto.name,
        categoria: producto.category,
        precio: producto.price,
        stock: producto.stock,
        imagen: producto.image || null,
        descripcion: producto.description || null,
        detalles: producto.longDescription,
    };
    if (esNuevo) {
        await api.post("/productos", datos);
    } else {
        await api.put(`/productos/${encodeURIComponent(producto.sku)}`, datos);
    }
}

export async function eliminarProducto(sku: string): Promise<void> {
    await api.delete(`/productos/${encodeURIComponent(sku)}`);
}
