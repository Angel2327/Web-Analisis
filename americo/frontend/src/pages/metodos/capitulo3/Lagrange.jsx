import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { parse } from "mathjs";
import "../assets/EstiloMetodos.css";

export default function Lagrange() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [lagrangeBases, setLagrangeBases] = useState([]);
  const [expandedPolynomial, setExpandedPolynomial] = useState("");
  const [errors, setErrors] = useState([]);
  const [graphData, setGraphData] = useState(null);

  const handleChangeN = (e) => {
    const newN = Math.min(Math.max(parseInt(e.target.value), 2), 8);
    setN(newN);
    setPoints(Array(newN).fill({ x: "", y: "" }));
    setLagrangeBases([]);
    setExpandedPolynomial("");
    setErrors([]);
    setGraphData(null);
  };

  const handleChangePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  const validarCampos = () => {
    for (let i = 0; i < points.length; i++) {
      if (points[i].x === "") return [`El campo "x${i}" es obligatorio.`];
      if (points[i].y === "") return [`El campo "y${i}" es obligatorio.`];
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidacion = validarCampos();
    if (erroresValidacion.length > 0) {
      setErrors(erroresValidacion);
      setLagrangeBases([]);
      setExpandedPolynomial("");
      setGraphData(null);
      return;
    }

    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      if (xPoints.some(isNaN) || yPoints.some(isNaN)) {
        setErrors(["Todos los valores deben ser numéricos."]);
        return;
      }

      const xSet = new Set(xPoints);
      if (xSet.size !== xPoints.length) {
        setErrors(["Los valores de X no deben repetirse."]);
        return;
      }

      const ySet = new Set(yPoints);
      if (ySet.size !== yPoints.length) {
        setErrors(["Los valores de Y no deben repetirse."]);
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/api/lagrange", {
        xPoints,
        yPoints,
      });

      setLagrangeBases(response.data.lagrange_bases || []);
      setExpandedPolynomial(response.data.expanded_poly || "");

      try {
        const expr = parse(response.data.expanded_poly);
        const compiled = expr.compile();

        const minX = Math.min(...xPoints);
        const maxX = Math.max(...xPoints);
        const step = (maxX - minX) / 100;
        const xValues = [];
        const yValues = [];

        for (let x = minX; x <= maxX; x += step) {
          xValues.push(x);
          yValues.push(compiled.evaluate({ x }));
        }

        setGraphData({ x: xValues, y: yValues });
      } catch (err) {
        console.error("Error al evaluar el polinomio:", err);
        setGraphData(null);
      }

      setErrors([]);
    } catch (err) {
      setErrors([
        err.response?.data?.message || "Error al conectar con el servidor.",
      ]);
      setLagrangeBases([]);
      setExpandedPolynomial("");
      setGraphData(null);
    }
  };

  const descargarInformeIndividual = async () => {
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/informe-individual-cap3",
        {
          metodo: "lagrange",
          xPoints,
          yPoints,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_lagrange.xlsx");
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
      <h1 className="titulo-principal">Método de Interpolación de Lagrange</h1>
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
                        Define el número de puntos para los vectores X y Y. Debe
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
              required
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
                              duplicados.
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
                              duplicados.
                            </p>
                            <p className="tooltip-ejemplo">
                              Ejemplo: <code>[2, 4, 8]</code>
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
              <div className="error" style={{ marginTop: "1rem" }}>
                {errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

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

            {graphData && (
              <>
                <h3>Gráfica del Polinomio Interpolado de Lagrange</h3>
                <Plot
                  data={[
                    {
                      x: graphData.x,
                      y: graphData.y,
                      type: "scatter",
                      mode: "lines",
                      marker: { color: "blue" },
                      name: "Polinomio",
                    },
                    {
                      x: points.map((p) => parseFloat(p.x)),
                      y: points.map((p) => parseFloat(p.y)),
                      type: "scatter",
                      mode: "markers",
                      marker: { color: "red", size: 8 },
                      name: "Puntos",
                    },
                  ]}
                  layout={{
                    width: 800,
                    height: 600,
                    title: "Polinomio Interpolante de Lagrange",
                    xaxis: { title: "x" },
                    yaxis: { title: "P(x)" },
                    autosize: true,
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
                Descargar Informe Lagrange
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
