import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/carrito" element={<Carrito/>}/>
          <Route path="/contacto" element={<Contacto/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}