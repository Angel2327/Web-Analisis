import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        AMerico
      </Link>
      <div className="navbar-links">
        <Link to="/metodos" className="navbar-button">
          Métodos
        </Link>
        <Link to="/grafica-funcion" className="navbar-button">
          Graficar
        </Link>
        <Link to="/about" className="navbar-button">
          Sobre AMerico
        </Link>
        <Link to="/help" className="navbar-button">
          Ayuda
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
