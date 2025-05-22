import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MetodosPage from './pages/MetodosPage';
import Biseccion from './pages/metodos/Biseccion';
import ReglaFalsa from './pages/metodos/ReglaFalsa';
import PuntoFijo from './pages/metodos/PuntoFijo';
import Newton from './pages/metodos/Newton';
import Secante from './pages/metodos/Secante';
import RaicesMultiples from './pages/metodos/RaicesMultiples';

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
      </Routes>
    </Router>
  );
}

export default App;
