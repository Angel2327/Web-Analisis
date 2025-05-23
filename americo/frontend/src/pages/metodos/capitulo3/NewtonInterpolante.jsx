import React, { useState } from "react";
import axios from "axios";

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
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));
      if (xPoints.some(isNaN) || yPoints.some(isNaN)) {
        setError("Todos los valores deben ser numéricos");
        return;
      }
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
    <div
      className="method-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}
    >
      <h2 style={{ textAlign: "center" }}>Método de Interpolación de Newton</h2>

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

      {differenceTable && (
        <div>
          <h3 style={{ textAlign: "center", fontSize: "1.3rem" }}>
            Tabla de Diferencias Divididas
          </h3>
          <table
            border="1"
            cellPadding="5"
            style={{
              borderCollapse: "collapse",
              margin: "0 auto",
              fontFamily: "monospace",
            }}
          >
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
                <tr key={i}>
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
      )}

      {coeffs && (
        <>
          <h3 style={{ textAlign: "center", fontSize: "1.3rem" }}>
            Coeficientes polinomiales de Newton
          </h3>
          <p
            style={{
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "1.2rem",
            }}
          >
            [{coeffs.map((c) => formatShort(c)).join(", ")}]
          </p>
        </>
      )}

      {coeffs && points && (
        <>
          <h3 style={{ textAlign: "center", fontSize: "1.3rem" }}>
            Polinomio Interpolante Expandido
          </h3>
          <pre
            style={{
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "1.2rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {polinomioExtendido(coeffs, points)}
          </pre>
        </>
      )}
    </div>
  );
}
