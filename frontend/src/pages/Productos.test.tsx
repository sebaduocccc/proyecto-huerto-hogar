import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../context/CarritoContext";
import type { Producto } from "../data/catalogo";
import Productos from "./Productos";
import userEvent from "@testing-library/user-event";

// en los tests no hay backend: obtenerProductos devuelve estos productos de ejemplo
const productosPrueba: Producto[] = [
    { sku: "FR001", name: "Manzanas Fuji", category: "Frutas", price: 1200, stock: 10, image: "", description: "", longDescription: {} },
    { sku: "VR001", name: "Zanahorias Orgánicas", category: "Verduras", price: 900, stock: 10, image: "", description: "", longDescription: {} },
    { sku: "PL001", name: "Leche Entera", category: "Lácteos", price: 1000, stock: 10, image: "", description: "", longDescription: {} },
];

vi.mock("../data/catalogo", () => ({
    obtenerProductos: async () => productosPrueba,
}));

beforeEach(() => {
    localStorage.clear();
});

function renderAt(url: string) {
    render(
        <CarritoProvider>
            <MemoryRouter initialEntries={[url]}>
                <Productos/>
            </MemoryRouter>
        </CarritoProvider>
    );
}

it("genera una tarjeta por producto", async () => {
    renderAt("/productos");
    const buttons = await screen.findAllByRole("button", { name: /añadir al carrito/i });
    expect(buttons).toHaveLength(productosPrueba.length);
});

it("muestra el mensaje de que no hay productos", async () => {
    renderAt("/productos?q=asdasd");
    expect(await screen.findByText("No se encontraron productos.")).toBeTruthy();
});

it("oculta el mensaje de que no hay productos cuando sí hay productos", async () => {
    renderAt("/productos?q=manzana");
    await screen.findAllByRole("button", { name: /añadir al carrito/i });
    expect(screen.queryByText("No se encontraron productos.")).toBeNull();
});

it("añade productos al carrito cuando se presiona el botón", async () => {
    renderAt("/productos");
    const buttons = await screen.findAllByRole("button", { name: /añadir al carrito/i });
    await userEvent.click(buttons[0]);

    const carrito = JSON.parse(localStorage.getItem("carrito")!);
    expect(carrito).toHaveLength(1);
    expect(carrito[0].sku).toBe("FR001");
    expect(carrito[0].quantity).toBe(1);
});

it("guarda la cantidad seleccionada", async () => {
    renderAt("/productos");

    await userEvent.click((await screen.findAllByText("+"))[0]);
    await userEvent.click(screen.getAllByRole("button", { name: /añadir al carrito/i })[0]);

    const carrito = JSON.parse(localStorage.getItem("carrito")!);
    expect(carrito[0].quantity).toBe(2);
});