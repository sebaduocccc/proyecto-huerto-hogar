export type EntradaBlog={
    id: string;
    entry: string;
}
export type Blog = Record<string, EntradaBlog>


const defaultBlog: Blog = {
    "01": {
        id: "01",
        entry: "El mensaje número 10 de las Guías Alimentarias para Chile, elaborado por el Instituto de Nutrición y Tecnología de los Alimentos de la Universidad de Chile, destaca la necesidad de proteger el planeta, cuidar el agua, evitar el desperdicio de alimentos, separar los residuos y reciclar. "

    },
    "02": {
        id: "02",
        entry: "Se entiende por “sistema alimentario sostenible” aquel que garantiza la seguridad alimentaria y la nutrición de las personas sin poner en riesgo las bases económicas, sociales y ambientales de la seguridad alimentaria de futuras generaciones "

    },
    "03": {
        id: "03",
        entry: "Los alimentos de temporada respetan las estaciones y las condiciones climáticas propicias,proporcionando productos con mejores características organolépticas y nutricionales. Además,los alimentos adquiridos en su temporada suelen ser más económicos y sostenibles."

    },
    "04": {
        id: "04",
        entry: "La sostenibilidad es importante a lo largo de toda la cadena alimentaria (producción,transformación y distribución), tanto en productos animales como vegetales. El medioambiente suele ser más vulnerable a la producción intensiva que a los sistemas tradicionales de producción, cría o pesca y, por ello, hay que fomentar los sistemas alimentarios armónicos y sostenibles."
    },
    "05": {
        id: "05",
        entry: "La Dieta Mediterránea representa uno de los ejemplos más emblemáticos de alimentación saludable y sostenible."

    },
    "06": {
        id: "06",
        entry: "Utiliza la biodiversidad terrestre y acuática de forma sostenible para asegurar su continuidad."

    }
    
}