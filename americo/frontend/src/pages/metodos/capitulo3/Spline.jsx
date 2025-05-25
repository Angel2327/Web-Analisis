import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

export default function Spline() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [tipo, setTipo] = useState("lineal");
  const [splines, setSplines] = useState(null);
  const [error, setError] = useState("");

  const handleChangeN = (e) => {
    const newN = Math.min(Math.max(parseInt(e.target.value), 2), 8);
    setN(newN);
    setPoints(Array(newN).fill({ x: "", y: "" }));
    setSplines(null);
    setError("");
  };

  const handleChangePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const puntosNum = points.map((p) => ({
        x: parseFloat(p.x),
        y: parseFloat(p.y),
      }));

      if (puntosNum.some((p) => isNaN(p.x) || isNaN(p.y))) {
        setError("Todos los valores deben ser numéricos");
        setSplines(null);
        return;
      }

      const xValues = puntosNum.map((p) => p.x);
      const xSet = new Set(xValues);
      if (xSet.size !== xValues.length) {
        setError("Los valores de x no deben repetirse");
        setSplines(null);
        return;
      }

      const puntosOrdenados = [...puntosNum].sort((a, b) => a.x - b.x);
      const xPoints = puntosOrdenados.map((p) => p.x);
      const yPoints = puntosOrdenados.map((p) => p.y);

      const response = await axios.post("http://127.0.0.1:8000/api/spline", {
        xPoints,
        yPoints,
        tipo,
      });

      if (response.data.error) {
        setError(response.data.error);
        setSplines(null);
      } else {
        setSplines(response.data);
        setError("");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
      setSplines(null);
    }
  };

  return (
    <div className="biseccion-page">
      <h2 className="titulo-principal">Interpolación por Splines</h2>

      <div className="top-section">
        <div className="formulario-contenedor">
          <form className="formulario" onSubmit={handleSubmit}>
            <label>
              Número de puntos (2-8):
              <input
                type="number"
                value={n}
                min="2"
                max="8"
                onChange={handleChangeN}
              />
            </label>

            <label>
              Tipo de Spline:
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="lineal">Lineal</option>
                <option value="cubico">Cúbico</option>
              </select>
            </label>

            {points.map((point, idx) => (
              <label key={idx}>
                {idx === 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 200px",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>X:</div>
                    <div>Y:</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="number"
                    placeholder={`x${idx}`}
                    value={point.x}
                    onChange={(e) =>
                      handleChangePoint(idx, "x", e.target.value)
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder={`y${idx}`}
                    value={point.y}
                    onChange={(e) =>
                      handleChangePoint(idx, "y", e.target.value)
                    }
                    required
                  />
                </div>
              </label>
            ))}

            <button type="submit">Calcular</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>

        {splines && (
          <div className="resultado-container">
            <h3>{tipo === "lineal" ? "Spline Lineal" : "Spline Cúbico"}</h3>

            <h4>Tabla de Coeficientes</h4>
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th>i</th>
                    <th>Coeficiente 1</th>
                    <th>Coeficiente 2</th>
                    {tipo === "cubico" && (
                      <>
                        <th>Coeficiente 3</th>
                        <th>Coeficiente 4</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr
                      key={item.i}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{item.i}</td>
                      <td>{item.coef1}</td>
                      <td>{item.coef2}</td>
                      {tipo === "cubico" && (
                        <>
                          <td>{item.coef3}</td>
                          <td>{item.coef4}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 style={{ marginTop: "1rem" }}>Tabla de Rastreadores</h4>
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th>i</th>
                    <th>Rastreadores</th>
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr
                      key={item.i}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{item.i}</td>
                      <td>{item.formato}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
