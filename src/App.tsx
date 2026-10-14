import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/Index";
import Home from "./pages/Home";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}>
          <Route path="/" element={<Home/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}