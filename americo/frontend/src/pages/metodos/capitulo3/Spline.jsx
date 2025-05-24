import React, { useState } from "react";
import axios from "axios";

export default function Spline() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [tipo, setTipo] = useState("lineal");
  const [splines, setSplines] = useState(null);
  const [error, setError] = useState("");

  const handleChangeN = (e) => {
    const newN = Math.min(Math.max(parseInt(e.target.value), 2), 8);
    setN(newN);
    setPoints(Array(newN).fill({ x: "", y: "" }));
    setSplines(null);
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
      const puntosNum = points.map((p) => ({
        x: parseFloat(p.x),
        y: parseFloat(p.y),
      }));

      if (puntosNum.some((p) => isNaN(p.x) || isNaN(p.y))) {
        setError("Todos los valores deben ser numéricos");
        setSplines(null);
        return;
      }

      const xValues = puntosNum.map((p) => p.x);
      const xSet = new Set(xValues);
      if (xSet.size !== xValues.length) {
        setError("Los valores de x no deben repetirse");
        setSplines(null);
        return;
      }

      const puntosOrdenados = [...puntosNum].sort((a, b) => a.x - b.x);
      const xPoints = puntosOrdenados.map((p) => p.x);
      const yPoints = puntosOrdenados.map((p) => p.y);

      const response = await axios.post("http://127.0.0.1:8000/api/spline", {
        xPoints,
        yPoints,
        tipo,
      });

      if (response.data.error) {
        setError(response.data.error);
        setSplines(null);
      } else {
        setSplines(response.data);
        setError("");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
      setSplines(null);
    }
  };

  return (
    <div
      className="method-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}
    >
      <h2 style={{ textAlign: "center" }}>Interpolación por Splines</h2>

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

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <label>
          Tipo de Spline:{" "}
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="lineal">Lineal</option>
            <option value="cubico">Cúbico</option>
          </select>
        </label>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {points.map((point, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
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

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {splines && (
        <>
          <h3 style={{ textAlign: "center", fontSize: "1.3rem" }}>
            {tipo === "lineal" ? "Spline Lineal" : "Spline Cúbico"}
          </h3>

          {/* Mostrar para Spline Lineal */}
          {tipo === "lineal" && (
            <>
              <h4 style={{ textAlign: "center" }}>Tabla de Coeficientes</h4>
              <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={cellStyle}>i</th>
                    <th style={cellStyle}>Coeficiente 1</th>
                    <th style={cellStyle}>Coeficiente 2</th>
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr key={item.i}>
                      <td style={cellStyle}>{item.i}</td>
                      <td style={cellStyle}>{item.coef1}</td>
                      <td style={cellStyle}>{item.coef2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 style={{ textAlign: "center", marginTop: "1rem" }}>
                Tabla de Rastreadores
              </h4>
              <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={cellStyle}>i</th>
                    <th style={cellStyle}>Rastreadores</th>
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr key={item.i}>
                      <td style={cellStyle}>{item.i}</td>
                      <td style={cellStyle}>{item.formato}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Mostrar para Spline Cúbico */}
          {tipo === "cubico" && (
            <>
              <h4 style={{ textAlign: "center" }}>Tabla de Coeficientes</h4>
              <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={cellStyle}>i</th>
                    <th style={cellStyle}>Coeficiente 1</th>
                    <th style={cellStyle}>Coeficiente 2</th>
                    <th style={cellStyle}>Coeficiente 3</th>
                    <th style={cellStyle}>Coeficiente 4</th>
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr key={item.i}>
                      <td style={cellStyle}>{item.i}</td>
                      <td style={cellStyle}>{item.coef1}</td>
                      <td style={cellStyle}>{item.coef2}</td>
                      <td style={cellStyle}>{item.coef3}</td>
                      <td style={cellStyle}>{item.coef4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 style={{ textAlign: "center", marginTop: "1rem" }}>
                Tabla de Rastreadores
              </h4>
              <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={cellStyle}>i</th>
                    <th style={cellStyle}>Rastreadores</th>
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr key={item.i}>
                      <td style={cellStyle}>{item.i}</td>
                      <td style={cellStyle}>{item.formato}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}

const cellStyle = {
  border: "1px solid black",
  padding: "0.5rem",
};
