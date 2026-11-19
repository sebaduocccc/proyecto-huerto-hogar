import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Reemplaza a proteger.js: si no hay sesion manda al login.
// Con soloAdmin ademas revisa que el usuario tenga rol ADMIN.
export default function Proteger({ soloAdmin = false }: { soloAdmin?: boolean }){
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

    if (soloAdmin && usuario.rol !== "ADMIN"){
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}
