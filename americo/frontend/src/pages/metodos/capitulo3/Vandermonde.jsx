import React, { useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function Vandermonde() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [matrix, setMatrix] = useState(null);
  const [coeffs, setCoeffs] = useState(null);
  const [poly, setPoly] = useState("");
  const [error, setError] = useState("");

  // Función para formatear números
  // fixed = true -> mostrar decimales fijos sin eliminar ceros
  function formatNumber(num, maxDecimals = 6, fixed = false) {
    if (fixed) {
      return Number.parseFloat(num).toFixed(maxDecimals);
    }
    return Number.parseFloat(num)
      .toFixed(maxDecimals)
      .replace(/\.?0+$/, "");
  }

  const handleChangeN = (e) => {
    const newN = Math.min(Math.max(parseInt(e.target.value), 2), 8);
    setN(newN);
    setPoints(Array(newN).fill({ x: "", y: "" }));
    setMatrix(null);
    setCoeffs(null);
    setPoly("");
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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/vandermonde",
        { xPoints, yPoints }
      );
      const data = response.data;

      const reversedMatrix = data.matrix.map((row) => [...row].reverse());
      const reversedCoeffs = [...data.coeffs].reverse();

      // Formatear polinomio con signos y potencias en LaTeX
      const formattedPoly = reversedCoeffs
        .map((coef, i) => {
          const power = reversedCoeffs.length - 1 - i;
          const sign = coef < 0 ? " - " : i > 0 ? " + " : "";
          // Aquí usamos fixed=true para mostrar 3 decimales siempre
          const absCoef = formatNumber(Math.abs(coef), 3, true);
          let term;
          if (power === 0) term = `${absCoef}`;
          else if (power === 1) term = `${absCoef}x`;
          else term = `${absCoef}x^{${power}}`;
          return `${sign}${term}`;
        })
        .join("")
        .trim();

      setMatrix(reversedMatrix);
      setCoeffs(reversedCoeffs);
      setPoly(formattedPoly);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al conectar con el servidor."
      );
    }
  };

  const generateMatrixLatex = () => {
    if (!matrix) return "";
    const matrixStr = matrix
      .map((row) => row.map((v) => formatNumber(v, 4)).join(" & "))
      .join(" \\\\ ");

    const xVec = Array(n)
      .fill(0)
      .map((_, i) => `x_{${i}}`)
      .join(" \\\\ ");

    const yVec = points
      .map((p) => formatNumber(parseFloat(p.y), 4))
      .join(" \\\\ ");

    return `
      \\begin{pmatrix}
      ${matrixStr}
      \\end{pmatrix}
      \\begin{pmatrix}
      ${xVec}
      \\end{pmatrix}
      =
      \\begin{pmatrix}
      ${yVec}
      \\end{pmatrix}
    `;
  };

  return (
    <div
      className="method-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}
    >
      <h2 style={{ textAlign: "center" }}>
        Método de Interpolación de Vandermonde
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

      {matrix && (
        <>
          <h3 style={{ textAlign: "center", fontSize: "1.3rem" }}>
            Matriz de Vandermonde
          </h3>
          <div
            style={{
              textAlign: "center",
              overflowX: "auto",
              fontSize: "1.2rem",
            }}
          >
            <BlockMath>{generateMatrixLatex()}</BlockMath>
          </div>
        </>
      )}

      {coeffs && (
        <>
          <h3 style={{ textAlign: "center", fontSize: "1.3rem" }}>
            Coeficientes Polinomiales
          </h3>
          <p
            style={{
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "1.2rem",
            }}
          >
            [{coeffs.map((c) => formatNumber(c, 3)).join(", ")}]
          </p>
        </>
      )}

      {poly && (
        <>
          <h3 style={{ textAlign: "center", fontSize: "1.3rem" }}>
            Polinomio de Vandermonde
          </h3>
          <div
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              marginTop: "0.5rem",
              fontFamily: "monospace",
            }}
          >
            <BlockMath>{poly}</BlockMath>
          </div>
        </>
      )}
    </div>
  );
}
