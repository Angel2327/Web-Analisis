import React, { useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import "../assets/EstiloMetodos.css";

export default function Vandermonde() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [matrix, setMatrix] = useState(null);
  const [coeffs, setCoeffs] = useState(null);
  const [poly, setPoly] = useState("");
  const [error, setError] = useState("");

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

      const formattedPoly = reversedCoeffs
        .map((coef, i) => {
          const power = reversedCoeffs.length - 1 - i;
          const sign = coef < 0 ? " - " : i > 0 ? " + " : "";
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
    <div className="biseccion-page">
      <h1 className="titulo-principal">
        Método de Interpolación de Vandermonde
      </h1>
      <div className="top-section">
        <div className="formulario-contenedor-cap3">
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

          {error && <p className="error">{error}</p>}
        </div>

        {(matrix || coeffs || poly) && (
          <div className="resultado-container-cap3">
            {matrix && (
              <>
                <h3>Matriz de Vandermonde</h3>
                <div className="tabla-scroll">
                  <BlockMath>{generateMatrixLatex()}</BlockMath>
                </div>
              </>
            )}

            {coeffs && (
              <>
                <h3>Coeficientes Polinomiales</h3>
                <p style={{ fontFamily: "monospace", fontSize: "1.2rem" }}>
                  [{coeffs.map((c) => formatNumber(c, 3)).join(", ")}]
                </p>
              </>
            )}

            {poly && (
              <>
                <h3>Polinomio de Vandermonde</h3>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1.2rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <BlockMath>{poly}</BlockMath>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
