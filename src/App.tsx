import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./components/Index";
import Adios from "./components/Adios";

function App(){

  return(

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/adios" element={<Adios/>}/>
      </Routes>
    </BrowserRouter>

  );
}

export default App;