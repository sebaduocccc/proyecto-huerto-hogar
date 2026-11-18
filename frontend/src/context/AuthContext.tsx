import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api, { refrescarSesion, setAccessToken } from "../data/api";
import type { AuthResponse, UsuarioApi } from "../data/api";

type AuthContextValue = {
    usuario: UsuarioApi | null;
    cargando: boolean; // true mientras se revisa si hay sesion al abrir la pagina
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUsuario: (usuario: UsuarioApi) => void; // para actualizar los datos despues de editar el perfil
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
    const [cargando, setCargando] = useState(true);

    // al abrir o recargar la pagina se intenta recuperar la sesion con la cookie
    useEffect(() => {
        refrescarSesion()
            .then((datos) => setUsuario(datos.usuario))
            .catch(() => setUsuario(null)) // no habia sesion, no es un error
            .finally(() => setCargando(false));
    }, []);

    // si falla lanza el error para que la pagina de login muestre el mensaje
    const login = async (email: string, password: string) => {
        const res = await api.post<AuthResponse>("/auth/login", { email, password });
        setAccessToken(res.data.accessToken);
        setUsuario(res.data.usuario);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            // aunque falle la peticion se cierra la sesion en el navegador
            setAccessToken(null);
            setUsuario(null);
        }
    };

    return (
        <AuthContext.Provider value={{ usuario, cargando, login, logout, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
