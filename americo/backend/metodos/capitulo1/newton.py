import sympy as sp
import numpy as np


def metodo_newton(funcion_str, x0, tol, max_iter):
    x = sp.symbols("x")
    try:
        f_expr = sp.sympify(funcion_str)
        df_expr = sp.diff(f_expr, x)
        f = sp.lambdify(x, f_expr, "numpy")
        df = sp.lambdify(x, df_expr, "numpy")
    except Exception:
        return {
            "error": "La función ingresada no es válida. Por favor revise la sintaxis."
        }, 400

    # Validación de parámetros numéricos con mensajes claros
    try:
        x0 = float(x0)
    except ValueError:
        return {"error": "El valor inicial 'x0' debe ser un número válido."}, 400

    try:
        tol = float(tol)
    except ValueError:
        return {"error": "La tolerancia debe ser un número válido."}, 400

    try:
        max_iter = int(max_iter)
    except ValueError:
        return {
            "error": "El número máximo de iteraciones debe ser un entero válido."
        }, 400

    # Validaciones lógicas para tolerancia y max_iter
    if tol <= 0 or tol > 1e-1:
        return {"error": "La tolerancia debe estar entre 1e-12 y 1e-1."}, 400
    if max_iter < 1 or max_iter > 100:
        return {
            "error": "El número máximo de iteraciones debe estar entre 1 y 100."
        }, 400

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
