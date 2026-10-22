import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../context/CarritoContext";
import { getProductos } from "../data/catalogo";
import Productos from "./Productos";
import userEvent from "@testing-library/user-event";

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

it("genera una tarjeta por producto", () => {
    renderAt("/productos");
    const buttons = screen.getAllByRole("button", { name: /añadir al carrito/i });
    expect(buttons).toHaveLength(getProductos().length);
});

it("muestra el mensaje de que no hay productos", () => {
    renderAt("/productos?q=asdasd");
    expect(screen.getByText("No se encontraron productos.")).toBeTruthy();
});

it("oculta el mensaje de que no hay productos cuando sí hay productos", () => {
    renderAt("/productos?q=manzana");
    expect(screen.queryByText("No se encontraron productos.")).toBeNull();
});

it("añade productos al carrito cuando se presiona el botón", async () => {
    renderAt("/productos");
    const buttons = screen.getAllByRole("button", { name: /añadir al carrito/i });
    await userEvent.click(buttons[0]);

    const carrito = JSON.parse(localStorage.getItem("carrito")!);
    expect(carrito).toHaveLength(1);
    expect(carrito[0].sku).toBe("FR001");
    expect(carrito[0].quantity).toBe(1);
});

it("guarda la cantidad seleccionada", async () => {
    renderAt("/productos");

    await userEvent.click(screen.getAllByText("+")[0]);
    await userEvent.click(screen.getAllByRole("button", { name: /añadir al carrito/i })[0]);

    const carrito = JSON.parse(localStorage.getItem("carrito")!);
    expect(carrito[0].quantity).toBe(2);
});