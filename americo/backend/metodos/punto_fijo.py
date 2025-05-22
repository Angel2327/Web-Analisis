import sympy as sp
import numpy as np
import math

def es_valor_valido(valor):
    return (valor is not None and isinstance(valor, (float, int, np.floating)) and not math.isnan(valor) and not math.isinf(valor))

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
    x = sp.symbols('x')
    try:
        f_expr = sp.sympify(funcion_str)
        g_expr = sp.sympify(g_funcion_str)

        # Mapeo explícito para funciones matemáticas usadas:
        funcs_map = {"sin": np.sin, "log": np.log, "sqrt": np.sqrt, "exp": np.exp}

        f = sp.lambdify(x, f_expr, modules=[funcs_map, "numpy"])
        g = sp.lambdify(x, g_expr, modules=[funcs_map, "numpy"])
    except Exception as e:
        return {"error": f"Error interpretando funciones: {str(e)}"}, 400

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
        x_new = evaluar_funcion(g, x_old)
        if x_new is None:
            return {"error": f"Valor inválido al evaluar g(x) en iteración {iteracion + 1}."}, 400

        f_x_new = evaluar_funcion(f, x_new)
        if f_x_new is None:
            return {"error": f"Valor inválido al evaluar f(x) en iteración {iteracion + 1}."}, 400

        g_x_new = evaluar_funcion(g, x_new)

        error = abs(x_new - x_old)
        tabla.append({
            "iteracion": iteracion + 1,
            "x": round(x_new, 10),
            "gx": round(g_x_new, 10) if g_x_new is not None else None,
            "f(x)": round(f_x_new, 10),
            "error": round(error, 10)
        })

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

        grafica = {
            "x": x_vals.tolist(),
            "y": y_vals,
            "gx": gx_vals
        }
    except Exception as e:
        grafica = {"x": [], "y": [], "gx": [], "error": f"No se pudo generar gráfica: {str(e)}"}

    return {"tabla": tabla, "grafica": grafica}, 200
