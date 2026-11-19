# Huerto Hogar

Tienda online de productos frescos y orgánicos, con un frontend en React y un backend en Spring Boot conectado a una base de datos MySQL.

El proyecto busca solucionar las necesidades de Huerto Hogar desarrollando una tienda online. La primera versión del sitio se construyó con Bootstrap, HTML, CSS y JavaScript (se puede consultar en `frontend/oldApp`). En la segunda versión todo se reescribió en React, guardando los datos en el `localStorage` del navegador. En esta tercera versión se agregó un **backend con API REST**, y ahora los usuarios, productos y ventas se guardan en una base de datos.

## Estructura del repositorio

```
proyecto-huerto-hogar/
├── frontend/            # React + Vite (tienda y panel de administración)
├── backend/             # Spring Boot (API REST /api/v1, seguridad JWT)
├── docker-compose.yml   # levanta base de datos, backend y frontend
└── .env.example         # variables de configuración
```

## Tecnologías

**Frontend**

- Node (24.13.3)
- React (19.2.8)
- Vite (8.3.4)
- TypeScript (6.0.2)
- React Router (7.18.4)
- axios (1.20.0)
- Bootstrap (5.3.8)
- Vitest (5.0.5) + Testing Library

**Backend**

- Java (21)
- Spring Boot (4.1.2): Web, Data JPA, Security, Validation
- JWT con jjwt (0.12.6)
- MySQL (8.4) + Flyway para las migraciones
- springdoc-openapi (Swagger UI)
- JUnit 5 + MockMvc

**Despliegue**

- Docker y Docker Compose
- nginx (sirve el frontend y reenvía `/api/` al backend)
- AWS EC2

## Contenido

El sitio web cuenta con páginas para clientes y administradores:

- Home: página de inicio.
- Nosotros: página con información del cliente.
- Blog: noticias o información generada por el cliente.
- Contacto: formulario de contacto.
- Inicio de Sesión: página para iniciar sesión.
- Registro: página para registrarse (valida RUT, teléfono +56 9 y mayoría de edad).
- Mi Perfil: página para ver y editar los datos de la cuenta.
- Productos: catálogo con buscador y filtro por categoría.
- Detalles Producto: detalles del producto seleccionado.
- Carrito: estado del carrito de compras.
- Pago: formulario de pago; la compra se registra en el backend y descuenta stock.
- AdminHome: panel de control con un resumen de usuarios, productos y ventas.
- Administración Productos: CRUD de productos.
- Administración Usuarios: CRUD de usuarios y asignación de roles.
- Administración Ventas: lista de pedidos y cambio de estado (confirmada, en preparación, enviada, entregada o cancelada).

Las páginas de administración solo pueden verse con una cuenta de rol **ADMIN**.

Todas las páginas fueron construidas con distintos assets y componentes que pueden ser consultados dentro del repositorio, un ejemplo de estos componentes es:

```typescript
type Props = {
    videoId: string;
    title: string;
};

export default function YoutubeEmbed({videoId, title}: Props) {
    return(
        <>
        <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"                
            />
        </div>
        </>
    )
}
```
El cual es usado para enlazar videos en la página de inicio (Home). Props es usado para poder reutilizar el componente en donde sea necesario, sin hardcodear el enlace o título del video. 

Además, esto abre la posibilidad para nuevas features.

*YouTube-NoCookie* es utilizado para que no se instalen cookies en los usuarios que ingresen al sitio web sin haber reproducido el video.

## API REST

Todas las rutas del backend empiezan con `/api/v1`. Algunos ejemplos:

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/api/v1/auth/registro` | Crear una cuenta |
| POST | `/api/v1/auth/login` | Iniciar sesión (devuelve el token JWT) |
| GET | `/api/v1/productos` | Ver el catálogo |
| POST | `/api/v1/ventas` | Confirmar una compra |
| GET | `/api/v1/usuarios` | Listar usuarios (solo admin) |

La lista completa de endpoints está documentada en **Swagger**:

- Local: http://localhost:8080/swagger-ui.html
- Con Docker: http://localhost/swagger-ui.html

### Autenticación

- Al iniciar sesión, el backend devuelve un **accessToken** (JWT, dura 15 minutos) que el frontend guarda en memoria y envía en el header `Authorization: Bearer <token>`.
- También deja un **refresh token** en una cookie `httpOnly` (dura 7 días). Cuando el accessToken vence o se recarga la página, el frontend llama a `/api/v1/auth/refresh` para renovar la sesión automáticamente.
- Los permisos se revisan en el backend con `@PreAuthorize`, según el rol del usuario.

### Usuario administrador por defecto

La base de datos se crea con este usuario:

- Correo: `admin@huertohogar.cl`
- Contraseña: `admin123`

**Cambia esta contraseña al desplegar en un servidor**, porque está escrita en el repositorio.

# Cómo utilizar

## Requerimientos

- Node.js (24 o superior)
- Java 21 (solo si se corre el backend sin Docker)
- Docker o Podman con Compose

## Descargar el proyecto

Clona el repositorio en tu dispositivo local con:

```git
git clone https://github.com/sebaduocccc/proyecto-huerto-hogar
```

O descárgalo en:
``` 
https://github.com/sebaduocccc/proyecto-huerto-hogar/archive/refs/heads/main.zip
```

## Opción 1: levantar todo con Docker (lo más fácil)

Dentro de la carpeta del proyecto:

```
cp .env.example .env
docker compose up -d --build
```

La primera vez tarda unos minutos porque compila el backend y el frontend. Cuando termine, abre http://localhost en el navegador.

Para detenerlo:

```
docker compose down
```

(`docker compose down -v` también borra la base de datos.)

## Opción 2: modo desarrollo

Sirve para hacer cambios y verlos al instante. Se necesitan tres terminales:

**1. Base de datos**

```
docker compose up -d db
```

**2. Backend** (queda en http://localhost:8080)

```
cd backend
./mvnw spring-boot:run
```

**3. Frontend** (queda en http://localhost:5173)

```
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 (usa `localhost` y no `127.0.0.1`, si no la sesión no se recupera al recargar).

Al iniciar el backend, Flyway crea las tablas y carga los datos iniciales: roles, el usuario admin, las categorías y los productos.

## Variables de configuración

Se definen en el archivo `.env` (copiado desde `.env.example`):

| Variable | Para qué |
|---|---|
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD` | Base de datos MySQL |
| `JWT_SECRET` | Clave para firmar los tokens. En producción generarla con `openssl rand -base64 48` |
| `JWT_COOKIE_SECURE` | `true` solo si el sitio usa HTTPS |
| `CORS_ORIGINS` | Direcciones desde donde se puede llamar a la API |
| `FRONTEND_PORT` | Puerto del sitio con Docker (por defecto 80) |

## Cómo realizar las pruebas

**Frontend** (27 pruebas con Vitest):

```
cd frontend
npm test
```

**Backend** (65 pruebas con JUnit; las de integración necesitan la base de datos levantada con `docker compose up -d db`):

```
cd backend
./mvnw test
```

### Coverage Report

Para generar el reporte de cobertura del frontend hay que instalar el paquete de cobertura de Vitest:

```
cd frontend
npm install --save-dev @vitest/coverage-v8@5.0.5
npx vitest run --coverage
```

## Despliegue en AWS EC2

1. Crear una instancia Ubuntu (mínimo `t3.small`) y abrir solo el puerto **80** en el Security Group.
2. Instalar Docker: `curl -fsSL https://get.docker.com | sudo sh`
3. Clonar el repositorio, copiar `.env.example` a `.env` y definir contraseñas, `JWT_SECRET` y `CORS_ORIGINS=http://<IP pública>`.
4. Ejecutar `docker compose up -d --build`.
5. Entrar a `http://<IP pública>` y cambiar la contraseña del admin.

Para actualizar después de nuevos cambios: `git pull && docker compose up -d --build`.

El backend (8080) y MySQL (3306) no quedan expuestos a internet: todo entra por nginx en el puerto 80.

## Integrantes

- Ignacio Ponce
- Sebastián Saavedra
- Cristóbal Spinola
