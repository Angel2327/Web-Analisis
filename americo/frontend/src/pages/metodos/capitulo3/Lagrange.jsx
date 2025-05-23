import React, { useState } from "react";
import axios from "axios";

export default function Lagrange() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [lagrangeBases, setLagrangeBases] = useState([]); // Para Li(x)
  const [expandedPolynomial, setExpandedPolynomial] = useState(""); // Polinomio completo tipo sumatoria
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
    <div
      className="method-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}
    >
      <h2 style={{ textAlign: "center" }}>
        Método de Interpolación de Lagrange
      </h2>

      <label
        style={{ display: "block", textAlign: "center", marginBottom: "1rem" }}
      >
        Número de puntos (2-8):{" "}
        <input
          type="number"
          value={n}
          min="2"
          max="8"
          onChange={handleChangeN}
        />
      </label>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {points.map((point, idx) => (
          <div
            key={idx}
            className="point-row"
            style={{ marginBottom: "0.5rem" }}
          >
            <input
              type="number"
              placeholder={`x${idx}`}
              value={point.x}
              onChange={(e) => handleChangePoint(idx, "x", e.target.value)}
              required
              style={{ marginRight: "0.5rem" }}
            />
            <input
              type="number"
              placeholder={`y${idx}`}
              value={point.y}
              onChange={(e) => handleChangePoint(idx, "y", e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit" style={{ marginTop: "1rem" }}>
          Calcular
        </button>
      </form>

      {error && (
        <p className="error" style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      {/* Tabla de polinomios base Li(x) */}
      {lagrangeBases.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{ textAlign: "center", fontSize: "1.2rem" }}>
            Polinomios de interpolación de Lagrange
          </h3>
          <table
            border="1"
            cellPadding="5"
            style={{
              borderCollapse: "collapse",
              margin: "0 auto",
              fontFamily: "monospace",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            <thead>
              <tr>
                <th style={{ fontSize: "1rem" }}>i</th>
                <th style={{ fontSize: "1rem" }}>Li(x)</th>
              </tr>
            </thead>
            <tbody>
              {lagrangeBases.map((li, i) => (
                <tr key={i}>
                  <td
                    style={{
                      textAlign: "center",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      padding: "8px",
                    }}
                  >
                    {i}
                  </td>
                  <td style={{ fontSize: "1.2rem", padding: "8px" }}>{li}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {expandedPolynomial && (
        <>
          <h3
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              marginTop: "2rem",
              fontWeight: "bold",
            }}
          >
            Polinomio de Lagrange Expandido
          </h3>
          <pre
            style={{
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "1.2rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            {expandedPolynomial}
          </pre>
        </>
      )}
    </div>
  );
}
