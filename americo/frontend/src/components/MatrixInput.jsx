// MatrixInput.jsx
import { useState } from "react";

export default function MatrixInput({
  onMatrixChange,
  onVectorChange,
  onInitialGuessChange,
  sizeLimit = 7,
}) {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState(Array(size).fill(Array(size).fill("")));
  const [vector, setVector] = useState(Array(size).fill(""));
  const [x0, setX0] = useState(Array(size).fill(""));

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setMatrix(Array(newSize).fill(Array(newSize).fill("")));
    setVector(Array(newSize).fill(""));
    setX0(Array(newSize).fill(""));
  };

  const handleMatrixChange = (i, j, value) => {
    const newMatrix = matrix.map((row, rowIndex) =>
      rowIndex === i ? row.map((cell, colIndex) => (colIndex === j ? value : cell)) : row
    );
    setMatrix(newMatrix);
    onMatrixChange(newMatrix.map(row => row.map(Number)));
  };

  const handleVectorChange = (i, value) => {
    const newVector = [...vector];
    newVector[i] = value;
    setVector(newVector);
    onVectorChange(newVector.map(Number));
  };

  const handleX0Change = (i, value) => {
    const newX0 = [...x0];
    newX0[i] = value;
    setX0(newX0);
    onInitialGuessChange(newX0.map(Number));
  };

  return (
    <div>
      <label>Tamaño de la matriz (max {sizeLimit}):</label>
      <input
        type="number"
        min="2"
        max={sizeLimit}
        value={size}
        onChange={handleSizeChange}
      />
      <div className="mt-2 space-y-2">
        {[...Array(size)].map((_, i) => (
          <div key={i} className="flex space-x-2">
            {[...Array(size)].map((_, j) => (
              <input
                key={j}
                type="number"
                placeholder={`A[${i + 1}][${j + 1}]`}
                value={matrix[i]?.[j] || ""}
                onChange={(e) => handleMatrixChange(i, j, e.target.value)}
              />
            ))}
            <input
              type="number"
              placeholder={`b[${i + 1}]`}
              value={vector[i] || ""}
              onChange={(e) => handleVectorChange(i, e.target.value)}
            />
            <input
              type="number"
              placeholder={`x0[${i + 1}]`}
              value={x0[i] || ""}
              onChange={(e) => handleX0Change(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
