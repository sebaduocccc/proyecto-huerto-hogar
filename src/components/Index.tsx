import Navbar from "./Navbar";
import Boton from "./Boton";
import Footer from "./Footer";

function Index(){

    const ola = "oladddd";

    return(
        <div>
            <Navbar/>
            <h1>Hola Mundo {ola}</h1>
            <Boton/>
            <Boton/>
            <Footer/>
        </div>

    );
}

export default Index;