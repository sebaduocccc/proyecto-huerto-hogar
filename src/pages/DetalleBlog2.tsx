import React,
{
    useState
} from 'react'

function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const data = [
        {id:1,name:"El mensaje número 10 de las Guías Alimentarias para Chile, elaborado por el Instituto de Nutrición y Tecnología de los Alimentos de la Universidad de Chile, destaca la necesidad de proteger el planeta, cuidar el agua, evitar el desperdicio de alimentos, separar los residuos y reciclar. "}
    ,{id:2,name:"Se entiende por “sistema alimentario sostenible” aquel que garantiza la seguridad alimentaria y la nutrición de las personas sin poner en riesgo las bases económicas, sociales y ambientales de la seguridad alimentaria de futuras generaciones "}
    ,{id:3,name:"Los alimentos de temporada respetan las estaciones y las condiciones climáticas propicias,proporcionando productos con mejores características organolépticas y nutricionales. Además,los alimentos adquiridos en su temporada suelen ser más económicos y sostenibles."}
    ,{id:4,name:"La sostenibilidad es importante a lo largo de toda la cadena alimentaria (producción,transformación y distribución), tanto en productos animales como vegetales. El medioambiente suele ser más vulnerable a la producción intensiva que a los sistemas tradicionales de producción, cría o pesca y, por ello, hay que fomentar los sistemas alimentarios armónicos y sostenibles."}
    ,{id:5,name:"La Dieta Mediterránea representa uno de los ejemplos más emblemáticos de alimentación saludable y sostenible."},
    {id:6,name:"Utiliza la biodiversidad terrestre y acuática de forma sostenible para asegurar su continuidad."},
    ];

    function renderData() {
        const startIndex =
            (currentPage - 1) * itemsPerPage;
        const endIndex =
            startIndex + itemsPerPage;
        const currentItems =
            data.slice(startIndex, endIndex);

        return (
            <ul>
                {
                    currentItems.map(item => (
                        <li key={item.id}>{item.name}</li>
                    ))
                }
            </ul>
        );
    }

    function goToNextPage() {
        setCurrentPage(prevPage => prevPage + 1);
    }

    function goToPrevPage() {
        setCurrentPage(prevPage => prevPage - 1);
    }

    function goToSpecificPage(pageNumber: React.SetStateAction<number>) {
        setCurrentPage(pageNumber);
    }

    function renderPaginationControls() {
        const totalPages =
            Math.ceil(data.length / itemsPerPage);

        return (

            <div>
                <button onClick={goToPrevPage}
                    disabled={currentPage === 1}>
                    Previous
                </button>
                {
                    Array.from({ length: totalPages },
                        (_, i) => (
                            <button key={i}
                                onClick={
                                    () => goToSpecificPage(i + 1)
                                }>
                                {i + 1}
                            </button>
                        ))
                }
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        );
    }

    return (
        <div>
          <p title="Titulo">Blog de Sostenibilidad</p>
            <div className="mx-auto px-5" >
              <div className="panel panel-default">
                <div className="panel-heading">Ultimos consejos</div>
              </div>
              </div>
            {renderData()}
            {renderPaginationControls()}
        </div>
    );
}

export default App;