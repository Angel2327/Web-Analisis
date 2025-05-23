import numpy as np
from sympy import symbols, simplify, expand


def metodo_vandermonde(xPoints, yPoints):
    if len(xPoints) != len(yPoints):
        raise ValueError("Los vectores X y Y deben tener la misma longitud")

    if len(set(xPoints)) != len(xPoints):
        raise ValueError(
            "Los valores de X deben ser únicos para generar la matriz de Vandermonde"
        )

    xPoints = np.array(xPoints, dtype=float)
    yPoints = np.array(yPoints, dtype=float)

    V = np.vander(xPoints, increasing=True)
    coeffs = np.linalg.solve(V, yPoints)

    x = symbols("x")
    poly_expr = sum(coeffs[i] * x**i for i in range(len(coeffs)))
    poly_str = str(simplify(expand(poly_expr)))

    return {"matrix": V.tolist(), "coeffs": coeffs.tolist(), "polynomial": poly_str}
