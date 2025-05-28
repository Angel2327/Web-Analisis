import sympy as sp
import numpy as np


def metodo_secante(funcion_str, x0, x1, tol, max_iter):
    x = sp.symbols("x")
    try:
        f_expr = sp.sympify(funcion_str)
        f = sp.lambdify(x, f_expr, "numpy")
    except Exception:
        return {"error": "Función no válida. Por favor revise la sintaxis."}, 400

    try:
        x0 = float(x0)
    except ValueError:
        return {"error": "El valor de 'x0' debe ser un número válido."}, 400

    try:
        x1 = float(x1)
    except ValueError:
        return {"error": "El valor de 'x1' debe ser un número válido."}, 400

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

    tabla = []
    error = tol + 1
    iteracion = 0

    while error > tol and iteracion < max_iter:
        try:
            fx0 = f(x0)
            fx1 = f(x1)
        except Exception as e:
            return {"error": f"Error evaluando función: {str(e)}"}, 400

        if fx1 - fx0 == 0:
            return {"error": "División por cero en la fórmula de la secante."}, 400

        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        error = abs(x2 - x1)

        tabla.append(
            {
                "iteracion": iteracion + 1,
                "x0": x0,
                "x1": x1,
                "fx0": fx0,
                "fx1": fx1,
                "error": error,
            }
        )

        x0, x1 = x1, x2
        iteracion += 1

    try:
        x_vals = np.linspace(x1 - 5, x1 + 5, 400)
        y_vals = f(x_vals)
        grafica = {
            "x": x_vals.tolist(),
            "y": y_vals.tolist(),
        }
    except Exception as e:
        grafica = {"x": [], "y": [], "error": f"No se pudo graficar: {str(e)}"}

    return {"tabla": tabla, "grafica": grafica}, 200
