import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">Americo</h1>
          <h2 className="home-subtitle">Aplicación de Métodos Numéricos</h2>
          <p className="home-description">
            Aprende, experimenta y compara métodos numéricos de forma intuitiva y visual.
          </p>
          <Link to="/metodos" className="start-button">Explorar métodos</Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;
