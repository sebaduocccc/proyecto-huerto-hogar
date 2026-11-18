import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { obtenerVentas, cambiarEstadoVenta, ESTADOS_VENTA } from "../data/ventas";
import type { Venta, EstadoVenta } from "../data/ventas";

const INTERVALO_REFRESCO = 15000; /* 15 segundos */
const COLOR_ESTADO: Record<EstadoVenta, string> = {
    pendiente: "badge text-bg-warning",
    enviado: "badge text-bg-info",
    entregado: "badge text-bg-success",
    cancelado: "badge text-bg-danger",
};

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

export default function AdminVentas() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
    const [filtro, setFiltro] = useState<EstadoVenta | "todos">("todos");

    const cargar = useCallback(async() => {
        try {
            const lista = await obtenerVentas();
            setVentas([...lista].reverse());
            setError(null);
            setUltimaActualizacion(new Date());
        } catch {
            setError("No se han podido cargar las ventas.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargar();
        const timer = setInterval(cargar, INTERVALO_REFRESCO);
        return () => clearInterval(timer);
    }, [cargar]);

    const handleEstado = async (venta: Venta, nuevoEstado: EstadoVenta) => {
        try {
            await cambiarEstadoVenta(venta.id, nuevoEstado);
            setVentas((prev) => prev.map((v) => (v.id === venta.id ? { ...v, estado: nuevoEstado } : v)));
        } catch {
            alert("No se pudo actualizar el estado del pedido.");
        }
    };

    const ventasVisibles = filtro === "todos" ? ventas : ventas.filter((v) => v.estado === filtro);

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Gestión de Ventas</h1>
                <Link to="/" className="btn btn-outline-secondary">Volver a la Tienda</Link>
            </div>

            <div className="card border-0 shadow-sm p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <h5 className="fw-bold mb-0">Pedidos de Clientes</h5>
                        <span className="badge text-bg-secondary">
                            {ventasVisibles.length === 1 ? "1 pedido" : `${ventasVisibles.length} pedidos`}
                        </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {ultimaActualizacion && (
                            <span className="small text-muted">
                                Actualizado: {ultimaActualizacion.toLocaleTimeString("es-CL")}
                            </span>
                        )}
                        <select
                            aria-label="Filtrar por estado"
                            className="form-select form-select-sm w-auto"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value as EstadoVenta | "todos")}
                        >
                            <option value="todos">Todos los estados</option>
                            {ESTADOS_VENTA.map((e) => (
                                <option key={e} value={e}>{capitalizar(e)}</option>
                            ))}
                        </select>
                        <button className="btn btn-sm btn-primary" onClick={cargar}>
                            <i className="fa-solid fa-rotate me-1"></i>
                            Actualizar
                        </button>
                    </div>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Id</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Correo</th>
                                <th>Productos</th>
                                <th className="text-end">Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted py-4">
                                        Cargando pedidos...
                                    </td>
                                </tr>
                            ) : ventasVisibles.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted py-4">
                                        No hay pedidos para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                ventasVisibles.map((v) => (
                                    <tr key={v.id}>
                                        <td><code className="small" title={v.id}>{v.id.slice(0, 8)}</code></td>
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
                                        <td className="text-nowrap">
                                            <span className={`${COLOR_ESTADO[v.estado]} me-2`}>{capitalizar(v.estado)}</span>
                                            <select
                                                aria-label={`Estado del pedido ${v.id}`}
                                                className="form-select form-select-sm d-inline-block w-auto"
                                                value={v.estado}
                                                onChange={(e) => handleEstado(v, e.target.value as EstadoVenta)}
                                            >
                                                {ESTADOS_VENTA.map((e) => (
                                                    <option key={e} value={e}>{capitalizar(e)}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}