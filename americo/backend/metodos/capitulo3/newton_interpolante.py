import numpy as np
from sympy import symbols, simplify, expand


def metodo_newton_interpolante(xPoints, yPoints):
    if len(xPoints) != len(yPoints):
        raise ValueError("Los vectores X y Y deben tener la misma longitud")

    if len(set(xPoints)) != len(xPoints):
        raise ValueError("Los valores de X deben ser únicos para poder interpolar")

    n = len(xPoints)
    xPoints = np.array(xPoints, dtype=float)
    yPoints = np.array(yPoints, dtype=float)

    # Crear tabla de diferencias divididas
    diff_table = np.zeros((n, n))
    diff_table[:, 0] = yPoints

    for j in range(1, n):
        for i in range(n - j):
            diff_table[i][j] = (diff_table[i + 1][j - 1] - diff_table[i][j - 1]) / (
                xPoints[i + j] - xPoints[i]
            )

    coeffs = diff_table[0, :]  # coeficientes de Newton

    # Construir el polinomio simbólico
    x = symbols("x")
    poly_expr = coeffs[0]
    product_term = 1
    for i in range(1, n):
        product_term *= x - xPoints[i - 1]
        poly_expr += coeffs[i] * product_term

    poly_str = str(simplify(expand(poly_expr)))

    # Convertir tabla a lista para enviar (solo la parte útil)
    diff_table_list = diff_table.tolist()

    return {
        "difference_table": diff_table_list,
        "coeffs": coeffs.tolist(),
        "polynomial": poly_str,
    }
