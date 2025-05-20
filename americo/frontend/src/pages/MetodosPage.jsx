import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './MetodosPage.css';

const MetodosPage = () => {
  const [open, setOpen] = useState({ c1: false, c2: false, c3: false });

  const toggle = (cap) => {
    setOpen(prev => ({ ...prev, [cap]: !prev[cap] }));
  };

  return (
    <>
      <Navbar />
      <div className="metodos-container">
        <h2>Explora los Métodos</h2>

        <div className="dropdown">
          <button onClick={() => toggle('c1')} className="dropdown-btn">Capítulo 1</button>
          {open.c1 && (
            <ul className="dropdown-list">
              <li>Bisección</li>
              <li>Regla Falsa</li>
              <li>Punto Fijo</li>
              <li>Newton</li>
              <li>Secante</li>
              <li>Raíces múltiples</li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <button onClick={() => toggle('c2')} className="dropdown-btn">Capítulo 2</button>
          {open.c2 && (
            <ul className="dropdown-list">
              <li>Jacobi</li>
              <li>Gauss-Seidel</li>
              <li>SOR</li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <button onClick={() => toggle('c3')} className="dropdown-btn">Capítulo 3</button>
          {open.c3 && (
            <ul className="dropdown-list">
              <li>Vandermonde</li>
              <li>Newton Interpolante</li>
              <li>Lagrange</li>
              <li>Spline Lineal</li>
              <li>Spline Cúbico</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MetodosPage;
