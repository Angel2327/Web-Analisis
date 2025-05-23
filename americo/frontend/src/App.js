import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MetodosPage from './pages/MetodosPage';
import Biseccion from './pages/metodos/capitulo1/Biseccion';
import ReglaFalsa from './pages/metodos/capitulo1/ReglaFalsa';
import PuntoFijo from './pages/metodos/capitulo1/PuntoFijo';
import Newton from './pages/metodos/capitulo1/Newton';
import Secante from './pages/metodos/capitulo1/Secante';
import RaicesMultiples from './pages/metodos/capitulo1/RaicesMultiples';
import Jacobi from "./pages/metodos/capitulo2/Jacobi";
import GaussSeidel from "./pages/metodos/capitulo2/GaussSeidel";
import SOR from "./pages/metodos/capitulo2/sor";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/metodos" element={<MetodosPage />} />
        <Route path="/about" element={<div>Acerca de</div>} />
        <Route path="/help" element={<div>Ayuda</div>} />
        <Route path="/metodo/biseccion" element={<Biseccion />} />
        <Route path="/metodo/regla-falsa" element={<ReglaFalsa />} />
        <Route path="/metodo/punto-fijo" element={<PuntoFijo />} />
        <Route path="/metodo/newton" element={<Newton />} />
        <Route path="/metodo/secante" element={<Secante />} />
        <Route path="/metodo/raices-multiples" element={<RaicesMultiples />} />
        <Route path="/metodo/jacobi" element={<Jacobi />} />
        <Route path="/metodo/gauss-seidel" element={<GaussSeidel />} />
        <Route path="/metodo/sor" element={<SOR />} />
      </Routes>
    </Router>
  );
}

export default App;
