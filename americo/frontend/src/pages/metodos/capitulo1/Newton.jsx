import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "../assets/EstiloMetodos.css";

const Newton = () => {
  const [funcion, setFuncion] = useState("");
  const [x0, setX0] = useState("");
  const [tolerancia, setTolerancia] = useState("");
  const [maxIter, setMaxIter] = useState("");
  const [tabla, setTabla] = useState([]);
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setTabla([]);
    setPlotData(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/newton", {
        funcion,
        x0,
        tolerancia,
        max_iter: maxIter,
      });
      setTabla(response.data.tabla);
      setPlotData(response.data.grafica);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error en la solicitud al servidor."
      );
    }
  };

  return (
    <div className="biseccion-page">
      <h1 className="titulo-principal">Método de Newton-Raphson</h1>
      <div className="top-section">
        <div className="formulario-contenedor">
          <form onSubmit={handleSubmit} className="formulario">
            <label>Función f(x):</label>
            <input
              type="text"
              value={funcion}
              onChange={(e) => setFuncion(e.target.value)}
              placeholder="Ej: log(sin(x)^2 + 1)-(1/2)"
              required
            />
            <label>Valor inicial x0:</label>
            <input
              type="number"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              placeholder="Ej: 0.5"
              required
            />
            <label>Tolerancia:</label>
            <input
              type="number"
              step="any"
              value={tolerancia}
              onChange={(e) => setTolerancia(e.target.value)}
              placeholder="Ej: 1e-7"
              required
            />
            <label>Número de iteraciones (100 Max):</label>
            <input
              type="number"
              value={maxIter}
              onChange={(e) => setMaxIter(e.target.value)}
              placeholder="Ej: 100"
              required
            />
            <button type="submit">Calcular</button>
          </form>
        </div>

        {tabla.length > 0 && (
          <div className="resultado-container">
            <h3>Tabla Solución</h3>
            <div className="tabla-scroll">
              <table>
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
                    <tr
                      key={index}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{fila.iteracion}</td>
                      <td>{Number(fila.x).toFixed(10)}</td>
                      <td>{Number(fila.fx).toExponential(4)}</td>
                      <td>{Number(fila.fx_derivada).toExponential(4)}</td>
                      <td>{Number(fila.error).toExponential(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {plotData && (
        <div className="plot-container">
          <div className="plot-content">
            <h3>Gráfica de la función</h3>
            <Plot
              data={[
                {
                  x: plotData.x,
                  y: plotData.y,
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "blue" },
                },
              ]}
              layout={{
                title: "f(x)",
                xaxis: { title: "x" },
                yaxis: { title: "f(x)" },
                width: 650,
                height: 450,
              }}
              style={{ width: "100%", height: "100%", maxHeight: "450px" }}
              useResizeHandler={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Newton;
