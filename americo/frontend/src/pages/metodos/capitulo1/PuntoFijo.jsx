import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "./EstiloMetodos.css";

function PuntoFijo() {
  const [params, setParams] = useState({
    funcion: "",
    g_funcion: "",
    x0: "",
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

    const camposObligatorios = [
      { nombre: "funcion", mensaje: 'El campo "Función f(x)" es obligatorio.' },
      {
        nombre: "g_funcion",
        mensaje: 'El campo "Función g(x)" es obligatorio.',
      },
      { nombre: "x0", mensaje: 'El campo "x0" es obligatorio.' },
      {
        nombre: "tolerancia",
        mensaje: 'El campo "Tolerancia" es obligatorio.',
      },
      {
        nombre: "max_iter",
        mensaje: 'El campo "Máx iteraciones" es obligatorio.',
      },
    ];

    for (let campo of camposObligatorios) {
      if (!params[campo.nombre].trim()) {
        setError(campo.mensaje);
        return;
      }
    }

    const x0 = parseFloat(params.x0);
    const tol = parseFloat(params.tolerancia);
    const iter = parseInt(params.max_iter);

    if (isNaN(x0) || isNaN(tol) || isNaN(iter)) {
      setError("Los valores numéricos deben ser válidos.");
      return;
    }
    if (tol <= 0 || tol > 1e-1) {
      setError("La tolerancia debe estar entre 1e-12 y 1e-1.");
      return;
    }
    if (iter < 1 || iter > 100) {
      setError("Las iteraciones deben estar entre 1 y 100.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/punto-fijo",
        params
      );
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
    let texto = "INFORME MÉTODO DE PUNTO FIJO\n\n";
    texto += `f(x): ${params.funcion}\n`;
    texto += `g(x): ${params.g_funcion}\n\n`;
    texto += "Iteración | x | g(x) | f(x) | error\n";
    texto += "-------------------------------------\n";
    resultado.tabla.forEach((row, i) => {
      texto += `Iteración ${row.iteracion}: x=${row.x}, g(x)=${row["g(x)"]}, f(x)=${row["f(x)"]}, error=${row.error}\n`;
    });

    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informe_punto_fijo.txt";
    a.click();
  };

  return (
    <div className="biseccion-page">
      <h2>Método de Punto Fijo</h2>
      <form onSubmit={handleSubmit}>
        <label>Función f(x):</label>
        <input
          type="text"
          name="funcion"
          value={params.funcion}
          onChange={handleChange}
          placeholder="Ej: x**3 + 4*x**2 - 10"
        />
        <label>Función g(x):</label>
        <input
          type="text"
          name="g_funcion"
          value={params.g_funcion}
          onChange={handleChange}
          placeholder="Ej: sqrt(10 / (x + 4))"
        />
        <small>
          Usa funciones de Python: sin(x), log(x), exp(x), sqrt(x), etc.
        </small>

        <label>Valor inicial (x0):</label>
        <input
          type="number"
          name="x0"
          value={params.x0}
          onChange={handleChange}
          placeholder="Ej: 1.5"
        />
        <label>Tolerancia:</label>
        <input
          type="text"
          name="tolerancia"
          value={params.tolerancia}
          onChange={handleChange}
          placeholder="Ej: 1e-7"
        />
        <label>Máximo de iteraciones (máximo 100):</label>
        <input
          type="number"
          name="max_iter"
          value={params.max_iter}
          onChange={handleChange}
          max={100}
          placeholder="Ej: 50"
        />

        <button type="submit">Ejecutar</button>
      </form>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <div className="resultado-container">
          <h3>Resultado</h3>
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Iteración</th>
                  <th>x</th>
                  <th>g(x)</th>
                  <th>f(x)</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {resultado.tabla.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.iteracion}</td>
                    <td>{Number(row.x).toFixed(10)}</td>
                    <td>
                      {row["g(x)"] !== null
                        ? Number(row["g(x)"]).toFixed(10)
                        : "NaN"}
                    </td>
                    <td>{Number(row["f(x)"]).toFixed(10)}</td>
                    <td>{Number(row.error).toFixed(10)}</td>
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

      {plotData && (
        <div className="plot-container">
          <h3>Gráfica de f(x) y g(x)</h3>
          <Plot
            data={[
              {
                x: plotData.x,
                y: plotData.y,
                type: "scatter",
                mode: "lines",
                name: "f(x)",
                line: { color: "blue" },
              },
              {
                x: plotData.x,
                y: plotData.gx,
                type: "scatter",
                mode: "lines",
                name: "g(x)",
                line: { color: "orange" },
              },
              {
                x: plotData.x,
                y: plotData.x, // Diagonal y=x para referencia
                type: "scatter",
                mode: "lines",
                name: "y = x",
                line: { color: "green", dash: "dash" },
              },
            ]}
            layout={{
              width: 650,
              height: 450,
              title: "Gráfica Método Punto Fijo",
              xaxis: { title: "x" },
              yaxis: { title: "y" },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PuntoFijo;
