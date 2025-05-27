import numpy as np
from sympy import symbols, simplify, expand


def metodo_vandermonde(xPoints, yPoints):
    if len(xPoints) != len(yPoints):
        raise ValueError("Los vectores X y Y deben tener la misma longitud")

    xPoints = np.array(xPoints, dtype=float)
    yPoints = np.array(yPoints, dtype=float)

    V = np.vander(xPoints, increasing=True)
    coeficientes = np.linalg.solve(V, yPoints)

    x = symbols("x")
    poly_expr = sum(coeficientes[i] * x**i for i in range(len(coeficientes)))
    poly_str = str(simplify(expand(poly_expr)))

    return {
        "matrix": V.tolist(),
        "coeficientes": coeficientes.tolist(),
        "polynomial": poly_str,
    }
