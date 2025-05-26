import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

export default function Spline() {
  const [n, setN] = useState(2);
  const [points, setPoints] = useState(Array(2).fill({ x: "", y: "" }));
  const [tipo, setTipo] = useState("lineal");
  const [splines, setSplines] = useState(null);
  const [error, setError] = useState(""); // Solo un error visible

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

    // Validación 1: Campos vacíos X (de arriba hacia abajo)
    for (let i = 0; i < points.length; i++) {
      if (
        points[i].x === "" ||
        points[i].x === null ||
        points[i].x === undefined
      ) {
        setError(`El campo X${i} es obligatorio.`);
        setSplines(null);
        return;
      }
    }

    // Validación 2: Campos vacíos Y (de arriba hacia abajo)
    for (let i = 0; i < points.length; i++) {
      if (
        points[i].y === "" ||
        points[i].y === null ||
        points[i].y === undefined
      ) {
        setError(`El campo Y${i} es obligatorio.`);
        setSplines(null);
        return;
      }
    }

    // Convertir a números
    const puntosNum = points.map((p) => ({
      x: parseFloat(p.x),
      y: parseFloat(p.y),
    }));

    // Validación 3: Todos deben ser números
    for (let i = 0; i < puntosNum.length; i++) {
      if (isNaN(puntosNum[i].x) || isNaN(puntosNum[i].y)) {
        setError("Todos los valores deben ser numéricos.");
        setSplines(null);
        return;
      }
    }

    // Validación 4: No duplicados en X
    const xValues = puntosNum.map((p) => p.x);
    const xSet = new Set(xValues);
    if (xSet.size !== xValues.length) {
      setError("Los valores de X no deben repetirse.");
      setSplines(null);
      return;
    }

    // Validación 5: No duplicados en Y
    const yValues = puntosNum.map((p) => p.y);
    const ySet = new Set(yValues);
    if (ySet.size !== yValues.length) {
      setError("Los valores de Y no deben repetirse.");
      setSplines(null);
      return;
    }

    // Si pasa todas las validaciones, limpiar error
    setError("");

    try {
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
    <div className="metodo-principal-page">
      <h1 className="titulo-principal">Interpolación de Spline</h1>
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

            {/* Tipo de Spline */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Selecciona el tipo de spline: Lineal (Conecta puntos con
                        líneas rectas). Cúbico (Usa curvas suaves para unir los
                        puntos)
                      </p>
                    </div>
                  </div>
                </div>
                <span>Tipo de Spline:</span>
              </div>
            </label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="lineal">Lineal</option>
              <option value="cubico">Cúbico</option>
            </select>

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

            {/* Mostrar solo un error a la vez */}
            {error && <p className="error">{error}</p>}

            <button type="submit">Calcular</button>
          </form>
        </div>

        {splines && (
          <div className="resultado-container">
            <h3>{tipo === "lineal" ? "Spline Lineal" : "Spline Cúbico"}</h3>

            <h4>Tabla de Coeficientes</h4>
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th>i</th>
                    <th>Coeficiente 1</th>
                    <th>Coeficiente 2</th>
                    {tipo === "cubico" && (
                      <>
                        <th>Coeficiente 3</th>
                        <th>Coeficiente 4</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr
                      key={item.i}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{item.i}</td>
                      <td>{item.coef1}</td>
                      <td>{item.coef2}</td>
                      {tipo === "cubico" && (
                        <>
                          <td>{item.coef3}</td>
                          <td>{item.coef4}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 style={{ marginTop: "1rem" }}>Tabla de Rastreadores</h4>
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th>i</th>
                    <th>Rastreadores</th>
                  </tr>
                </thead>
                <tbody>
                  {splines?.coeficientes?.map((item) => (
                    <tr
                      key={item.i}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{item.i}</td>
                      <td>{item.formato}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
