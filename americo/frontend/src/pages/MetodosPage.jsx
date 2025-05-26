import React, { useState } from "react";
import "./MetodosPage.css";

const MetodosPage = () => {
  const [open, setOpen] = useState({ c1: false, c2: false, c3: false });

  const toggle = (cap) => {
    setOpen((prev) => ({ ...prev, [cap]: !prev[cap] }));
  };

  return (
    <div className="metodos-container">
      <h2 className="metodos-title">Explora los Métodos</h2>

      {[
        {
          id: "c1",
          title: "Capítulo 1",
          links: [
            { href: "/metodo/biseccion", text: "Bisección" },
            { href: "/metodo/regla-falsa", text: "Regla Falsa" },
            { href: "/metodo/punto-fijo", text: "Punto Fijo" },
            { href: "/metodo/newton", text: "Newton" },
            { href: "/metodo/secante", text: "Secante" },
            { href: "/metodo/raices-multiples", text: "Raíces Múltiples" },
          ],
        },
        {
          id: "c2",
          title: "Capítulo 2",
          links: [
            { href: "/metodo/jacobi", text: "Jacobi" },
            { href: "/metodo/gauss-seidel", text: "Gauss-Seidel" },
            { href: "/metodo/sor", text: "SOR" },
          ],
        },
        {
          id: "c3",
          title: "Capítulo 3",
          links: [
            { href: "/metodo/vandermonde", text: "Vandermonde" },
            {
              href: "/metodo/newton-interpolante",
              text: "Newton Interpolante",
            },
            { href: "/metodo/lagrange", text: "Lagrange" },
            { href: "/metodo/spline", text: "Spline (Lineal y Cúbico)" },
          ],
        },
      ].map((capitulo) => (
        <div key={capitulo.id} className="dropdown-card">
          <button
            onClick={() => toggle(capitulo.id)}
            className={`dropdown-btn ${open[capitulo.id] ? "open" : ""}`}
          >
            {capitulo.title}
          </button>
          {open[capitulo.id] && (
            <ul className="dropdown-list">
              {capitulo.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="dropdown-link">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetodosPage;
