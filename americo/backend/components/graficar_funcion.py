# metodos/grafica_funcion.py

import numpy as np
from sympy import symbols, sympify, lambdify


def graficar_funcion(funcion_str):
    try:
        x = symbols("x")
        funcion_sym = sympify(funcion_str)
        f = lambdify(x, funcion_sym, modules=["numpy"])

        x_vals = np.linspace(-10, 10, 500)
        y_vals = f(x_vals)

        return {
            "x": x_vals.tolist(),
            "y": y_vals.tolist(),
            "message": "Gráfica generada correctamente",
        }, 200

    except Exception as e:
        return {"message": f"Error al procesar la función: {str(e)}"}, 400
