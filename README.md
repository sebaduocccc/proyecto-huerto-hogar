# Huerto Hogar

Es un sitio web escrito en React. 

El proyecto busca solucionar las necesidades de Huerto Hogar, desarrollando una tienda online, el sitio web fue inicialmente construido usando Bootstrap HTML, CSS y JavaScript en su primera versión (la cual puede ser consultada en oldApp). Para la segunda versión todo fue reescrito en React.

El sitio web actual fue construido usando:

- Node (24.13.3)

- Vite (8.3.4)

- Vitest (5.0.5)

- React (19.2.8)

- Bootstrap (5.3.8)

- TypeScript (6.0.2)

Los tests fueron escritos con TypeScript y Vitest.

## Contenido

El sitio web cuenta con páginas para usuarios y administradores:

- Home: Página de inicio.

- Nosotros: Página con información del cliente.

- Blog: Página de noticias o información generada por el cliente.

- Inicio de Sesión: Página para iniciar sesión.

- Registro: Página para registrarse en el sitio web.

- Productos: Página de productos.

- Detalles Producto : Página que contiene los detalles del producto seleccionado.

- Carrito: Página para consultar el estado del carrito de compras.

- Pago: Página para realizar el pago.

- AdminHome: Panel de control para administradores.

- Administración Productos: Panel para realizar CRUD de productos.

- Administración Usuarios: Panel para conocer los usuarios registrados y poder editarlos o eliminarlos.

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

# Cómo utilizar

## Requerimientos

- Node.js

## Cómo usar el sitio web

Clona el repositorio en tu dispositivo local con:

```git
git clone https://github.com/sebaduocccc/proyecto-huerto-hogar
```

O descárgalo en:
``` 
https://github.com/sebaduocccc/proyecto-huerto-hogar/archive/refs/heads/main.zip
```

Luego, con tu terminal dentro de la carpeta que contiene el repositorio utiliza:

```
npm dev
```

Ingresa al enlace que aparece y podrás ver el sitio web en tu dispositivo local.

## Cómo realizar las pruebas

Clona el repositorio en tu dispositivo local con:

```git
git clone https://github.com/sebaduocccc/proyecto-huerto-hogar
```

Luego, con tu terminal dentro de la carpeta que contiene el repositorio utiliza:

```
npm test
```
