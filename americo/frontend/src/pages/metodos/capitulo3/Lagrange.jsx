import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

export default function Lagrange() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [lagrangeBases, setLagrangeBases] = useState([]);
  const [expandedPolynomial, setExpandedPolynomial] = useState("");
  const [error, setError] = useState("");

  const handleChangeN = (e) => {
    const newN = Math.min(Math.max(parseInt(e.target.value), 2), 8);
    setN(newN);
    setPoints(Array(newN).fill({ x: "", y: "" }));
    setLagrangeBases([]);
    setExpandedPolynomial("");
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
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));
      if (xPoints.some(isNaN) || yPoints.some(isNaN)) {
        setError("Todos los valores deben ser numéricos");
        return;
      }
      const response = await axios.post("http://127.0.0.1:8000/api/lagrange", {
        xPoints,
        yPoints,
      });

      setLagrangeBases(response.data.lagrange_bases || []);
      setExpandedPolynomial(response.data.expanded_poly || "");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al conectar con el servidor."
      );
      setLagrangeBases([]);
      setExpandedPolynomial("");
    }
  };

  return (
    <div className="biseccion-page">
      <h1 className="titulo-principal">Método de Interpolación de Lagrange</h1>

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
                required
              />
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
        </div>

        {(lagrangeBases.length > 0 || expandedPolynomial) && (
          <div className="resultado-container">
            {lagrangeBases.length > 0 && (
              <>
                <h3>Polinomios de interpolación de Lagrange</h3>
                <div className="tabla-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>i</th>
                        <th>Li(x)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lagrangeBases.map((li, i) => (
                        <tr key={i}>
                          <td
                            style={{ textAlign: "center", fontWeight: "700" }}
                          >
                            {i}
                          </td>
                          <td
                            style={{
                              fontFamily: "Consolas, monospace",
                              textAlign: "center",
                            }}
                          >
                            {li}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {expandedPolynomial && (
              <>
                <h3>Polinomio de Lagrange Expandido</h3>
                <pre
                  style={{
                    fontFamily: "Consolas, monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginTop: "1rem",
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                >
                  {expandedPolynomial}
                </pre>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
