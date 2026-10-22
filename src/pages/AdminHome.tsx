import { Link } from "react-router-dom";
import { adminLinks } from "../data/adminLinks";
import { obtenerUsuarios } from "../data/usuarios";
import { getProductos } from "../data/catalogo";
import { obtenerVentas } from "../data/ventas";

type Dato = {
    nombre: string;
    cantidad: number;
};

// cuenta cuantas veces se repite cada valor, ej: { Frutas: 3, Verduras: 2 }
function contar(valores: string[]): Dato[] {
    const conteo: Record<string, number> = {};

    valores.forEach((v) => {
        conteo[v] = (conteo[v] ?? 0) + 1;
    });

    // ordenado de mayor a menor
    return Object.keys(conteo)
        .map((nombre) => ({ nombre: nombre, cantidad: conteo[nombre] }))
        .sort((a, b) => b.cantidad - a.cantidad);
}

// grafico de barras horizontales hecho con divs
function GraficoBarras({ titulo, datos }: { titulo: string; datos: Dato[] }) {
    const maximo = Math.max(...datos.map((d) => d.cantidad), 1);

    return (
        <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4">{titulo}</h5>

            {datos.length === 0 && <p className="text-muted">No hay datos.</p>}

            {datos.map((d) => (
                <div key={d.nombre} className="mb-3">
                    <div className="small text-secondary mb-1">{d.nombre}</div>
                    <div className="d-flex align-items-center gap-2" title={`${d.nombre}: ${d.cantidad}`}>
                        <div className="flex-grow-1">
                            <div
                                style={{
                                    width: `${(d.cantidad / maximo) * 100}%`,
                                    height: 14,
                                    backgroundColor: "var(--accent-emerald)",
                                    borderRadius: "0 4px 4px 0",
                                }}
                            ></div>
                        </div>
                        <span className="small fw-semibold" style={{ minWidth: 24 }}>{d.cantidad}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// cuadrito con un numero grande
function Tarjeta({ titulo, valor, icono }: { titulo: string; valor: number; icono: string }) {
    return (
        <div className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="small text-secondary">{titulo}</div>
                    <div className="fs-2 fw-bold">{valor.toLocaleString("es-CL")}</div>
                </div>
                <i className={`fa-solid ${icono} fa-2x text-emerald`}></i>
            </div>
        </div>
    );
}

export default function AdminHome() {
    const usuarios = obtenerUsuarios();
    const productos = getProductos();

    const totalAdmins = usuarios.filter((u) => u.rol === "admin").length;
    const stockTotal = productos.reduce((suma, p) => suma + p.stock, 0);

    const productosPorCategoria = contar(productos.map((p) => p.category));
    const usuariosPorRegion = contar(usuarios.map((u) => u.region || "Sin región"));

    // ventas, las mas nuevas primero
    const ventas = obtenerVentas().reverse();
    const ingresosTotales = ventas.reduce((suma, v) => suma + v.total, 0);
    const productosVendidos = ventas.reduce(
        (suma, v) => suma + v.productos.reduce((s, p) => s + p.quantity, 0), 0
    );

    return(
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Panel de Administración</h1>
                <Link to="/" className="btn btn-outline-secondary">Volver a la Tienda</Link>
            </div>

            <h4 className="fw-bold mb-3">Dashboard</h4>

            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <Tarjeta titulo="Usuarios registrados" valor={usuarios.length} icono="fa-users"/>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <Tarjeta titulo="Administradores" valor={totalAdmins} icono="fa-user-shield"/>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <Tarjeta titulo="Productos registrados" valor={productos.length} icono="fa-carrot"/>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <Tarjeta titulo="Stock total" valor={stockTotal} icono="fa-boxes-stacked"/>
                </div>
            </div>

            <div className="row g-3 mb-5">
                <div className="col-12 col-lg-6">
                    <GraficoBarras titulo="Productos por categoría" datos={productosPorCategoria}/>
                </div>
                <div className="col-12 col-lg-6">
                    <GraficoBarras titulo="Usuarios por región" datos={usuariosPorRegion}/>
                </div>
            </div>

            <h4 className="fw-bold mb-3">Resumen de Ventas</h4>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <Tarjeta titulo="Ventas realizadas" valor={ventas.length} icono="fa-receipt"/>
                </div>
                <div className="col-12 col-md-4">
                    <Tarjeta titulo="Ingresos totales ($)" valor={ingresosTotales} icono="fa-sack-dollar"/>
                </div>
                <div className="col-12 col-md-4">
                    <Tarjeta titulo="Productos vendidos" valor={productosVendidos} icono="fa-basket-shopping"/>
                </div>
            </div>

            <div className="card border-0 shadow-sm p-4 mb-5">
                <h5 className="fw-bold mb-3">Historial de compras</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Correo</th>
                                <th>Productos</th>
                                <th className="text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        Todavía no hay ventas registradas.
                                    </td>
                                </tr>
                            ) : (
                                ventas.map((v) => (
                                    <tr key={v.id}>
                                        <td className="text-nowrap">{new Date(v.fecha).toLocaleString("es-CL")}</td>
                                        <td className="fw-semibold">
                                            {v.nombre}
                                            {v.idUsuario === null && <span className="badge text-bg-secondary ms-2">Invitado</span>}
                                        </td>
                                        <td className="text-body-secondary">{v.correo}</td>
                                        <td className="small">
                                            {v.productos.length === 0
                                                ? "--"
                                                : v.productos.map((p) => `${p.quantity}x ${p.name}`).join(", ")}
                                        </td>
                                        <td className="text-end fw-semibold">${v.total.toLocaleString("es-CL")}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="row g-3">
                {adminLinks.filter((l) => l.to !== "/admin").map((l) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={l.to}>
                        <Link to={l.to} className="btn btn-primary btn-lg w-100 py-4">
                            <i className={`fa-solid ${l.icon} fa-2x mb-2`}></i>
                            {l.label}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
