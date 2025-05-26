import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

export default function NewtonInterpolante() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [differenceTable, setDifferenceTable] = useState(null);
  const [coeffs, setCoeffs] = useState(null);
  const [error, setError] = useState("");

  const formatTableNumber = (num, decimals = 3) =>
    Number(num).toFixed(decimals);

  const formatShort = (num) => {
    if (Number.isInteger(num)) return num.toString();
    return Number(num).toString();
  };

  const handleChangeN = (e) => {
    const newN = Math.min(Math.max(parseInt(e.target.value), 2), 8);
    setN(newN);
    setPoints(Array(newN).fill({ x: "", y: "" }));
    setDifferenceTable(null);
    setCoeffs(null);
    setError("");
  };

  const handleChangePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos vacíos en x
    for (let i = 0; i < points.length; i++) {
      if (points[i].x === "") {
        setError(`El campo "x${i}" es obligatorio.`);
        setDifferenceTable(null);
        setCoeffs(null);
        return;
      }
    }

    // Validar campos vacíos en y
    for (let i = 0; i < points.length; i++) {
      if (points[i].y === "") {
        setError(`El campo "y${i}" es obligatorio.`);
        setDifferenceTable(null);
        setCoeffs(null);
        return;
      }
    }

    // Validar que x sean números válidos
    for (let i = 0; i < points.length; i++) {
      if (isNaN(parseFloat(points[i].x))) {
        setError(`El campo "x${i}" debe ser un número válido.`);
        setDifferenceTable(null);
        setCoeffs(null);
        return;
      }
    }

    // Validar que y sean números válidos
    for (let i = 0; i < points.length; i++) {
      if (isNaN(parseFloat(points[i].y))) {
        setError(`El campo "y${i}" debe ser un número válido.`);
        setDifferenceTable(null);
        setCoeffs(null);
        return;
      }
    }

    // Validar que los valores x sean únicos
    const xValues = points.map((p) => p.x);
    const xSet = new Set(xValues);
    if (xSet.size !== xValues.length) {
      setError("Los valores de X deben ser únicos, hay duplicados.");
      setDifferenceTable(null);
      setCoeffs(null);
      return;
    }

    // Validar que los valores y sean únicos
    const yValues = points.map((p) => p.y);
    const ySet = new Set(yValues);
    if (ySet.size !== yValues.length) {
      setError("Los valores de Y deben ser únicos, hay duplicados.");
      setDifferenceTable(null);
      setCoeffs(null);
      return;
    }

    // Si pasa todas las validaciones
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/newton-interpolante",
        { xPoints, yPoints }
      );
      const data = response.data;

      setDifferenceTable(data.difference_table);
      setCoeffs(data.coeffs);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al conectar con el servidor."
      );
      setDifferenceTable(null);
      setCoeffs(null);
    }
  };

  const polinomioExtendido = (coeffs, points) => {
    if (!coeffs || coeffs.length === 0) return "";

    let resultado = `${formatShort(coeffs[0])}`;
    for (let i = 1; i < coeffs.length; i++) {
      const coef = coeffs[i];
      const signo = coef >= 0 ? " + " : " - ";
      const valor = formatShort(Math.abs(coef));
      const multiplicadores = Array.from(
        { length: i },
        (_, j) => `(x - ${formatShort(points[j].x)})`
      ).join("");
      resultado += `${signo}${valor}${multiplicadores}`;
    }

    return resultado;
  };

  return (
    <div className="metodo-principal-page">
      <h1 className="titulo-principal">Método de Interpolación de Newton</h1>
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
                              duplicados, deben ser valores unicos.
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
                              duplicados, deben ser valores unicos.
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

            {error && (
              <div className="error" style={{ marginBottom: "1rem" }}>
                {error.split("\n").map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

            <button type="submit">Calcular</button>
          </form>
        </div>

        {(differenceTable || coeffs) && (
          <div className="resultado-container">
            {differenceTable && (
              <div>
                <h3>Tabla de Diferencias Divididas</h3>
                <div className="tabla-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>n</th>
                        <th>xi</th>
                        <th>y = f[xi]</th>
                        {differenceTable[0].slice(1).map((_, idx) => (
                          <th key={idx}>{idx + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {differenceTable.map((row, i) => (
                        <tr
                          key={i}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <td>{i}</td>
                          <td>{formatTableNumber(points[i]?.x)}</td>
                          {row.map((val, j) => (
                            <td key={j}>{formatTableNumber(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {coeffs && (
              <>
                <h3>Coeficientes polinomiales de Newton</h3>
                <p style={{ fontFamily: "monospace", fontSize: "1rem" }}>
                  [{coeffs.map((c) => formatShort(c)).join(", ")}]
                </p>
              </>
            )}

            {coeffs && points && (
              <>
                <h3>Polinomio Interpolante Expandido</h3>
                <pre
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {polinomioExtendido(coeffs, points)}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
