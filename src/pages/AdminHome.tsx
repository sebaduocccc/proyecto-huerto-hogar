import { Link } from "react-router-dom";
import { adminLinks } from "../data/adminLinks";

export default function AdminHome() {
    return(
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Panel de Administración</h1>
                <Link to="/" className="btn btn-outline-secondary">Volver a la Tienda</Link>
            </div>

            <p className="text-secondary mb-4">Dashboard</p>

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