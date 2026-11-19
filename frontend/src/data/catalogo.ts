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

export type Catalogo = Record<string, Producto>;

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

// --- lo de abajo es el catalogo viejo en localStorage, lo sigue usando AdminProductos ---

const STORAGE_KEY = "CatalogoProductos";

const defaultCatalogo: Catalogo = {
    "FR001": {
        sku: "FR001",
        name: "Manzanas Fuji",        
        category: "Frutas",
        price: 1200,
        stock: 10,
        image: "/productos/manzana-fuji.jpg",
        description: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Fuji"
        }
    },
    "FR002": {
        sku: "FR002",
        name: "Naranjas Valencia",
        category: "Frutas",
        price: 1000,
        stock: 10,
        image: "/productos/naranjas-valencia.png",
        description: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Valencia"
        }
    },
    "FR003": {
        sku: "FR003",
        name: "Plátanos Cavendish",
        category: "Frutas",
        price: 800,
        stock: 10,
        image: "/productos/platano-cavendish.jpg",
        description: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Cavendish"
        }
    }, 
    "VR001": {
        sku: "VR001",
        name: "Zanahorias Orgánicas",
        category: "Verduras",
        price: 900,
        stock: 10,
        image: "/productos/zanahoria-organica.jpg",
        description: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Orgánicas"
        }
    }, 
    "VR002": {
        sku: "VR002",
        name: "Espinacas Frescas",
        category: "Verduras",
        price: 700,
        stock: 10,
        image: "/productos/espinaca-fresca.jpg",
        description: "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Frescas"
        }
    }, 
    "VR003": {
        sku: "VR003",
        name: "Pimientos Tricolores",
        category: "Verduras",
        price: 1500,
        stock: 10,
        image: "/productos/pimientos-tricolores.jpg",
        description: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Tricolores"
        }
    },
    "PO001": {
        sku: "PO001",
        name: "Miel Orgánica",
        category: "Orgánicos",
        price: 5000,
        stock: 10,
        image: "/productos/miel-organica.webp",
        description: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Orgánica"
        }
    },    
    "PO003": {
        sku: "PO003",
        name: "Quinoa Orgánica",
        category: "Orgánicos",
        price: 3000,
        stock: 10,
        image: "/productos/quinoa-organica.jpg",
        
        description: "Quinoa orgánica.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Orgánica"
        }
    },
    "PL001": {
        sku: "PL001",
        name: "Leche Entera",
        category: "Lácteos",
        price: 1000,
        stock: 10,
        image: "/productos/leche-entera.webp",
        description: "Leche de vaca entera.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Entera"
        }
    }    
};

export function getCatalogo(): Catalogo {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCatalogo));
        return defaultCatalogo;
    }
    return JSON.parse(stored) as Catalogo;
}

export function saveCatalogo(catalogo: Catalogo): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogo));
}

export function saveProducto(producto: Producto): void {
    const catalogo = getCatalogo();
    catalogo[producto.sku] = producto;
    saveCatalogo(catalogo);
}

export function deleteProducto(sku: string): void {
    const catalogo = getCatalogo();
    delete catalogo[sku];
    saveCatalogo(catalogo);
}

export function getProductos(): Producto[] {
    return Object.values(getCatalogo());
}

export function getProducto(sku: string): Producto | undefined {
    return getCatalogo()[sku];
}