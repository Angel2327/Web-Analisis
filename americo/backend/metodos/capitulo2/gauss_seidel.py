import numpy as np

def radio_espectral(matriz):
    valores, _ = np.linalg.eig(matriz)
    return max(abs(valores))

def metodo_gauss_seidel(matrizA, vectorB, x0, tol, max_iter):
    try:
        A = np.array(matrizA, dtype=float)
        b = np.array(vectorB, dtype=float)
        x = np.array(x0, dtype=float)
        tol = float(tol)
        max_iter = int(max_iter)
    except Exception:
        return {"error": "Error al interpretar los datos. Verifique que todos sean numéricos."}, 400

    if A.shape[0] != A.shape[1]:
        return {"error": "La matriz A debe ser cuadrada."}, 400
    if b.shape[0] != A.shape[0] or x.shape[0] != A.shape[0]:
        return {"error": "El tamaño de b y x0 debe coincidir con el de la matriz A."}, 400
    if A.shape[0] > 7:
        return {"error": "El tamaño máximo permitido es 7x7."}, 400

    L = np.tril(A)
    U = A - L

    try:
        L_inv = np.linalg.inv(L)
    except np.linalg.LinAlgError:
        return {"error": "La matriz L no es invertible."}, 400

    tabla = []
    error = tol + 1
    iteracion = 0
    x_old = x.copy()

    iter_matrix = -L_inv @ U
    rho = radio_espectral(iter_matrix)

    converge = rho < 1

    while error > tol and iteracion < max_iter:
        for i in range(A.shape[0]):
            suma = sum(A[i][j] * x[j] for j in range(A.shape[1]) if j != i)
            x[i] = (b[i] - suma) / A[i][i]
        error = np.linalg.norm(x - x_old, ord=np.inf)
        tabla.append({
            "iteracion": iteracion + 1,
            "x": {f"x{i+1}": x[i] for i in range(len(x))},
            "error": error,
        })
        x_old = x.copy()
        iteracion += 1

    return {
        "tabla": tabla,
        "radio_espectral": float(rho),
        "converge": int(converge)
    }, 200
