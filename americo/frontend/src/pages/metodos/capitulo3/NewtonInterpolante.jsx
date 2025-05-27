import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "../assets/EstiloMetodos.css";

export default function NewtonInterpolante() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [differenceTable, setDifferenceTable] = useState(null);
  const [coeficientes, setCoeficientes] = useState(null);
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
    setCoeficientes(null);
    setError("");
  };

  const handleChangePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < points.length; i++) {
      if (points[i].x === "") {
        setError(`El campo "x${i}" es obligatorio.`);
        setDifferenceTable(null);
        setCoeficientes(null);
        return;
      }
    }

    for (let i = 0; i < points.length; i++) {
      if (points[i].y === "") {
        setError(`El campo "y${i}" es obligatorio.`);
        setDifferenceTable(null);
        setCoeficientes(null);
        return;
      }
    }

    for (let i = 0; i < points.length; i++) {
      if (isNaN(parseFloat(points[i].x))) {
        setError(`El campo "x${i}" debe ser un número válido.`);
        setDifferenceTable(null);
        setCoeficientes(null);
        return;
      }
    }

    for (let i = 0; i < points.length; i++) {
      if (isNaN(parseFloat(points[i].y))) {
        setError(`El campo "y${i}" debe ser un número válido.`);
        setDifferenceTable(null);
        setCoeficientes(null);
        return;
      }
    }

    const xValues = points.map((p) => p.x);
    const xSet = new Set(xValues);
    if (xSet.size !== xValues.length) {
      setError("Los valores de X deben ser únicos, hay duplicados.");
      setDifferenceTable(null);
      setCoeficientes(null);
      return;
    }

    const yValues = points.map((p) => p.y);
    const ySet = new Set(yValues);
    if (ySet.size !== yValues.length) {
      setError("Los valores de Y deben ser únicos, hay duplicados.");
      setDifferenceTable(null);
      setCoeficientes(null);
      return;
    }

    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/newton-interpolante",
        { xPoints, yPoints }
      );
      const data = response.data;

      setDifferenceTable(data.difference_table);
      setCoeficientes(data.coeficientes);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al conectar con el servidor."
      );
      setDifferenceTable(null);
      setCoeficientes(null);
    }
  };

  const polinomioExtendido = (coeficientes, points) => {
    if (!coeficientes || coeficientes.length === 0) return "";

    let resultado = `${formatShort(coeficientes[0])}`;
    for (let i = 1; i < coeficientes.length; i++) {
      const coef = coeficientes[i];
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

  // Función para evaluar el polinomio de Newton en un valor x
  const evaluarPolinomio = (x, coeficientes, points) => {
    if (!coeficientes || coeficientes.length === 0) return 0;

    let resultado = coeficientes[0];
    for (let i = 1; i < coeficientes.length; i++) {
      let term = coeficientes[i];
      for (let j = 0; j < i; j++) {
        term *= x - points[j].x;
      }
      resultado += term;
    }
    return resultado;
  };

  // Preparar datos para gráfica
  let plotData = null;
  if (coeficientes && points && points.length > 0) {
    const xMin = Math.min(...points.map((p) => parseFloat(p.x)));
    const xMax = Math.max(...points.map((p) => parseFloat(p.x)));
    const xValuesPlot = [];
    const numPointsPlot = 200;
    const step = (xMax - xMin) / (numPointsPlot - 1);
    for (let i = 0; i < numPointsPlot; i++) {
      xValuesPlot.push(xMin + i * step);
    }
    const yValuesPlot = xValuesPlot.map((x) =>
      evaluarPolinomio(x, coeficientes, points)
    );

    plotData = (
      <>
        {" "}
        <h3>Gráfica del Polinomio Interpolado de Newton</h3>
        <Plot
          data={[
            {
              x: points.map((p) => parseFloat(p.x)),
              y: points.map((p) => parseFloat(p.y)),
              mode: "markers",
              type: "scatter",
              name: "Puntos dados",
              marker: { color: "red", size: 8 },
            },
            {
              x: xValuesPlot,
              y: yValuesPlot,
              mode: "lines",
              type: "scatter",
              name: "Polinomio Interpolante",
              line: { color: "blue" },
            },
          ]}
          layout={{
            width: 800,
            height: 600,
            title: "Gráfica del Polinomio Interpolante de Newton",
            xaxis: { title: "x" },
            yaxis: { title: "y" },
            margin: { t: 40, b: 40, l: 40, r: 40 },
          }}
        />
      </>
    );
  }

  const descargarInformeIndividual = async () => {
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/informe-individual",
        {
          metodo: "newton",
          xPoints,
          yPoints,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_NewtonInterpolante.xlsx");
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
        "http://127.0.0.1:8000/api/informe-general",
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
      <h1 className="titulo-principal">Método de Interpolación de Newton</h1>
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

        {(differenceTable || coeficientes) && (
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

            {coeficientes && (
              <>
                <h3>Coeficientes polinomiales de Newton</h3>
                <p style={{ fontFamily: "monospace", fontSize: "1rem" }}>
                  [{coeficientes.map((c) => formatShort(c)).join(", ")}]
                </p>
              </>
            )}

            {coeficientes && points && (
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
                  {polinomioExtendido(coeficientes, points)}
                </pre>

                {plotData}
              </>
            )}
            <div className="botones-informe" style={{ marginTop: "2rem" }}>
              <button
                type="button"
                onClick={descargarInformeIndividual}
                disabled={
                  error.length > 0 ||
                  points.some((p) => p.x === "" || p.y === "")
                }
                style={{ marginLeft: "10px" }}
              >
                Descargar Informe Newton Interpolante
              </button>

              <button
                type="button"
                onClick={descargarInformeGeneral}
                disabled={
                  error.length > 0 ||
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
