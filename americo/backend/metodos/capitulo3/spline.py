from sympy import symbols, simplify
import numpy as np


def metodo_spline(x, y, tipo="lineal"):
    if tipo == "lineal":
        return spline_lineal(x, y), 200
    elif tipo == "cubico":
        return spline_cubico(x, y), 200
    else:
        return {"error": f"Tipo de spline '{tipo}' no implementado."}, 400


def spline_lineal(x, y):
    n = len(x)
    x = np.array(x)
    y = np.array(y)
    splines = []
    coef_table = []
    xi = symbols("x")
    for i in range(n - 1):
        m = (y[i + 1] - y[i]) / (x[i + 1] - x[i])  # pendiente
        b = y[i] - m * x[i]  # intercepto
        expr = m * xi + b
        expr = simplify(expr)
        splines.append({"intervalo": f"[{x[i]}, {x[i + 1]}]", "polinomio": str(expr)})
        coef_table.append(
            {
                "i": i,
                "coef1": float(m),
                "coef2": float(b),
                "formato": f"{m:.3f}x + {b:.3f}",
            }
        )
    return {"splines": splines, "coeficientes": coef_table}


def spline_cubico(x, y):
    n = len(x)
    x = np.array(x)
    y = np.array(y)

    h = np.diff(x)
    A = np.zeros((n, n))
    rhs = np.zeros(n)

    A[0, 0] = 1
    A[-1, -1] = 1

    for i in range(1, n - 1):
        A[i, i - 1] = h[i - 1]
        A[i, i] = 2 * (h[i - 1] + h[i])
        A[i, i + 1] = h[i]
        rhs[i] = 3 * ((y[i + 1] - y[i]) / h[i] - (y[i] - y[i - 1]) / h[i - 1])

    c = np.linalg.solve(A, rhs)

    a = y[:-1]
    b = np.zeros(n - 1)
    d = np.zeros(n - 1)
    coef_table = []

    for i in range(n - 1):
        b[i] = (y[i + 1] - y[i]) / h[i] - h[i] * (2 * c[i] + c[i + 1]) / 3
        d[i] = (c[i + 1] - c[i]) / (3 * h[i])

    splines = []
    xi = symbols("x")
    for i in range(n - 1):
        poly = (
            a[i]
            + b[i] * (xi - x[i])
            + c[i] * (xi - x[i]) ** 2
            + d[i] * (xi - x[i]) ** 3
        )
        poly = simplify(poly)
        splines.append({"intervalo": f"[{x[i]}, {x[i + 1]}]", "polinomio": str(poly)})
        coef_table.append(
            {"i": i, "coef1": float(a[i]), "coef2": float(b[i]), "formato": str(poly)}
        )

    return {"splines": splines, "coeficientes": coef_table}
