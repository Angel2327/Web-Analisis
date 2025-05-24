from sympy import symbols, simplify
import numpy as np


def metodo_spline(x, y, tipo="lineal"):
    # Ordenar puntos por x ascendente
    puntos_ordenados = sorted(zip(x, y), key=lambda p: p[0])
    x_ord, y_ord = zip(*puntos_ordenados)

    # Validar que no haya valores x repetidos (x[i] != x[i+1])
    for i in range(len(x_ord) - 1):
        if x_ord[i] == x_ord[i + 1]:
            return {"error": "Los valores de x no deben repetirse."}, 400

    if tipo == "lineal":
        return spline_lineal(x_ord, y_ord), 200
    elif tipo == "cubico":
        return spline_cubico(x_ord, y_ord), 200
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
    h = [x[i + 1] - x[i] for i in range(n - 1)]

    # Paso 1: Crear matriz del sistema y vector del lado derecho
    A = np.zeros((n, n))
    b_vec = np.zeros(n)

    A[0][0] = 1
    A[n - 1][n - 1] = 1

    for i in range(1, n - 1):
        A[i][i - 1] = h[i - 1]
        A[i][i] = 2 * (h[i - 1] + h[i])
        A[i][i + 1] = h[i]
        b_vec[i] = 3 * ((y[i + 1] - y[i]) / h[i] - (y[i] - y[i - 1]) / h[i - 1])

    # Paso 2: Resolver para c
    c = np.linalg.solve(A, b_vec)

    # Paso 3: Calcular a, b, d
    a = [y[i] for i in range(n - 1)]
    b = [0] * (n - 1)
    d = [0] * (n - 1)
    xi = symbols("x")

    splines = []
    coef_table = []

    for i in range(n - 1):
        b[i] = (y[i + 1] - y[i]) / h[i] - h[i] * (2 * c[i] + c[i + 1]) / 3
        d[i] = (c[i + 1] - c[i]) / (3 * h[i])
        poly = (
            a[i]
            + b[i] * (xi - x[i])
            + c[i] * (xi - x[i]) ** 2
            + d[i] * (xi - x[i]) ** 3
        )
        poly = simplify(poly)
        splines.append({"intervalo": f"[{x[i]}, {x[i + 1]}]", "polinomio": str(poly)})

        coef_table.append(
            {
                "i": i,
                "coef1": float(d[i]),
                "coef2": float(c[i]),
                "coef3": float(b[i]),
                "coef4": float(a[i]),
                "formato": f"{d[i]}x^3 + ({c[i]})x^2 + ({b[i]})x + ({a[i]})",
            }
        )

    print("Coeficientes cúbicos enviados al frontend:")
    for row in coef_table:
        print(row)

    return {"splines": splines, "coeficientes": coef_table}
