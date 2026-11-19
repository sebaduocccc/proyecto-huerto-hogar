import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { linksPermitidos } from "../data/adminLinks";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
    const [expanded, setExpanded] = useState(false);
    const { usuario } = useAuth();

    // solo las secciones que el usuario puede ver (el vendedor: Productos y Ventas)
    const links = linksPermitidos(usuario);
    
    return(
        <div className="wrapper">
            <aside id="sidebar" className={expanded ? "expand" : ""}>
                <div className="d-flex">
                    <button id="toggle-btn" type="button" onClick={() => setExpanded((e) => !e)}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="sidebar-logo">
                        <Link to={links[0]?.to ?? "/"} className="navbar-brand fw-bold">Huerto Hogar</Link>
                    </div>
                </div>

                <ul className="sidebar-nav">
                    {links.map((l) => (
                        <li key={l.to} className="sidebar-item">
                            <NavLink to={l.to} className="sidebar-link">
                                <i className={`fa-solid ${l.icon}`}></i>
                                <span>{l.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>                
            </aside>

            <div className="main-admin">
                <Outlet/>
            </div>
        </div>
    );
}