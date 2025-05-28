import sympy as sp
import numpy as np
import math


def es_valor_valido(valor):
    return (
        valor is not None
        and isinstance(valor, (float, int, np.floating))
        and not math.isnan(valor)
        and not math.isinf(valor)
    )


def evaluar_funcion(func, x_val):
    try:
        val = func(x_val)
        if es_valor_valido(val):
            return float(val)
        else:
            return None
    except:
        return None


def metodo_punto_fijo(funcion_str, g_funcion_str, x0, tol, max_iter):
    x = sp.symbols("x")
    try:
        f_expr = sp.sympify(funcion_str)
        g_expr = sp.sympify(g_funcion_str)

        funcs_map = {"sin": np.sin, "log": np.log, "sqrt": np.sqrt, "exp": np.exp}

        f = sp.lambdify(x, f_expr, modules=[funcs_map, "numpy"])
        g = sp.lambdify(x, g_expr, modules=[funcs_map, "numpy"])
    except Exception:
        return {
            "error": "Alguna de las funciones ingresadas no es válida. Por favor revise la sintaxis."
        }, 400

    # Validaciones numéricas individuales con mensajes claros
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

    # Validaciones lógicas para tol y max_iter
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
        x_new = evaluar_funcion(g, x_old)
        if x_new is None:
            return {
                "error": f"Valor inválido al evaluar g(x) en iteración {iteracion + 1}."
            }, 400

        f_x_new = evaluar_funcion(f, x_new)
        if f_x_new is None:
            return {
                "error": f"Valor inválido al evaluar f(x) en iteración {iteracion + 1}."
            }, 400

        g_x_old = evaluar_funcion(g, x_old)

        error = abs(x_new - x_old)
        tabla.append(
            {
                "iteracion": iteracion + 1,
                "x": round(x_new, 10),
                "g(x)": round(g_x_old, 10) if g_x_old is not None else None,
                "f(x)": round(f_x_new, 10),
                "error": round(error, 10),
            }
        )

        if abs(f_x_new) < tol:
            break

        x_old = x_new
        iteracion += 1

    try:
        x_vals = np.linspace(x0 - 5, x0 + 5, 400)

        y_vals = []
        gx_vals = []

        for x_i in x_vals:
            y_i = evaluar_funcion(f, x_i)
            gx_i = evaluar_funcion(g, x_i)

            y_vals.append(y_i if y_i is not None else None)
            gx_vals.append(gx_i if gx_i is not None else None)

        grafica = {"x": x_vals.tolist(), "y": y_vals, "gx": gx_vals}
    except Exception as e:
        grafica = {
            "x": [],
            "y": [],
            "gx": [],
            "error": f"No se pudo generar gráfica: {str(e)}",
        }

    return {"tabla": tabla, "grafica": grafica}, 200
