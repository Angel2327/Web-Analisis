import React, { useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import Plot from "react-plotly.js";
import "../assets/EstiloMetodos.css";

export default function Vandermonde() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [matrix, setMatrix] = useState(null);
  const [coeficientes, setCoeficientes] = useState(null);
  const [poly, setPoly] = useState("");
  const [errors, setErrors] = useState([]);

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
    setCoeficientes(null);
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

    if (!n || n < 2 || n > 8) {
      errorMsg = "El número de puntos debe ser un valor entre 2 y 8.";
    } else {
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

        if (xSet.size !== xValues.length) {
          setErrors(["Los valores de X no deben repetirse."]);
          return;
        }
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

    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));
      const response = await axios.post(
        "http://127.0.0.1:8000/api/vandermonde",
        { xPoints, yPoints }
      );
      const data = response.data;

      const reversedMatrix = data.matrix.map((row) => [...row].reverse());
      const reversedCoeficientes = [...data.coeficientes].reverse();

      const formattedPoly = reversedCoeficientes
        .map((coef, i) => {
          const power = reversedCoeficientes.length - 1 - i;
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
      setCoeficientes(reversedCoeficientes);
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

  // Función para evaluar el polinomio en un punto x
  function evaluarPolinomio(coefs, x) {
    let y = 0;
    const n = coefs.length;
    for (let i = 0; i < n; i++) {
      y += coefs[i] * Math.pow(x, n - 1 - i);
    }
    return y;
  }

  // Generar datos para graficar el polinomio
  const plotData = () => {
    if (!coeficientes || points.length === 0) return null;

    const xVals = points.map((p) => parseFloat(p.x));
    const xMin = Math.min(...xVals);
    const xMax = Math.max(...xVals);

    const step = (xMax - xMin) / 100;
    const xPlot = [];
    const yPlot = [];
    for (let x = xMin; x <= xMax; x += step) {
      xPlot.push(x);
      yPlot.push(evaluarPolinomio(coeficientes, x));
    }

    return { xPlot, yPlot };
  };

  const datosGrafica = plotData();

  const descargarInformeIndividual = async () => {
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/informe-individual-cap3",
        {
          metodo: "vandermonde",
          xPoints,
          yPoints,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_Vandermonde.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error al descargar el informe individual."
      );
    }
  };

  const descargarInformeGeneral = async () => {
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/informe-general-cap3",
        { xPoints, yPoints },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_general_capitulo3.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error al descargar el informe general."
      );
    }
  };

  return (
    <div className="metodo-principal-page">
      <h1 className="titulo-principal">
        Método de Interpolación de Vandermonde
      </h1>
      <div className="top-section">
        <div className="formulario-contenedor-cap3">
          <form className="formulario" onSubmit={handleSubmit}>
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

        {(matrix || coeficientes || poly) && (
          <div className="resultado-container-cap3">
            {matrix && (
              <>
                <h3>Matriz de Vandermonde</h3>
                <div className="tabla-scroll">
                  <BlockMath>{generateMatrixLatex()}</BlockMath>
                </div>
              </>
            )}

            {coeficientes && (
              <>
                <h3>Coeficientes Polinomiales</h3>
                <p style={{ fontFamily: "monospace", fontSize: "1.2rem" }}>
                  [{coeficientes.map((c) => formatNumber(c, 3)).join(", ")}]
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

            {poly && datosGrafica && (
              <>
                <h3>Gráfica del Polinomio Interpolado de Vandermonde</h3>
                <Plot
                  data={[
                    {
                      x: datosGrafica.xPlot,
                      y: datosGrafica.yPlot,
                      type: "scatter",
                      mode: "lines",
                      marker: { color: "blue" },
                      name: "Polinomio Interpolado",
                    },
                    {
                      x: points.map((p) => parseFloat(p.x)),
                      y: points.map((p) => parseFloat(p.y)),
                      type: "scatter",
                      mode: "markers",
                      marker: { color: "red", size: 8 },
                      name: "Puntos Dados",
                    },
                  ]}
                  layout={{
                    width: 800,
                    height: 600,
                    title: "Interpolación de Vandermonde",
                    xaxis: { title: "x" },
                    yaxis: { title: "y" },
                  }}
                />
              </>
            )}
            <div className="botones-informe" style={{ marginTop: "2rem" }}>
              <button
                type="button"
                onClick={descargarInformeIndividual}
                disabled={
                  errors.length > 0 ||
                  points.some((p) => p.x === "" || p.y === "")
                }
                style={{ marginLeft: "10px" }}
              >
                Descargar Informe Vandermonde
              </button>

              <button
                type="button"
                onClick={descargarInformeGeneral}
                disabled={
                  errors.length > 0 ||
                  points.some((p) => p.x === "" || p.y === "")
                }
                style={{ marginLeft: "10px" }}
              >
                Descargar Informe General
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
