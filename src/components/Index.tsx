import Navbar from "./Navbar";
import Boton from "./Boton";

function Index(){

    const ola = "oladddd";

    return(
        <div>
            <Navbar/>
            <h1>Hola Mundo {ola}</h1>
            <Boton/>
            <Boton/>
        </div>

    );
}

export default Index;