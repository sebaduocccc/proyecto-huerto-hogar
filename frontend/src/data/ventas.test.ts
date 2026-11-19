import api from "./api";
import { obtenerVentas, cambiarEstadoVenta, ventaDesdeApi } from "./ventas";
import type { VentaApi } from "./ventas";

// en los tests no hay backend: se simulan las llamadas de axios
vi.mock("./api", () => ({
    default: { get: vi.fn(), patch: vi.fn() },
}));

const ventaApi: VentaApi = {
    id: 7,
    fecha: "2026-11-19T10:30:00",
    usuarioId: null,
    nombre: "Vicente",
    correo: "vicentito@example.com",
    telefono: "+56912345678",
    direccion: "Manuel Montt 123",
    ciudad: "Santiago",
    codigoPostal: "8320000",
    pais: "Chile",
    total: 2400,
    estado: "CONFIRMADA",
    items: [
        { sku: "FR001", nombreProducto: "Manzanas Fuji", imagen: null, precioUnitario: 1200, cantidad: 2, subtotal: 2400 },
    ],
};

beforeEach(() => {
    vi.clearAllMocks();
});

it("convierte la venta del backend al formato del frontend", () => {
    const venta = ventaDesdeApi(ventaApi);

    expect(venta.id).toBe(7);
    expect(venta.idUsuario).toBeNull(); // compra de invitado
    expect(venta.estado).toBe("CONFIRMADA");
    expect(venta.productos).toEqual([
        { sku: "FR001", name: "Manzanas Fuji", price: 1200, image: "/not-found.svg", quantity: 2 },
    ]);
});

it("obtiene las ventas del backend", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [ventaApi] });

    const ventas = await obtenerVentas();

    expect(api.get).toHaveBeenCalledWith("/ventas");
    expect(ventas).toHaveLength(1);
    expect(ventas[0].total).toBe(2400);
});

it("cambia el estado de la venta indicada", async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: {} });

    await cambiarEstadoVenta(7, "ENVIADA");

    expect(api.patch).toHaveBeenCalledWith("/ventas/7/estado", { estado: "ENVIADA" });
});
