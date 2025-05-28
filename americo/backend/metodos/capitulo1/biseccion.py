import sympy as sp
import numpy as np


def metodo_biseccion(funcion_str, a, b, tol, max_iter):
    x = sp.symbols("x")
    try:
        f_expr = sp.sympify(funcion_str)
        f = sp.lambdify(x, f_expr, "numpy")
    except Exception as e:
        return {
            "error": "La función ingresada no es válida. Por favor revise la sintaxis."
        }, 400

    # Validación de parámetros numéricos con mensajes claros
    try:
        a = float(a)
    except ValueError:
        return {"error": "El valor de 'a' debe ser un número válido."}, 400

    try:
        b = float(b)
    except ValueError:
        return {"error": "El valor de 'b' debe ser un número válido."}, 400

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

    # Validaciones lógicas con mensajes descriptivos
    if a >= b:
        return {"error": "El valor de 'a' debe ser menor que el valor de 'b'."}, 400
    if tol <= 0 or tol > 1e-1:
        return {"error": "La tolerancia debe estar entre 1e-12 y 1e-1."}, 400
    if max_iter < 1 or max_iter > 100:
        return {
            "error": "El número máximo de iteraciones debe estar entre 1 y 100."
        }, 400

    try:
        if f(a) * f(b) >= 0:
            return {
                "error": "La función debe cambiar de signo en el intervalo [a, b]."
            }, 400
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

        if f(a) * fc < 0:
            b = c
        else:
            a = c

        error = abs(b - a)

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
