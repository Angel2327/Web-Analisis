import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

const GaussSeidel = () => {
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

  const handleVectorChange = (vectorSetter, index, value) => {
    const newVector = [...vectorSetter];
    newVector[index] = value;
    if (vectorSetter === vectorB) setVectorB(newVector);
    else setX0(newVector);
  };

  const handleNormChange = (e) => setNorm(e.target.value);

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

  const validarEntradas = () => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === "" || isNaN(matrix[i][j])) {
          setError(
            `El campo de la matriz A en la posición [${i + 1}][${
              j + 1
            }] es obligatorio.`
          );
          return false;
        }
      }
    }

    for (let i = 0; i < n; i++) {
      if (vectorB[i] === "" || isNaN(vectorB[i])) {
        setError(
          `El campo del vector B en la posición [${i + 1}] es obligatorio.`
        );
        return false;
      }
      if (x0[i] === "" || isNaN(x0[i])) {
        setError(
          `El campo del vector x0 en la posición [${i + 1}] es obligatorio.`
        );
        return false;
      }
    }

    const tol = parseFloat(tolerance);
    if (isNaN(tol) || tol <= 0) {
      setError('El campo "Tolerancia" es obligatorio.');
      return false;
    }

    const iter = parseInt(iterations);
    if (isNaN(iter) || iter <= 0) {
      setError('El campo "Número de iteraciones" es obligatorio.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (!validarEntradas()) return;

    try {
      const parsedMatrix = matrix.map((row) => row.map(Number));
      const parsedVectorB = vectorB.map(Number);
      const parsedX0 = x0.map(Number);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/gauss-seidel",
        {
          matrix: parsedMatrix,
          vector: parsedVectorB,
          x0: parsedX0,
          tolerance,
          iterations,
          norm,
        }
      );

      setResultado(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al conectar con el servidor."
      );
    }
  };

  return (
    <div className="metodo-principal-page">
      <h1 className="titulo-principal">Método de Gauss-Seidel</h1>
      <div className="top-section">
        <form onSubmit={handleSubmit} className="formulario-contenedor-cap2">
          <div className="formulario">
            {/* Tamaño del sistema */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Define el tamaño del sistema de ecuaciones lineales.
                        Debe ser un valor entre 2 y 7.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>3</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Tamaño del sistema:</span>
              </div>
            </label>
            <input
              type="number"
              min="2"
              max="7"
              value={n}
              onChange={(e) => handleTamañoChange(e.target.value)}
            />

            <div
              className="matrices-container"
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div>
                <label className="label-con-icono">
                  <div>
                    <div className="tooltip-container">
                      <div className="tooltip-icon">
                        ?
                        <div className="tooltip-text">
                          <p className="tooltip-explicacion">
                            Matriz de coeficientes del sistema Ax = b.
                            Idealmente debe ser diagonalmente dominante para
                            asegurar la convergencia.
                          </p>
                        </div>
                      </div>
                    </div>
                    <span>Matriz A:</span>
                  </div>
                </label>
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
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div>
                {/* Vector b */}
                <label className="label-con-icono">
                  <div>
                    <div className="tooltip-container">
                      <div className="tooltip-icon">
                        ?
                        <div className="tooltip-text">
                          <p className="tooltip-explicacion">
                            Vector de constantes independientes (b) del sistema
                            Ax = b.
                          </p>
                          <p className="tooltip-ejemplo">
                            Ejemplo: <code>[1, 1, 1]</code>
                          </p>
                        </div>
                      </div>
                    </div>
                    <span>Vector B:</span>
                  </div>
                </label>
                {vectorB.map((val, i) => (
                  <input
                    key={i}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) =>
                      handleVectorChange(vectorB, i, e.target.value)
                    }
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      width: "70px",
                      marginLeft: "25px",
                    }}
                  />
                ))}
              </div>

              <div>
                {/* Vector x0 */}
                <label className="label-con-icono">
                  <div>
                    <div className="tooltip-container">
                      <div className="tooltip-icon">
                        ?
                        <div className="tooltip-text">
                          <p className="tooltip-explicacion">
                            Valor inicial para la iteración. Es recomendable
                            usar ceros o una estimación cercana.
                          </p>
                          <p className="tooltip-ejemplo">
                            Ejemplo: <code>[0, 0, 0]</code>
                          </p>
                        </div>
                      </div>
                    </div>
                    <span>Vector x0:</span>
                  </div>
                </label>
                {x0.map((val, i) => (
                  <input
                    key={i}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => handleVectorChange(x0, i, e.target.value)}
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      width: "70px",
                      marginLeft: "25px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Tolerancia */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Define el error permitido. Debe ser un número positivo
                        entre <code>1e-12</code> y <code>1e-1</code>.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>1e-5</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Tolerancia:</span>
              </div>
            </label>
            <input
              type="number"
              step="any"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
            />

            {/* Iteraciones */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Número máximo de iteraciones permitidas. Un valor entre
                        1 y 100 es común.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>50</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span>Número de iteraciones:</span>
              </div>
            </label>
            <input
              type="number"
              value={iterations}
              onChange={(e) => setIterations(e.target.value)}
            />

            {/* Norma */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Tipo de norma usada para calcular el error:{" "}
                        <strong>1</strong> (norma uno), <strong>2</strong>{" "}
                        (euclidiana), <strong>inf</strong> (infinita), etc.
                      </p>
                    </div>
                  </div>
                </div>
                <span>Norma:</span>
              </div>
            </label>
            <select value={norm} onChange={handleNormChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="inf">Infinita</option>
            </select>

            {error && <p className="error">{error}</p>}

            <button type="submit">Calcular</button>
          </div>
        </form>

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

export default GaussSeidel;
