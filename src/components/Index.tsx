import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Index(){
    return(
        <>
            <Navbar/>
            <main className="container my-5">
                <Outlet />
            </main>
            <Footer/>
        </>
    );
}