import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

export default function Lagrange() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [lagrangeBases, setLagrangeBases] = useState([]);
  const [expandedPolynomial, setExpandedPolynomial] = useState("");
  const [errors, setErrors] = useState([]);

  const handleChangeN = (e) => {
    const newN = Math.min(Math.max(parseInt(e.target.value), 2), 8);
    setN(newN);
    setPoints(Array(newN).fill({ x: "", y: "" }));
    setLagrangeBases([]);
    setExpandedPolynomial("");
    setErrors([]);
  };

  const handleChangePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  const validarCampos = () => {
    for (let i = 0; i < points.length; i++) {
      if (points[i].x === "") {
        return [`El campo "x${i}" es obligatorio.`];
      }
    }
    for (let i = 0; i < points.length; i++) {
      if (points[i].y === "") {
        return [`El campo "y${i}" es obligatorio.`];
      }
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
      return;
    }

    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      if (xPoints.some(isNaN) || yPoints.some(isNaN)) {
        setErrors(["Todos los valores deben ser numéricos."]);
        return;
      }

      // Validación duplicados en X
      const xSet = new Set(xPoints);
      if (xSet.size !== xPoints.length) {
        setErrors(["Los valores de X no deben repetirse."]);
        return;
      }

      // Validación duplicados en Y
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
      setErrors([]);
    } catch (err) {
      setErrors([
        err.response?.data?.message || "Error al conectar con el servidor.",
      ]);
      setLagrangeBases([]);
      setExpandedPolynomial("");
    }
  };

  return (
    <div className="metodo-principal-page">
      <h1 className="titulo-principal">Método de Interpolación de Lagrange</h1>
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

            {/* Mensajes de error */}
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
          </div>
        )}
      </div>
    </div>
  );
}
