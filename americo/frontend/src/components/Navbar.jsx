import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">Americo</Link>
      <div className="navbar-links">
        <Link to="/metodos" className="navbar-button">Métodos</Link>
        <Link to="/about" className="navbar-button">Acerca de</Link>
        <Link to="/help" className="navbar-button">Help</Link>
      </div>
    </nav>
  );
};

export default Navbar;
