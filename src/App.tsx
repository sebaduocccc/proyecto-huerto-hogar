import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import Nosotros from "./pages/Nosotros";
import Productos from "./pages/Productos";
import ProductosDetalles from "./pages/ProductosDetalles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pago from "./pages/Pago";
import PagoCorrecto from "./pages/PagoCorrecto";
import PagoIncorrecto from "./pages/PagoIncorrecto";
import DetalleBlog1 from "./pages/DetalleBlog1";
import DetalleBlog2 from "./pages/DetalleBlog2";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/carrito" element={<Carrito/>}/>
          <Route path="/contacto" element={<Contacto/>}/>
          <Route path="/nosotros" element={<Nosotros/>}/>
          <Route path="/productos" element={<Productos/>}/>
          <Route path="/productosdetalles" element={<ProductosDetalles/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/carrito/pago" element={<Pago/>}/>
          <Route path="/carrito/pago/pagocorrecto" element={<PagoCorrecto/>}/>
          <Route path="/carrito/pago/pagoincorrecto" element={<PagoIncorrecto/>}/>
          <Route path="/blog/alimentacion-saludable" element={<DetalleBlog1/>}/>
          <Route path="/blog/sostenibilidad" element={<DetalleBlog2/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}