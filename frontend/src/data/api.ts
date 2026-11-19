import axios from "axios";

// URL del backend, se puede cambiar con VITE_API_URL en un archivo .env
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

// datos del usuario tal como los devuelve el backend (UsuarioResponse)
export type UsuarioApi = {
    id: number;
    nombre: string;
    email: string;
    rut: string | null;
    telefono: string | null;
    direccion: string | null;
    comuna: string | null;
    region: string | null;
    fechaNacimiento: string | null; // "aaaa-mm-dd"
    rol: string; // "ADMIN", "USUARIO", etc
    permisos: string[];
    activo: boolean;
    createdAt: string;
};

// mensaje para mostrar en las alertas de los formularios (verde si ok, rojo si no)
export type Resultado = {
    ok: boolean;
    msg: string;
};

// respuesta de /auth/login y /auth/refresh
export type AuthResponse = {
    accessToken: string;
    tokenType: string;
    expiraEn: number;
    usuario: UsuarioApi;
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // para que el navegador mande la cookie de refresh
});

// el token se guarda en memoria (no en localStorage), como pide el backend.
// al recargar la pagina se pierde y se recupera con refrescarSesion()
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
    accessToken = token;
}

// agrega el token a todas las peticiones
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// si se llama varias veces al mismo tiempo se reutiliza la misma peticion,
// porque el backend rota la cookie y una segunda llamada con la cookie vieja fallaria
let refrescoEnCurso: Promise<AuthResponse> | null = null;

export function refrescarSesion(): Promise<AuthResponse> {
    if (!refrescoEnCurso) {
        refrescoEnCurso = api.post<AuthResponse>("/auth/refresh")
            .then((res) => {
                setAccessToken(res.data.accessToken);
                return res.data;
            })
            .finally(() => {
                refrescoEnCurso = null;
            });
    }
    return refrescoEnCurso;
}

// si el token expiro (401) se renueva una vez y se repite la peticion
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        const esAuth = original?.url?.startsWith("/auth/");

        if (error.response?.status === 401 && original && !original._reintento && !esAuth) {
            original._reintento = true;
            try {
                await refrescarSesion();
                return api(original);
            } catch {
                setAccessToken(null);
            }
        }
        return Promise.reject(error);
    }
);

// saca un mensaje legible de un error del backend (ErrorResponse)
export function mensajeError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return "No se pudo conectar con el servidor.";
        }
        const datos = error.response.data;
        // si es error de validacion se muestra el primer campo con error
        if (datos?.campos) {
            const primero = Object.values(datos.campos)[0];
            if (primero) return String(primero);
        }
        if (datos?.mensaje) return datos.mensaje;
    }
    return "Ocurrió un error inesperado.";
}

export default api;
