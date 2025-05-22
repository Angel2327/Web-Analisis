import sympy as sp
import numpy as np

def metodo_raices_multiples(funcion_str, x0, tol, max_iter):
    x = sp.symbols('x')
    try:
        f_expr = sp.sympify(funcion_str)
        f = sp.lambdify(x, f_expr, "numpy")
        f_prime = sp.lambdify(x, sp.diff(f_expr, x), "numpy")
        f_double_prime = sp.lambdify(x, sp.diff(f_expr, x, 2), "numpy")
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

    while error > tol and iteracion < max_iter:
        try:
            fx = f(x0)
            fx1 = f_prime(x0)
            fx2 = f_double_prime(x0)
        except Exception as e:
            return {"error": f"Error evaluando función o derivadas: {str(e)}"}, 400

        denominador = fx1**2 - fx * fx2
        if denominador == 0:
            return {"error": "División por cero en la fórmula de raíces múltiples."}, 400

        x1 = x0 - (fx * fx1) / denominador
        error = abs(x1 - x0)

        tabla.append({
            "iteracion": iteracion + 1,
            "x": x0,
            "fx": fx,
            "fx1": fx1,
            "fx2": fx2,
            "error": error,
        })

        x0 = x1
        iteracion += 1

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
