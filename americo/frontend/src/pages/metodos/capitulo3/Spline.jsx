import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "../assets/EstiloMetodos.css";

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

    const puntosNum = points.map((p) => ({
      x: parseFloat(p.x),
      y: parseFloat(p.y),
    }));

    for (let i = 0; i < puntosNum.length; i++) {
      if (isNaN(puntosNum[i].x) || isNaN(puntosNum[i].y)) {
        setError("Todos los valores deben ser numéricos.");
        setSplines(null);
        return;
      }
    }

    const xValues = puntosNum.map((p) => p.x);
    const xSet = new Set(xValues);
    if (xSet.size !== xValues.length) {
      setError("Los valores de X no deben repetirse.");
      setSplines(null);
      return;
    }

    const yValues = puntosNum.map((p) => p.y);
    const ySet = new Set(yValues);
    if (ySet.size !== yValues.length) {
      setError("Los valores de Y no deben repetirse.");
      setSplines(null);
      return;
    }

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
        setSplines({ ...response.data, puntosOrdenados });
        setError("");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
      setSplines(null);
    }
  };

  // Generar datos para graficar spline
  const getPlotData = () => {
    if (!splines) return [];

    const xPoints = splines.puntosOrdenados.map((p) => p.x);
    const yPoints = splines.puntosOrdenados.map((p) => p.y);

    // Puntos originales
    const tracePoints = {
      x: xPoints,
      y: yPoints,
      mode: "markers",
      type: "scatter",
      name: "Puntos originales",
      marker: { color: "red", size: 8 },
    };

    // Para el spline, el backend debería devolver puntos para la curva
    // Supongamos que splines.curvaX y splines.curvaY son arrays de puntos para la curva
    const traceSpline =
      splines.curvaX && splines.curvaY
        ? {
            x: splines.curvaX,
            y: splines.curvaY,
            mode: "lines",
            type: "scatter",
            name: tipo === "lineal" ? "Spline Lineal" : "Spline Cúbico",
            line: { color: "blue" },
          }
        : null;

    return traceSpline ? [tracePoints, traceSpline] : [tracePoints];
  };

  const descargarInformeIndividual = async () => {
    try {
      const xPoints = points.map((p) => parseFloat(p.x));
      const yPoints = points.map((p) => parseFloat(p.y));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/informe-individual-cap3",
        {
          metodo: "spline",
          xPoints,
          yPoints,
          tipo_spline: tipo,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_Spline.xlsx");
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

            {error && <p className="error">{error}</p>}

            <button type="submit">Calcular</button>
          </form>
        </div>

        {splines && (
          <div className="resultado-container">
            <h2>{tipo === "lineal" ? "Spline Lineal" : "Spline Cúbico"}</h2>

            <h3>Tabla de Coeficientes</h3>
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
                    <tr key={item.i} style={{ textAlign: "center" }}>
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

            <h3 style={{ marginTop: "1rem" }}>Tabla de Rastreadores</h3>
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
                    <tr key={item.i} style={{ textAlign: "center" }}>
                      <td>{item.i}</td>
                      <td>{item.formato}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>Gráfica del Polinomio Interpolado de Spline</h3>
            <Plot
              data={getPlotData()}
              layout={{
                width: 800,
                height: 600,
                title: "Gráfica de Interpolación Spline",
                xaxis: { title: "X" },
                yaxis: { title: "Y" },
              }}
            />
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
                Descargar Informe Spline
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
