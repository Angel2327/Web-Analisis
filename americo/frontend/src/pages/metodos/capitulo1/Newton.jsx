import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "./Newton.css";

const Newton = () => {
  const [funcion, setFuncion] = useState("");
  const [x0, setX0] = useState("");
  const [tolerancia, setTolerancia] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [tabla, setTabla] = useState([]);
  const [grafica, setGrafica] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setTabla([]);
    setGrafica(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/newton", {
        funcion,
        x0,
        tolerancia,
        max_iter: maxIter,
      });
      setTabla(response.data.tabla);
      setGrafica(response.data.grafica);
    } catch (err) {
      setError(err.response?.data?.error || "Error en la solicitud al servidor.");
    }
  };

  return (
    <div className="newton-container">
      <h2>Método de Newton-Raphson</h2>
      <form onSubmit={handleSubmit} className="form-newton">
        <label>
          Función f(x):
          <input
            type="text"
            value={funcion}
            onChange={(e) => setFuncion(e.target.value)}
            placeholder="Ej: x**3 - x - 2"
            required
          />
        </label>
        <label>
          Valor inicial x0:
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(e.target.value)}
            required
          />
        </label>
        <label>
          Tolerancia:
          <input
            type="number"
            step="any"
            value={tolerancia}
            onChange={(e) => setTolerancia(e.target.value)}
            required
          />
        </label>
        <label>
          Máximo número de iteraciones:
          <input
            type="number"
            value={maxIter}
            onChange={(e) => setMaxIter(e.target.value)}
            required
          />
        </label>
        <button type="submit">Calcular</button>
      </form>

      {error && <p className="error">{error}</p>}

      {tabla.length > 0 && (
        <table className="tabla-newton">
          <thead>
            <tr>
              <th>Iteración</th>
              <th>x</th>
              <th>f(x)</th>
              <th>f'(x)</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((fila, index) => (
              <tr key={index}>
                <td>{fila.iteracion}</td>
                <td>{fila.x.toFixed(6)}</td>
                <td>{fila.fx.toExponential(2)}</td>
                <td>{fila.fx_derivada.toExponential(2)}</td>
                <td>{fila.error.toExponential(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {grafica && grafica.x && (
        <Plot
          data={[
            {
              x: grafica.x,
              y: grafica.y,
              type: "scatter",
              mode: "lines",
              marker: { color: "blue" },
              name: "f(x)",
            },
          ]}
          layout={{ width: 720, height: 400, title: "Gráfica de f(x)" }}
        />
      )}
    </div>
  );
};

export default Newton;
