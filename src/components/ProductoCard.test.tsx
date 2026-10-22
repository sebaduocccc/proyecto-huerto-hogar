import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductoCard from "./ProductoCard";

const producto = {
    sku: "FR001", name: "Manzanas", category: "Frutas", price: 1000,
    stock: 10, image: "", description: "", longDescription: {},
};

function setup() {
    const onAdd = vi.fn();
    render(
        <MemoryRouter>
            <ProductoCard producto={producto} onAdd={onAdd}/>
        </MemoryRouter>
    );
    return onAdd;
}

it("muestra que el producto recibe props", () => {
    setup();
    expect(screen.getByText("Manzanas")).toBeTruthy();
    expect(screen.getByText("Frutas")).toBeTruthy();
});

it("cambia la cantidad cuando el botón + es clicado", async () => {
    setup();
    await userEvent.click(screen.getByText("+"));
    expect(screen.getByText("2")).toBeTruthy();
});

it("llama a onAdd con la cantidad", async () => {
    const onAdd = setup();
    await userEvent.click(screen.getByText("+"));
    await userEvent.click(screen.getByText("+"));
    await userEvent.click(screen.getByRole("button", { name: /añadir al carrito/i}));
    expect(onAdd).toHaveBeenCalledWith(producto, 3);
});