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
  const [errors, setErrors] = useState([]); // Cambié a array para múltiples mensajes

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
    setErrors([]);
  };

  const handleChangePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorMsg = "";

    // Validar n
    if (!n || n < 2 || n > 8) {
      errorMsg = "El número de puntos debe ser un valor entre 2 y 8.";
    }
    // Validar puntos x e y secuencialmente
    else {
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (point.x === "" || point.x === null || point.x === undefined) {
          errorMsg = `El campo "x${i}" es obligatorio.`;
          break;
        } else if (isNaN(parseFloat(point.x))) {
          errorMsg = `El campo "x${i}" debe ser un número válido.`;
          break;
        }
        if (point.y === "" || point.y === null || point.y === undefined) {
          errorMsg = `El campo "y${i}" es obligatorio.`;
          break;
        } else if (isNaN(parseFloat(point.y))) {
          errorMsg = `El campo "y${i}" debe ser un número válido.`;
          break;
        }
      }

      if (!errorMsg) {
        const xValues = points.map((p) => parseFloat(p.x));
        const xSet = new Set(xValues);
        const yValues = points.map((p) => parseFloat(p.y));
        const ySet = new Set(yValues);
        // Validación duplicados en X
        if (xSet.size !== xValues.length) {
          setErrors(["Los valores de X no deben repetirse."]);
          return;
        }
        // Validación duplicados en Y
        if (ySet.size !== yValues.length) {
          setErrors(["Los valores de Y no deben repetirse."]);
          return;
        }
      }
    }

    if (errorMsg) {
      setErrors([errorMsg]);
      return;
    }

    // Si pasó todas las validaciones, procedemos con la petición
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));
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
      setErrors([]);
    } catch (err) {
      setErrors([
        err.response?.data?.message || "Error al conectar con el servidor.",
      ]);
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
    <div className="metodo-principal-page">
      <h1 className="titulo-principal">
        Método de Interpolación de Vandermonde
      </h1>
      <div className="top-section">
        <div className="formulario-contenedor-cap3">
          <form className="formulario" onSubmit={handleSubmit}>
            {/* Número de puntos */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Define el numero de puntos para los vectores X y Y. Debe
                        ser un valor entre 2 y 8.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>3</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Número de puntos:</span>
              </div>
            </label>
            <input
              type="number"
              value={n}
              min="2"
              max="8"
              onChange={handleChangeN}
            />

            {points.map((point, idx) => (
              <label key={idx}>
                {idx === 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 200px",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <div className="tooltip-container">
                        <div className="tooltip-icon">
                          ?
                          <div className="tooltip-text">
                            <p className="tooltip-explicacion">
                              Vector de puntos X. No debe tener puntos
                              duplicados, deben ser valores únicos.
                            </p>
                            <p className="tooltip-ejemplo">
                              Ejemplo: <code>[1, 2, 3]</code>
                            </p>
                          </div>
                        </div>
                      </div>
                      <span>X:</span>
                    </div>
                    <div>
                      <div className="tooltip-container">
                        <div className="tooltip-icon">
                          ?
                          <div className="tooltip-text">
                            <p className="tooltip-explicacion">
                              Vector de puntos Y. No debe tener puntos
                              duplicados, deben ser valores únicos.
                            </p>
                            <p className="tooltip-ejemplo">
                              Ejemplo: <code>[1, 2, 3]</code>
                            </p>
                          </div>
                        </div>
                      </div>
                      <span>Y:</span>
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="number"
                    placeholder={`x${idx}`}
                    value={point.x}
                    onChange={(e) =>
                      handleChangePoint(idx, "x", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    placeholder={`y${idx}`}
                    value={point.y}
                    onChange={(e) =>
                      handleChangePoint(idx, "y", e.target.value)
                    }
                  />
                </div>
              </label>
            ))}

            {/* Aquí mostramos los errores arriba del botón */}
            {errors.length > 0 && (
              <div className="error" style={{ marginBottom: "1rem" }}>
                {errors.map((errMsg, i) => (
                  <p key={i}>{errMsg}</p>
                ))}
              </div>
            )}

            <button type="submit">Calcular</button>
          </form>
        </div>

        {/* Resultado */}
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
