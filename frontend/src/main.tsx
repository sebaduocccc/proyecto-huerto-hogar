import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css'
import App from './App.tsx'
import { CarritoProvider } from './context/CarritoContext.tsx'
import { crearAdminPorDefecto } from './data/usuarios.ts'

crearAdminPorDefecto();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </StrictMode>
);
