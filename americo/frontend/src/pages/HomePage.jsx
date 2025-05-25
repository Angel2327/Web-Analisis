import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">AMerico</h1>
        <h2 className="home-subtitle">Aplicación de Métodos Numéricos</h2>
        <p className="home-description">
          Aprende, experimenta y compara métodos numéricos de forma intuitiva y
          visual.
        </p>
        <Link to="/metodos" className="start-button">
          🚀 Explorar métodos
        </Link>
      </div>
      <footer className="home-footer">
        <p>© 2025 AMerico - Ingeniería de Sistemas</p>
      </footer>
    </div>
  );
};

export default HomePage;
