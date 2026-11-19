import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tienePermiso } from "../data/adminLinks";

// Reemplaza a proteger.js: si no hay sesion manda al login.
// Con permisos ademas exige tener alguno de ellos (los mismos que revisa el backend).
export default function Proteger({ permisos }: { permisos?: string[] }){
    const { usuario, cargando } = useAuth();

    // al recargar la pagina hay que esperar a que el backend diga si hay sesion,
    // si no mandaria al login a alguien que si tenia sesion
    if (cargando){
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
            </div>
        );
    }

    if (!usuario){
        return <Navigate to="/login" replace/>;
    }

    if (permisos && !tienePermiso(usuario, ...permisos)){
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}
