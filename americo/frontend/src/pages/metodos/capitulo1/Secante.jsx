import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "../assets/EstiloMetodos.css";

function Secante() {
  const [params, setParams] = useState({
    funcion: "",
    x0: "",
    x1: "",
    tolerancia: "",
    max_iter: "",
  });

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [plotData, setPlotData] = useState(null);

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);
    setPlotData(null);

    // Validación básica
    if (!params.funcion.trim()) {
      setError('El campo "Función" es obligatorio.');
      return;
    }
    if (!params.x0.trim()) {
      setError('El campo "x0" es obligatorio.');
      return;
    }
    if (!params.x1.trim()) {
      setError('El campo "x1" es obligatorio.');
      return;
    }
    if (!params.tolerancia.trim()) {
      setError('El campo "Tolerancia" es obligatorio.');
      return;
    }
    if (!params.max_iter.trim()) {
      setError('El campo "Máx iteraciones" es obligatorio.');
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/secante", {
        funcion: params.funcion,
        x0: params.x0,
        x1: params.x1,
        tolerancia: params.tolerancia,
        max_iter: params.max_iter,
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResultado(res.data);
        setPlotData(res.data.grafica);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error inesperado");
    }
  };

  const generarInforme = () => {
    if (!resultado?.tabla) return;
    let texto = "INFORME MÉTODO DE LA SECANTE\n\n";
    texto += `Función: ${params.funcion}\n\n`;
    texto += "Iteración | x0 | x1 | f(x0) | f(x1) | error\n";
    texto += "------------------------------------------\n";
    resultado.tabla.forEach((row, i) => {
      texto += `Iteración ${i}: x0=${row.x0}, x1=${row.x1}, f(x0)=${row.fx0}, f(x1)=${row.fx1}, error=${row.error}\n`;
    });

    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informe_secante.txt";
    a.click();
  };

  return (
    <div className="biseccion-page">
      <h1 className="titulo-principal">Método de la Secante</h1>
      <div className="top-section">
        <div className="formulario-contenedor">
          <form className="formulario" onSubmit={handleSubmit}>
            <label>Función f(x):</label>
            <input
              type="text"
              name="funcion"
              value={params.funcion}
              onChange={handleChange}
              placeholder="Ej: log(sin(x)^2 + 1)-(1/2)"
            />
            <label>Valor inicial x0:</label>
            <input
              type="number"
              name="x0"
              value={params.x0}
              onChange={handleChange}
              placeholder="Ej: 0.5"
            />
            <label>Valor inicial x1:</label>
            <input
              type="number"
              name="x1"
              value={params.x1}
              onChange={handleChange}
              placeholder="Ej: 1"
            />
            <label>Tolerancia:</label>
            <input
              type="text"
              name="tolerancia"
              value={params.tolerancia}
              onChange={handleChange}
              placeholder="Ej: 1e-7"
            />
            <label>Número de iteraciones (100 Max):</label>
            <input
              type="number"
              name="max_iter"
              value={params.max_iter}
              onChange={handleChange}
              max={100}
              placeholder="Ej: 100"
            />
            <button type="submit">Calcular</button>
          </form>
        </div>

        {resultado && (
          <div className="resultado-container">
            <h3>Tabla Solución</h3>
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Iteración</th>
                    <th>x0</th>
                    <th>x1</th>
                    <th>f(x0)</th>
                    <th>f(x1)</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.tabla.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{idx}</td>
                      <td>{Number(row.x0).toFixed(10)}</td>
                      <td>{Number(row.x1).toFixed(10)}</td>
                      <td>{Number(row.fx0).toExponential(6)}</td>
                      <td>{Number(row.fx1).toExponential(6)}</td>
                      <td>{Number(row.error).toExponential(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="informe-btn" onClick={generarInforme}>
              Generar informe
            </button>
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
}

export default Secante;
