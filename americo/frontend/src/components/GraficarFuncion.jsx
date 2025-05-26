import { useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "../pages/metodos/assets/EstiloMetodos.css";

export default function GraficarFuncion() {
  const [funcion, setFuncion] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleGraficar = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (!funcion.trim()) {
      setError("Por favor ingrese la función a graficar.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/graficar-funcion",
        {
          funcion,
        }
      );
      setResultado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al graficar la función.");
    }
  };

  return (
    <div className="graficar-funcion-page">
      <h1 className="titulo-principal">Graficar Función</h1>

      <div className="formulario-contenedor">
        <form className="formulario" onSubmit={handleGraficar}>
          <label className="label-con-icono">
            <div>
              <div className="tooltip-container">
                <div className="tooltip-icon">
                  ?
                  <div className="tooltip-text">
                    <p className="tooltip-explicacion">
                      Ingrese una función matemática válida en variable{" "}
                      <code>x</code>. Ejemplo: <code>sin(x) + x**2</code>.
                    </p>
                  </div>
                </div>
              </div>
              <span>Función f(x):</span>
            </div>
          </label>

          <input
            type="text"
            name="funcion"
            value={funcion}
            onChange={(e) => setFuncion(e.target.value)}
            placeholder="Ej: sin(x) + x**2"
            style={{ width: "85%" }}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn">
            Graficar
          </button>
        </form>
      </div>

      {resultado && (
        <div className="plot-container" style={{ marginTop: "20px" }}>
          <div className="plot-content">
            <h3>Gráfica de la función</h3>
            <Plot
              data={[
                {
                  x: resultado.x,
                  y: resultado.y,
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
