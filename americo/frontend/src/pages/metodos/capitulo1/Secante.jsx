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
  const [mensajeDerivada, setMensajeDerivada] = useState("");
  const [showDerivada, setShowDerivada] = useState(false);
  const [errorFuncion, setErrorFuncion] = useState("");

  const obtenerDerivada = async () => {
    if (!params.funcion.trim()) {
      setErrorFuncion("Por favor ingrese la función para obtener la derivada.");
      return;
    }
    setErrorFuncion("");
    try {
      const res = await axios.post("http://localhost:8000/api/derivada", {
        funcion: params.funcion,
      });
      setMensajeDerivada(res.data.derivada_mensaje);
      setShowDerivada(true);
    } catch (err) {
      setMensajeDerivada("Error al obtener la derivada.");
      setShowDerivada(true);
    }
  };

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

  const descargarInformeIndividual = async () => {
    if (!resultado) return;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/informe-individual-cap1",
        {
          metodo: "secante",
          datos: {
            funcion: params.funcion,
            x0: params.x0,
            x1: params.x1,
            tolerancia: params.tolerancia,
            max_iter: params.max_iter,
          },
          resultado: resultado,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "informe_secante.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al generar el informe:", error);
    }
  };

  return (
    <div className="metodo-principal-page">
      <h1 className="titulo-principal">Método de la Secante</h1>
      <div className="top-section">
        <div className="formulario-contenedor">
          <form className="formulario" onSubmit={handleSubmit}>
            {/* Función */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        La función debe ser continua y diferenciable. Además, la
                        función evaluada en los extremos del intervalo debe
                        tener signos opuestos.
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
            <div>
              <input
                type="text"
                name="funcion"
                value={params.funcion}
                onChange={handleChange}
                placeholder="Ej: log(sin(x)^2 + 1)-(1/2)"
                style={{ width: "85%" }}
              />
              <button
                type="button"
                onClick={obtenerDerivada}
                style={{
                  marginLeft: "10px",
                  padding: "10px",
                  backgroundColor: "#3498db",
                }}
              >
                D
              </button>
              {errorFuncion && <p className="error">{errorFuncion}</p>}
            </div>
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
            {/* x1 */}
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
                        Ejemplo: <code>1</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Valor inicial (x1):</span>
              </div>
            </label>
            <input
              type="number"
              name="x1"
              value={params.x1}
              onChange={handleChange}
              placeholder="Ej: 1"
            />
            {/* Tolerancia */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        La tolerancia define el error permitido. Debe ser un
                        número positivo entre <code>1e-12</code> y{" "}
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
                        Número entero positivo que define el máximo de
                        iteraciones permitidas. Rango válido entre{" "}
                        <code>1</code> y <code>100</code>.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>100</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Número de iteraciones:</span>
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

            <div className="botones-informe" style={{ marginTop: "2rem" }}>
              <button
                type="button"
                onClick={descargarInformeIndividual}
                style={{ marginBottom: "20px" }}
              >
                Descargar Informe Secante
              </button>
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
      {showDerivada && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowDerivada(false)}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#fdfdfd",
              padding: "30px",
              borderRadius: "16px",
              maxWidth: "500px",
              boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
              border: "1px solid #ddd",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: "#333",
              textAlign: "center",
              width: "fit-content",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDerivada(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#999",
              }}
              title="Cerrar"
            >
              ❌
            </button>

            <h3
              style={{
                marginBottom: "15px",
                fontSize: "1.5rem",
                color: "#2c3e50",
              }}
            >
              Derivada de la función
            </h3>
            <p
              style={{
                marginBottom: "20px",
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#2c3e50",
                backgroundColor: "#ecf0f1",
                padding: "12px 18px",
                borderRadius: "10px",
                border: "1px solid #dcdde1",
                wordBreak: "break-word",
              }}
            >
              {mensajeDerivada}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Secante;
