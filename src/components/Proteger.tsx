import { Navigate, Outlet } from "react-router-dom";
import { obtenerUsuarioActual } from "../data/usuarios";

// Reemplaza a proteger.js: si no hay sesion manda al login.
// Con soloAdmin ademas revisa que el usuario tenga rol admin.
export default function Proteger({ soloAdmin = false }: { soloAdmin?: boolean }){
    const usuario = obtenerUsuarioActual();

    if (!usuario){
        return <Navigate to="/login" replace/>;
    }

    if (soloAdmin && usuario.rol !== "admin"){
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}
