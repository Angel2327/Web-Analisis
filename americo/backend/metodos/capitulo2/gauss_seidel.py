from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)


def radio_espectral(matriz):
    valores, _ = np.linalg.eig(matriz)
    return max(abs(valores))


def metodo_gauss_seidel(matrizA, vectorB, x0, tol, max_iter, norma):
    try:
        A = np.array(matrizA, dtype=float)
        b = np.array(vectorB, dtype=float)
        x = np.array(x0, dtype=float)
        tol = float(tol)
        max_iter = int(max_iter)
    except Exception:
        return {
            "error": "Error al interpretar los datos. Verifique que todos sean numéricos."
        }, 400

    if A.shape[0] != A.shape[1]:
        return {"error": "La matriz A debe ser cuadrada."}, 400
    if b.shape[0] != A.shape[0] or x.shape[0] != A.shape[0]:
        return {
            "error": "El tamaño de b y x0 debe coincidir con el de la matriz A."
        }, 400
    if A.shape[0] > 7:
        return {"error": "El tamaño máximo permitido es 7x7."}, 400

    n = A.shape[0]
    tabla = []
    error = tol + 1
    iteracion = 0
    x_old = x.copy()

    # Para radio espectral
    L = np.tril(A)
    U = A - L
    try:
        L_inv = np.linalg.inv(L)
    except np.linalg.LinAlgError:
        return {
            "error": "La matriz L (triangular inferior de A) no es invertible."
        }, 400
    iter_matrix = -L_inv @ U
    rho = radio_espectral(iter_matrix)

    while error > tol and iteracion < max_iter:
        x_new = x_old.copy()
        for i in range(n):
            sum1 = sum(A[i][j] * x_new[j] for j in range(i))
            sum2 = sum(A[i][j] * x_old[j] for j in range(i + 1, n))
            x_new[i] = (b[i] - sum1 - sum2) / A[i][i]

        if norma == "1":
            error = np.linalg.norm((x_new - x_old) / x_new, ord=1)
        elif norma == "2":
            error = np.linalg.norm((x_new - x_old) / x_new, ord=2)
        elif norma == "3":
            error = np.linalg.norm((x_new - x_old) / x_new, ord=3)
        else:
            error = np.linalg.norm((x_new - x_old) / x_new, ord=np.inf)

        tabla.append(
            {
                "iteracion": iteracion + 1,
                "x": {f"x{i+1}": x_new[i] for i in range(len(x_new))},
                "error": error,
            }
        )

        x_old = x_new
        iteracion += 1

    converge = rho < 1

    return {"tabla": tabla, "radio_espectral": float(rho), "converge": int(converge)}
