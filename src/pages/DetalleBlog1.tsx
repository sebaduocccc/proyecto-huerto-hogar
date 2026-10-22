import React,
{
    useState
} from 'react'

function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);

    const data = [
        {id:1,name:"Para que la alimentación sea saludable, debe ser inocua, es decir, no contener contaminantes microbianos y químicos"}
    ,{id:2,name:"La alimentación saludable puede adoptar muchas formas, pero debe basarse siempre en cuatro principios fundamentales: adecuación, equilibrio, moderación y diversidad."}
    ,{id:3,name:"Las preferencias y los comportamientos alimentarios establecidos en la infancia y adolescencia suelen prolongarse hasta la edad adulta."}
    ,{id:4,name:"Las prácticas alimentarias saludables deben iniciarse en las primeras etapas de la vida. La lactancia materna favorece un crecimiento saludable y mejora el desarrollo cognitivo."}
    ,{id:5,name:"La base de toda alimentación saludable es un conjunto de alimentos mínimamente procesados y no procesados, con bajo contenido de grasas no saludables, azúcares libres y sodio."},
    {id:6,name:"La alimentación tiene una influencia determinante en la salud y el bienestar, tanto a nivel individual como de la población en su conjunto. Las dietas poco saludables son un factor de riesgo importante de enfermedades y discapacidad."},
    {id:7,name:"La alimentación saludable ayuda a protegerse frente a la malnutrición en todas sus formas, así como frente a las enfermedades no transmisibles (ENT), como la diabetes, las cardiopatías, el accidente cerebrovascular y el cáncer."},
    {id:8,name:"Los carbohidratos deben proceder principalmente de cereales integrales, verduras, frutas y legumbres. Entre los cereales integrales se incluyen el maíz, el mijo, la avena, el trigo y el arroz integral en su forma no procesada. Las legumbres comprenden, entre otras, las lentejas, los garbanzos, los frijoles y los guisantes secos."},
    {id:9,name:"Las frutas y verduras frescas son opciones adecuadas, al igual que las congeladas y las enlatadas, siempre que no contengan azúcares añadidos ni cantidades excesivas de sodio. Aunque los zumos de fruta pueden consumirse, la mayoría de las variedades —incluso las que no llevan azúcares añadidos— contienen cantidades elevadas de azúcares libres, por lo que su consumo debe limitarse."},
    {id:10,name:"Las personas mayores de 10 años deberían procurar consumir al menos 400 g de frutas y verduras al día. En el caso de los niños de entre 6 y 9 años, la cantidad recomendada es de 350 g diarios, y para los niños de entre 2 y 5 años, al menos 250 g."},
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
          <>
            <div>
    
                <button onClick={goToPrevPage}
                    disabled={currentPage === 1}>
                    Anterior
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
                    Siguiente
                </button>
            </div>
            </>
        );
    }

    return (
        <div>
          <p title="Titulo">Blog de alimentacion saludable</p>
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