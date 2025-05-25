import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

const Jacobi = () => {
  const [n, setN] = useState(3);
  const [matrix, setMatrix] = useState(
    Array(3)
      .fill()
      .map(() => Array(3).fill(""))
  );
  const [vectorB, setVectorB] = useState(Array(3).fill(""));
  const [x0, setX0] = useState(Array(3).fill(""));
  const [tolerance, setTolerance] = useState("");
  const [iterations, setIterations] = useState("");
  const [norm, setNorm] = useState("inf");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleMatrixChange = (i, j, value) => {
    const newMatrix = [...matrix];
    newMatrix[i] = [...newMatrix[i]];
    newMatrix[i][j] = value;
    setMatrix(newMatrix);
  };

  const handleVectorChange = (setter, index, value) => {
    const newVec = [...setter];
    newVec[index] = value;
    if (setter === vectorB) setVectorB(newVec);
    else setX0(newVec);
  };

  const handleNormChange = (e) => {
    setNorm(e.target.value);
  };

  const handleTamañoChange = (newN) => {
    const size = parseInt(newN);
    if (isNaN(size) || size < 2 || size > 7) return;
    setN(size);
    setMatrix(
      Array(size)
        .fill()
        .map(() => Array(size).fill(""))
    );
    setVectorB(Array(size).fill(""));
    setX0(Array(size).fill(""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    try {
      const parsedMatrix = matrix.map((row) => row.map(Number));
      const parsedVectorB = vectorB.map(Number);
      const parsedX0 = x0.map(Number);

      if (
        parsedMatrix.some((row) => row.some((val) => isNaN(val))) ||
        parsedVectorB.some((val) => isNaN(val)) ||
        parsedX0.some((val) => isNaN(val)) ||
        isNaN(parseFloat(tolerance)) ||
        isNaN(parseInt(iterations))
      ) {
        setError("Todos los campos deben contener valores numéricos válidos.");
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/api/jacobi", {
        matrix: parsedMatrix,
        vector: parsedVectorB,
        x0: parsedX0,
        tolerance,
        iterations,
        norm,
      });

      setResultado(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al conectar con el servidor."
      );
    }
  };

  return (
    <div className="biseccion-page">
      <h1 class="titulo-principal">Método de Jacobi</h1>
      <div className="top-section">
        <form onSubmit={handleSubmit} className="formulario-contenedor-cap2">
          <div className="formulario">
            <label>
              Tamaño del sistema (2 a 7):
              <input
                type="number"
                min="2"
                max="7"
                value={n}
                onChange={(e) => handleTamañoChange(e.target.value)}
              />
            </label>

            <div
              className="matrices-container"
              style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
            >
              <div>
                <h4>Matriz A:</h4>
                <table className="matrix-input">
                  <tbody>
                    {matrix.map((row, i) => (
                      <tr key={i}>
                        {row.map((val, j) => (
                          <td key={j}>
                            <input
                              type="number"
                              step="any"
                              value={val}
                              onChange={(e) =>
                                handleMatrixChange(i, j, e.target.value)
                              }
                              required
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="matrices-container"
              style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
            >
              <div>
                <h4>Vector B:</h4>
                {vectorB.map((val, i) => (
                  <input
                    key={i}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) =>
                      handleVectorChange(vectorB, i, e.target.value)
                    }
                    required
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      width: "70px",
                    }}
                  />
                ))}
              </div>

              <div>
                <h4>Vector x0:</h4>
                {x0.map((val, i) => (
                  <input
                    key={i}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => handleVectorChange(x0, i, e.target.value)}
                    required
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      width: "70px",
                    }}
                  />
                ))}
              </div>
            </div>

            <label>
              Tolerancia:
              <input
                type="number"
                step="any"
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                required
              />
            </label>

            <label>
              Máximo número de iteraciones:
              <input
                type="number"
                value={iterations}
                onChange={(e) => setIterations(e.target.value)}
                required
              />
            </label>

            <label>
              Norma:
              <select value={norm} onChange={handleNormChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="inf">Infinita</option>
              </select>
            </label>

            <button type="submit" className="informe-btn">
              Ejecutar
            </button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}

        {resultado && (
          <div className="resultado-container">
            <h3>Resultado:</h3>
            <p>
              <strong>Convergencia:</strong> {resultado.converge ? "Sí" : "No"}
            </p>
            <p>
              <strong>Radio espectral:</strong>{" "}
              {resultado.radio_espectral.toFixed(6)}
            </p>

            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Iteración</th>
                    <th>Error</th>
                    {Object.keys(resultado.tabla[0].x).map((key, i) => (
                      <th key={i}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultado.tabla.map((fila, i) => (
                    <tr
                      key={i}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <td>{fila.iteracion}</td>
                      <td>{parseFloat(fila.error).toExponential(3)}</td>
                      {Object.values(fila.x).map((val, j) => (
                        <td key={j}>{parseFloat(val).toExponential(3)}</td>
                      ))}
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
};

export default Jacobi;
