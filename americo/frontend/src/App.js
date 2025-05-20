import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MetodosPage from './pages/MetodosPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/metodos" element={<MetodosPage />} />
        <Route path="/about" element={<div>Acerca de</div>} />
        <Route path="/help" element={<div>Ayuda</div>} />
      </Routes>
    </Router>
  );
}

export default App;
