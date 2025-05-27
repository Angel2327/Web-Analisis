import numpy as np
from sympy import symbols, lambdify
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
)


def graficar_funcion(funcion_str, x_min=-10, x_max=10, puntos=500):
    try:
        x = symbols("x")

        # ✅ Permitir coma decimal como separador (15,5 → 15.5)
        funcion_str = funcion_str.replace(",", ".")

        # ✅ Soporta multiplicación implícita: x(x-1)
        transformations = standard_transformations + (
            implicit_multiplication_application,
        )
        funcion_expr = parse_expr(funcion_str, transformations=transformations)

        # ✅ Evalúa la función con numpy
        f = lambdify(x, funcion_expr, modules=["numpy"])

        x_vals = np.linspace(x_min, x_max, puntos)
        y_vals = f(x_vals)

        # ✅ Elimina valores infinitos o NaN para evitar errores en la gráfica
        y_vals = np.nan_to_num(y_vals, nan=np.nan, posinf=np.nan, neginf=np.nan)

        return {
            "x": x_vals.tolist(),
            "y": y_vals.tolist(),
            "message": "Gráfica generada correctamente",
        }, 200

    except Exception as e:
        return {"message": f"Error al procesar la función: {str(e)}"}, 400
