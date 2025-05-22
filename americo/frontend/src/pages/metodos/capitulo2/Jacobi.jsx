import React, { useState } from "react";
import axios from "axios";
import "./Jacobi.css";

const Jacobi = () => {
  const [n, setN] = useState(3); // Tamaño por defecto
  const [matrix, setMatrix] = useState(Array(3).fill(Array(3).fill("")));
  const [vectorB, setVectorB] = useState(Array(3).fill(""));
  const [x0, setX0] = useState(Array(3).fill(""));
  const [tolerance, setTolerance] = useState("");
  const [iterations, setIterations] = useState("");
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

  const handleTamañoChange = (newN) => {
    const size = parseInt(newN);
    if (isNaN(size) || size < 2 || size > 7) return;
    setN(size);
    setMatrix(Array(size).fill().map(() => Array(size).fill("")));
    setVectorB(Array(size).fill(""));
    setX0(Array(size).fill(""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    try {
      const parsedMatrix = matrix.map(row => row.map(Number));
      const parsedVectorB = vectorB.map(Number);
      const parsedX0 = x0.map(Number);

      const response = await axios.post("http://127.0.0.1:8000/api/jacobi", {
        matrix: parsedMatrix,
        vector: parsedVectorB,
        x0: parsedX0,
        tolerance,
        iterations,
      });

      setResultado(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al conectar con el servidor.");
    }
  };

  return (
    <div className="jacobi-container">
      <h2>Método de Jacobi</h2>
      <form onSubmit={handleSubmit} className="form-jacobi">
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

        <div className="matrices-container">
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
                          onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                          required
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4>Vector B:</h4>
            {vectorB.map((val, i) => (
              <input
                key={i}
                type="number"
                step="any"
                value={val}
                onChange={(e) => handleVectorChange(vectorB, i, e.target.value)}
                required
              />
            ))}
          </div>

          <div>
            <h4>Vector inicial x0:</h4>
            {x0.map((val, i) => (
              <input
                key={i}
                type="number"
                step="any"
                value={val}
                onChange={(e) => handleVectorChange(x0, i, e.target.value)}
                required
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

        <button type="submit">Ejecutar</button>
      </form>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <div className="resultado-jacobi">
          <h3>Resultado:</h3>
          <table>
            <thead>
              <tr>
                <th>Iteración</th>
                {Object.keys(resultado.tabla[0].x).map((key, i) => (
                  <th key={i}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultado.tabla.map((fila, i) => (
                <tr key={i}>
                  <td>{fila.iteracion}</td>
                  {Object.values(fila.x).map((val, j) => (
                    <td key={j}>{parseFloat(val).toExponential(3)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Convergencia:</strong> {resultado.converge ? "Sí" : "No"}</p>
          <p><strong>Radio espectral:</strong> {resultado.radio_espectral.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default Jacobi;
