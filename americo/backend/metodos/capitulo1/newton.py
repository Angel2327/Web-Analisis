import sympy as sp
import numpy as np


def metodo_newton(funcion_str, x0, tol, max_iter):
    x = sp.symbols("x")
    try:
        f_expr = sp.sympify(funcion_str)
        df_expr = sp.diff(f_expr, x)
        f = sp.lambdify(x, f_expr, "numpy")
        df = sp.lambdify(x, df_expr, "numpy")
    except Exception as e:
        return {"error": f"Error interpretando función: {str(e)}"}, 400

    try:
        x0 = float(x0)
        tol = float(tol)
        max_iter = int(max_iter)
    except ValueError:
        return {"error": "Parámetros numéricos inválidos."}, 400

    tabla = []
    error = tol + 1
    iteracion = 0
    x_old = x0

    while error > tol and iteracion < max_iter:
        try:
            fx = f(x_old)
            dfx = df(x_old)
        except Exception as e:
            return {"error": f"Error evaluando función o derivada: {str(e)}"}, 400

        if dfx == 0:
            return {"error": "Derivada igual a 0. División por cero."}, 400

        x_new = x_old - fx / dfx
        error = abs(x_new - x_old)

        tabla.append(
            {
                "iteracion": iteracion + 1,
                "x": x_new,
                "fx": fx,
                "fx_derivada": dfx,
                "error": error,
            }
        )

        x_old = x_new
        iteracion += 1

    # Gráfica f(x)
    try:
        x_vals = np.linspace(x0 - 5, x0 + 5, 400)
        y_vals = f(x_vals)
        grafica = {
            "x": x_vals.tolist(),
            "y": y_vals.tolist(),
        }
    except Exception as e:
        grafica = {"x": [], "y": [], "error": f"No se pudo graficar: {str(e)}"}

    return {"tabla": tabla, "grafica": grafica}, 200
