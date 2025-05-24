import sympy as sp
import numpy as np


def metodo_biseccion(funcion_str, a, b, tol, max_iter):
    x = sp.symbols("x")
    try:
        f_expr = sp.sympify(funcion_str)
        f = sp.lambdify(x, f_expr, "numpy")
    except Exception as e:
        return {"error": f"Error interpretando función: {str(e)}"}, 400

    try:
        a = float(a)
        b = float(b)
        tol = float(tol)
        max_iter = int(max_iter)
    except ValueError:
        return {"error": "Parámetros numéricos inválidos."}, 400

    if a >= b:
        return {"error": "El valor de 'a' debe ser menor que 'b'."}, 400
    if tol <= 0 or tol > 1e-1:
        return {"error": "La tolerancia debe estar entre 1e-12 y 1e-1."}, 400
    if max_iter < 1 or max_iter > 100:
        return {"error": "El número de iteraciones debe estar entre 1 y 100."}, 400

    try:
        if f(a) * f(b) >= 0:
            return {"error": "La función no cambia de signo en el intervalo."}, 400
    except Exception:
        return {
            "error": "No se pudo evaluar la función en los extremos del intervalo."
        }, 400

    tabla = []
    iteracion = 0
    error = abs(b - a)

    while error > tol and iteracion < max_iter:
        c = (a + b) / 2
        fc = f(c)

        tabla.append(
            {
                "iteracion": iteracion + 1,
                "a": a,
                "b": b,
                "c": c,
                "f(c)": fc,
                "error": error,
            }
        )

        if f(a) * fc < 0:
            b = c
        else:
            a = c

        error = abs(b - a)
        iteracion += 1

    # Datos para gráfica
    try:
        x_vals = np.linspace(a - 1, b + 1, 400)
        y_vals = f(x_vals)
        grafica = {"x": x_vals.tolist(), "y": y_vals.tolist()}
    except Exception as e:
        grafica = {
            "x": [],
            "y": [],
            "error": f"No se pudo generar la gráfica: {str(e)}",
        }

    return {"tabla": tabla, "grafica": grafica}, 200
