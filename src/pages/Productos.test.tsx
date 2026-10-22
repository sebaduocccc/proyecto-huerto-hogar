import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CarritoProvider } from "../context/CarritoContext";
import { getProductos } from "../data/catalogo";
import Productos from "./Productos";

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