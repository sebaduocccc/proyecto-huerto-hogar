import { getProductos, getProducto, saveProducto, deleteProducto } from "./catalogo";

beforeEach(() => {
    localStorage.clear();
});

it("carga los productos por defecto", ()=> {
    expect(getProductos().length).toBeGreaterThan(0);
    expect(getProducto("FR001")?.name).toBe("Manzanas Fuji");
});

it("devuelve undefined cuando el SKU es desconocido", () => {
    expect(getProducto("vacio")).toBeUndefined();
});

it("guarda un producto", () => {
    saveProducto({
        sku: "TEST1", name: "Test", category: "Frutas", price: 100,
        stock: 5, image: "", description: "", longDescription: {},
    });
    expect(getProducto("TEST1")?.price).toBe(100);
});

it("elimina un producto", () => {
    deleteProducto("FR001");
    expect(getProducto("FR001")).toBeUndefined();
});