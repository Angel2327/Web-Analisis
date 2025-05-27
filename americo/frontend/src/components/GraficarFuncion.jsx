import { useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "../pages/metodos/assets/EstiloMetodos.css";

export default function GraficarFuncion() {
  const [funcion, setFuncion] = useState("");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
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
          x_min: parseFloat(xMin),
          x_max: parseFloat(xMax),
          puntos: 500,
        }
      );

      setResultado(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al graficar la función.");
    }
  };

  return (
    <div className="graficar-funcion-page">
      <h1 className="titulo-principal">Graficar Función</h1>

      <div className="formulario-contenedor">
        <form className="formulario" onSubmit={handleGraficar}>
          <label>
            Función f(x):
            <input
              type="text"
              value={funcion}
              onChange={(e) => setFuncion(e.target.value)}
              placeholder="Ej: sin(x) + x**2"
            />
          </label>
          <label>
            Rango X (mínimo):
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(e.target.value)}
            />
          </label>
          <label>
            Rango X (máximo):
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(e.target.value)}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn">
            Graficar
          </button>
        </form>
      </div>

      {resultado && (
        <div className="plot-container" style={{ marginTop: "20px" }}>
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
      )}
    </div>
  );
}
