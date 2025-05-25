import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "../assets/EstiloMetodos.css";

function ReglaFalsa() {
  const [params, setParams] = useState({
    funcion: "",
    a: "",
    b: "",
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
      { nombre: "funcion", mensaje: 'El campo "Función" es obligatorio.' },
      { nombre: "a", mensaje: 'El campo "a" es obligatorio.' },
      { nombre: "b", mensaje: 'El campo "b" es obligatorio.' },
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

    const a = parseFloat(params.a);
    const b = parseFloat(params.b);
    const tol = parseFloat(params.tolerancia);
    const iter = parseInt(params.max_iter);

    if (isNaN(a) || isNaN(b) || isNaN(tol) || isNaN(iter)) {
      setError("Los valores numéricos deben ser válidos.");
      return;
    }
    if (a >= b) {
      setError('El valor de "a" debe ser menor que "b".');
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
        "http://localhost:8000/api/regla-falsa",
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
    let texto = "INFORME MÉTODO DE REGLA FALSA\n\n";
    texto += `Función: ${params.funcion}\n\n`;
    texto += "Iteración | a | b | xr | f(xr) | error\n";
    texto += "---------------------------------------\n";
    resultado.tabla.forEach((row, i) => {
      texto += `Iteración ${i}: a=${row.a}, b=${row.b}, xr=${row.c}, f(xr)=${row["f(c)"]}, error=${row.error}\n`;
    });

    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informe_regla_falsa.txt";
    a.click();
  };

  return (
    <div className="biseccion-page">
      <h1 className="titulo-principal">Método de Regla Falsa</h1>

      <div className="top-section">
        <div className="formulario-contenedor">
          <form className="formulario" onSubmit={handleSubmit}>
            <label>Función:</label>
            <input
              type="text"
              name="funcion"
              value={params.funcion}
              onChange={handleChange}
              placeholder="Ej: log(sin(x)^2 + 1)-(1/2)"
              required
            />

            <label>Valor del intervalo inferior (a):</label>
            <input
              type="number"
              name="a"
              value={params.a}
              onChange={handleChange}
              placeholder="Ej: 0"
              required
            />

            <label>Valor del intervalo superior (b):</label>
            <input
              type="number"
              name="b"
              value={params.b}
              onChange={handleChange}
              placeholder="Ej: 1"
              required
            />

            <label>Tolerancia:</label>
            <input
              type="text"
              name="tolerancia"
              value={params.tolerancia}
              onChange={handleChange}
              placeholder="Ej: 1e-7"
              required
            />

            <label>Número de iteraciones (100 Max):</label>
            <input
              type="number"
              name="max_iter"
              value={params.max_iter}
              onChange={handleChange}
              max={100}
              placeholder="Ej: 100"
              required
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
                    <th>a</th>
                    <th>b</th>
                    <th>xr</th>
                    <th>f(xr)</th>
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
                      <td>{Number(row.a).toFixed(10)}</td>
                      <td>{Number(row.b).toFixed(10)}</td>
                      <td>{Number(row.c).toFixed(10)}</td>
                      <td>{Number(row["f(c)"]).toFixed(10)}</td>
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

export default ReglaFalsa;
