import React, { useState } from 'react';
import './MetodosPage.css';

const MetodosPage = () => {
  const [open, setOpen] = useState({ c1: false, c2: false, c3: false });

  const toggle = (cap) => {
    setOpen(prev => ({ ...prev, [cap]: !prev[cap] }));
  };

  return (
    <>
      <div className="metodos-container">
        <h2>Explora los Métodos</h2>

        <div className="dropdown">
          <button onClick={() => toggle('c1')} className="dropdown-btn">Capítulo 1</button>
          {open.c1 && (
            <ul className="dropdown-list">
              <li><a href="/metodo/biseccion">Bisección</a></li>
              <li><a href="/metodo/regla-falsa">Regla Falsa</a></li>
              <li><a href="/metodo/punto-fijo">Punto Fijo</a></li>
              <li><a href="/metodo/newton">Newton</a></li>
              <li><a href="/metodo/secante">Secante</a></li>
              <li><a href="/metodo/raices-multiples">Raíces múltiples</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <button onClick={() => toggle('c2')} className="dropdown-btn">Capítulo 2</button>
          {open.c2 && (
            <ul className="dropdown-list">
              <li><a href="/metodo/jacobi">Jacobi</a></li>
              <li><a href="/metodo/gauss-seidel">Gauss-Seidel</a></li>
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
