import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "../assets/EstiloMetodos.css";

const Newton = () => {
  const [params, setParams] = useState({
    funcion: "",
    x0: "",
    tolerancia: "",
    max_iter: "",
  });

  const [tabla, setTabla] = useState([]);
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setTabla([]);
    setPlotData(null);

    const camposObligatorios = [
      { nombre: "funcion", mensaje: 'El campo "Función" es obligatorio.' },
      { nombre: "x0", mensaje: 'El campo "Valor inicial" es obligatorio.' },
      {
        nombre: "tolerancia",
        mensaje: 'El campo "Tolerancia" es obligatorio.',
      },
      {
        nombre: "max_iter",
        mensaje: 'El campo "Número de iteraciones" es obligatorio.',
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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/newton",
        params
      );
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setTabla(response.data.tabla);
        setPlotData(response.data.grafica);
      }
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
            {/* Función */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        La función debe ser continua y diferenciable para
                        aplicar este método.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>log(sin(x)^2 + 1)-(1/2)</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Función:</span>
              </div>
            </label>
            <input
              type="text"
              name="funcion"
              value={params.funcion}
              onChange={handleChange}
              placeholder="Ej: log(sin(x)^2 + 1)-(1/2)"
            />

            {/* x0 */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Valor inicial cercano a la raíz buscada.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>0.5</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Valor inicial (x0):</span>
              </div>
            </label>
            <input
              type="number"
              name="x0"
              value={params.x0}
              onChange={handleChange}
              placeholder="Ej: 0.5"
            />

            {/* Tolerancia */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Error permitido. Debe estar entre <code>1e-12</code> y{" "}
                        <code>1e-1</code>.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>1e-7</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Tolerancia:</span>
              </div>
            </label>
            <input
              type="text"
              name="tolerancia"
              value={params.tolerancia}
              onChange={handleChange}
              placeholder="Ej: 1e-7"
            />

            {/* Iteraciones */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Número máximo de iteraciones permitidas. Entre{" "}
                        <code>1</code> y <code>100</code>.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>100</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Número de iteraciones (100 Max):</span>
              </div>
            </label>
            <input
              type="number"
              name="max_iter"
              value={params.max_iter}
              onChange={handleChange}
              max={100}
              placeholder="Ej: 100"
            />

            {error && <p className="error">{error}</p>}

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
                    <tr key={index} style={{ textAlign: "center" }}>
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
