import { obtenerVentas, guardarVenta, cambiarEstadoVenta } from "./ventas";
import type { CheckoutDetails } from "./checkout";

beforeEach(() => {
    localStorage.clear();
});

const producto = { sku: "FR001", name: "Manzanas Fuji", price: 1200, image: "", quantity: 2 };

const datos: CheckoutDetails = {
    nombre: "Sergio Garcia", 
    direccion: "Calle Falsa 123", 
    ciudad: "Santiago", 
    codigoPostal: "8340000", 
    pais: "Chile", 
    correo: "sergio.garcia@example.com", 
    telefono: "+56912345678",
    fechaCompra: "2026-10-21T12:00:00.000Z",
    items: [producto],
    total: 2400, 
};

function seed(ventas: object[]) {
    localStorage.setItem("phuertohogar_ventas", JSON.stringify(ventas));
}

const base = {
    fecha: "2026-10-21T12:00:00.000Z", nombre: "Ana", correo: "ana@example.com",
    idUsuario: null, productos: [producto], total: 2400,
}

it("una venta nueva queda en estado pendiente", () => {
    guardarVenta(datos, datos.items, datos.total, null);

    const ventas = obtenerVentas();
    expect(ventas).toHaveLength(1);
    expect(ventas[0].estado).toBe("pendiente");
    expect(ventas[0].total).toBe(2400);
});

it("las ventas antiguas sin estado se leen como pendientes", () => {
    seed([{ ...base, id: "v_viejo" }]);
    
    const ventas = obtenerVentas();
    expect(ventas[0].estado).toBe("pendiente");
});

it("cambia el estado solo de la venta indicada", () => {
    seed([
        { ...base, id: "v_1", estado: "pendiente" },
        { ...base, id: "v_2", estado: "enviado" },
    ]);

    cambiarEstadoVenta("v_2", "enviado");

    const ventas = obtenerVentas();
    expect(ventas.find((v) => v.id === "v_1")?.estado).toBe("pendiente");
    expect(ventas.find((v) => v.id === "v_2")?.estado).toBe("enviado");
});