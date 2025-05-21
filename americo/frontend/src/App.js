import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MetodosPage from './pages/MetodosPage';
import Biseccion from './pages/metodos/Biseccion';

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
      </Routes>
    </Router>
  );
}

export default App;
