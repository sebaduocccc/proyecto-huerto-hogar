import Navbar from "./Navbar";
import Boton from "./Boton";
import Footer from "./Footer";

export default function Index(){

    const ola = "oladddd";

    return(
        <>
            <Navbar/>
            <main className="container my-5">
                <h1>Hola Mundo {ola}</h1>
                <Boton/>
                <Boton/>
            </main>
            <Footer/>
        </>
    );
}