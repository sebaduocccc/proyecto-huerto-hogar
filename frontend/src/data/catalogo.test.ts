import { AxiosError, AxiosHeaders } from "axios";
import api from "./api";
import { obtenerProductos, obtenerProducto, guardarProducto, eliminarProducto } from "./catalogo";

// en los tests no hay backend: se simulan las llamadas de axios
vi.mock("./api", () => ({
    default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

// producto como lo devuelve el backend
const manzanaApi = {
    sku: "FR001", nombre: "Manzanas Fuji", categoria: "Frutas", precio: 1200, stock: 10,
    imagen: "/productos/manzana-fuji.jpg", descripcion: "Manzanas", detalles: { Origen: "Chile" },
};

beforeEach(() => {
    vi.clearAllMocks();
});

it("carga los productos y los convierte al formato del frontend", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [manzanaApi] });

    const productos = await obtenerProductos();

    expect(api.get).toHaveBeenCalledWith("/productos");
    expect(productos[0]).toEqual({
        sku: "FR001", name: "Manzanas Fuji", category: "Frutas", price: 1200, stock: 10,
        image: "/productos/manzana-fuji.jpg", description: "Manzanas", longDescription: { Origen: "Chile" },
    });
});

it("usa la imagen por defecto si el producto no tiene", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { ...manzanaApi, imagen: null } });
    expect((await obtenerProducto("FR001"))?.image).toBe("/not-found.svg");
});

it("devuelve undefined cuando el SKU no existe (404)", async () => {
    const config = { headers: new AxiosHeaders() };
    vi.mocked(api.get).mockRejectedValue(new AxiosError("404", "ERR", config, null, {
        status: 404, statusText: "", headers: {}, config, data: {},
    }));

    expect(await obtenerProducto("XX999")).toBeUndefined();
});

it("crea un producto con POST y lo edita con PUT", async () => {
    const producto = {
        sku: "TE001", name: "Test", category: "Frutas", price: 100,
        stock: 5, image: "", description: "", longDescription: null,
    };

    await guardarProducto(producto, true);
    expect(api.post).toHaveBeenCalledWith("/productos", expect.objectContaining({
        sku: "TE001", nombre: "Test", precio: 100, imagen: null,
    }));

    await guardarProducto(producto, false);
    expect(api.put).toHaveBeenCalledWith("/productos/TE001", expect.objectContaining({ nombre: "Test" }));
});

it("elimina un producto", async () => {
    await eliminarProducto("FR001");
    expect(api.delete).toHaveBeenCalledWith("/productos/FR001");
});
