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
import AdminProductos from "./pages/AdminProductos";
import AdminHome from "./pages/AdminHome";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminLayout from "./components/AdminLayout";
import Perfil from "./pages/Perfil";
import Proteger from "./components/Proteger";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>

        {/* User view */}
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/carrito" element={<Carrito/>}/>
          <Route path="/contacto" element={<Contacto/>}/>
          <Route path="/nosotros" element={<Nosotros/>}/>
          <Route path="/productos" element={<Productos/>}/>
          <Route path="/productos/:sku" element={<ProductosDetalles/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route element={<Proteger/>}>
            <Route path="/perfil" element={<Perfil/>}/>
          </Route>
          <Route path="/carrito/pago" element={<Pago/>}/>
          <Route path="/carrito/pago/pagocorrecto" element={<PagoCorrecto/>}/>
          <Route path="/carrito/pago/pagoincorrecto" element={<PagoIncorrecto/>}/>
          <Route path="/blog/alimentacion-saludable" element={<DetalleBlog1/>}/>
          <Route path="/blog/sostenibilidad" element={<DetalleBlog2/>}/>
        </Route>

        {/* Admin view */}
        <Route element={<Proteger soloAdmin/>}>
          <Route element={<AdminLayout/>}>
            <Route path="/admin" element={<AdminHome/>}/>
            <Route path="/admin/productos" element={<AdminProductos/>}/>
            <Route path="/admin/usuarios" element={<AdminUsuarios/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}