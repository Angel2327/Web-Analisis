import React, { useState } from "react";
import axios from "axios";
import "../assets/EstiloMetodos.css";

const SOR = () => {
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
  const [omega, setOmega] = useState("1.0");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState([]); // <-- array para errores de validación

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

  const validarCampos = () => {
    // 1. Validar matriz completa, pero solo primer error encontrado
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === "") {
          return [
            `El campo de la matriz A[${i + 1}][${j + 1}] es obligatorio.`,
          ];
        }
      }
    }

    // 2. Validar vectorB, solo primer error
    for (let i = 0; i < vectorB.length; i++) {
      if (vectorB[i] === "") {
        return [`El campo Vector B[${i + 1}] es obligatorio.`];
      }
    }

    // 3. Validar vector x0, solo primer error
    for (let i = 0; i < x0.length; i++) {
      if (x0[i] === "") {
        return [`El campo Vector x0[${i + 1}] es obligatorio.`];
      }
    }

    // 4. Validar tolerance
    if (tolerance === "") {
      return ['El campo "Tolerancia" es obligatorio.'];
    }

    // 5. Validar iterations
    if (iterations === "") {
      return ['El campo "Número de iteraciones" es obligatorio.'];
    }

    // 6. Validar omega
    if (omega === "") {
      return ['El campo "Omega (relajación)" es obligatorio.'];
    } else {
      const parsedOmega = parseFloat(omega);
      if (isNaN(parsedOmega) || parsedOmega <= 0 || parsedOmega >= 2) {
        return [
          "El valor de omega debe ser un número entre 0 y 2 (excluyendo los extremos).",
        ];
      }
    }

    // Si no hay errores
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    // Validar campos antes de enviar
    const errores = validarCampos();
    if (errores.length > 0) {
      setErroresValidacion(errores);
      return;
    } else {
      setErroresValidacion([]);
    }

    try {
      const parsedMatrix = matrix.map((row) => row.map(Number));
      const parsedVectorB = vectorB.map(Number);
      const parsedX0 = x0.map(Number);
      const parsedOmega = parseFloat(omega);

      const response = await axios.post("http://127.0.0.1:8000/api/sor", {
        matrix: parsedMatrix,
        vector: parsedVectorB,
        x0: parsedX0,
        tolerance,
        iterations,
        norm,
        omega: parsedOmega,
      });

      setResultado(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al conectar con el servidor."
      );
    }
  };

  const descargarInformeIndividual = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/informe-individual-cap2",
        {
          metodo: "sor",
          matrizA: matrix.map((row) => row.map(Number)),
          vectorB: vectorB.map(Number),
          x0: x0.map(Number),
          tol: parseFloat(tolerance),
          max_iter: parseInt(iterations),
          norma: norm,
          omega: omega,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_SOR.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error al descargar el informe individual SOR."
      );
    }
  };

  const descargarInformeGeneral = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/informe-general-cap2",
        {
          matrizA: matrix.map((row) => row.map(Number)),
          vectorB: vectorB.map(Number),
          x0: x0.map(Number),
          tol: parseFloat(tolerance),
          max_iter: parseInt(iterations),
          norma: norm,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Informe_general_capitulo2.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error al descargar el informe general Capítulo 2."
      );
    }
  };

  return (
    <div className="metodo-principal-page">
      <h1 class="titulo-principal">Método SOR (Successive Over-Relaxation)</h1>
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

            {/* Omega */}
            <label className="label-con-icono">
              <div>
                <div className="tooltip-container">
                  <div className="tooltip-icon">
                    ?
                    <div className="tooltip-text">
                      <p className="tooltip-explicacion">
                        Valor que ajusta la velocidad de convergencia del
                        método. Toma valores entre 0.01 y 1.99.
                      </p>
                      <p className="tooltip-ejemplo">
                        Ejemplo: <code>1.5</code>
                      </p>
                    </div>
                  </div>
                </div>
                <span> Omega (relajación):</span>
              </div>
            </label>
            <input
              type="number"
              step="any"
              value={omega}
              onChange={(e) => setOmega(e.target.value)}
              required
              min="0.01"
              max="1.99"
              className="entrada"
            />

            {erroresValidacion.length > 0 && (
              <div
                className="errores-validacion"
                style={{ color: "red", marginBottom: "10px" }}
              >
                {erroresValidacion.map((errMsg, idx) => (
                  <p key={idx}>{errMsg}</p>
                ))}
              </div>
            )}

            <button type="submit" className="informe-btn">
              Calcular
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
            <div className="botones-informe" style={{ marginTop: "2rem" }}>
              <button
                type="button"
                onClick={descargarInformeIndividual}
                disabled={
                  !matrix.length ||
                  !vectorB.length ||
                  !x0.length ||
                  tolerance === "" ||
                  iterations === ""
                }
                style={{ marginLeft: "10px" }}
              >
                Descargar Informe SOR
              </button>

              <button
                type="button"
                onClick={descargarInformeGeneral}
                disabled={
                  !matrix.length ||
                  !vectorB.length ||
                  !x0.length ||
                  tolerance === "" ||
                  iterations === ""
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
};

export default SOR;
