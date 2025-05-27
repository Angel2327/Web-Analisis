import io
import pandas as pd
from metodos.capitulo3.lagrange import metodo_lagrange
from metodos.capitulo3.newton_interpolante import metodo_newton_interpolante
from metodos.capitulo3.vandermonde import metodo_vandermonde
from metodos.capitulo3.spline import metodo_spline


def generar_informe_individual(nombre_metodo, xPoints, yPoints, tipo_spline=None):
    if nombre_metodo == "lagrange":
        resultado = metodo_lagrange(xPoints, yPoints)
        data = {
            "Bases Lagrange (funciones base)": [
                "\n".join(resultado.get("lagrange_bases", []))
            ],
            "Polinomio Expandido (forma desarrollada)": [
                resultado.get("expanded_poly", "")
            ],
        }
        df = pd.DataFrame(data)

    elif nombre_metodo == "newton":
        resultado = metodo_newton_interpolante(xPoints, yPoints)
        data = {
            "Tabla de Diferencias (diferencias divididas)": [
                "\n".join(map(str, resultado.get("difference_table", [])))
            ],
            "Coeficientes (de la forma de Newton)": [resultado.get("coeficientes", [])],
            "Polinomio (forma final)": [resultado.get("polynomial", "")],
        }
        df = pd.DataFrame(data)

    elif nombre_metodo == "vandermonde":
        resultado = metodo_vandermonde(xPoints, yPoints)
        data = {
            "Matriz Vandermonde (matriz del sistema)": [
                "\n".join(
                    [", ".join(map(str, fila)) for fila in resultado.get("matrix", [])]
                )
            ],
            "Coeficientes (solución del sistema)": [resultado.get("coeficientes", [])],
            "Polinomio (forma final)": [resultado.get("polynomial", "")],
        }
        df = pd.DataFrame(data)

    elif nombre_metodo == "spline":
        resultado, _ = metodo_spline(xPoints, yPoints, tipo_spline or "lineal")
        data = {
            "Coeficientes (valores para cada tramo)": [
                resultado.get("coeficientes", [])
            ],
            "Splines (polinomios por intervalo)": [
                "\n".join(map(str, resultado.get("splines", [])))
            ],
            "Curva X (valores X de la gráfica)": [resultado.get("curvaX", [])],
            "Curva Y (valores Y de la gráfica)": [resultado.get("curvaY", [])],
        }
        df = pd.DataFrame(data)

    else:
        raise ValueError("Método no reconocido")

    # Generar archivo en memoria
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name=nombre_metodo.capitalize())
    output.seek(0)

    return output


def generar_informe_general(xPoints, yPoints):
    informes = {}
    comparables = {}

    # Lagrange
    resultado_lagrange = metodo_lagrange(xPoints, yPoints)
    informes["Lagrange"] = pd.DataFrame(
        {
            "Bases Lagrange (funciones base)": [
                "\n".join(resultado_lagrange.get("lagrange_bases", []))
            ],
            "Polinomio Expandido (forma desarrollada)": [
                resultado_lagrange.get("expanded_poly", "")
            ],
        }
    )
    comparables["Lagrange"] = len(informes["Lagrange"].columns)

    # Newton
    resultado_newton = metodo_newton_interpolante(xPoints, yPoints)
    informes["Newton"] = pd.DataFrame(
        {
            "Tabla de Diferencias (diferencias divididas)": [
                "\n".join(map(str, resultado_newton.get("difference_table", [])))
            ],
            "Coeficientes (de la forma de Newton)": [
                resultado_newton.get("coeficientes", [])
            ],
            "Polinomio (forma final)": [resultado_newton.get("polynomial", "")],
        }
    )

    comparables["Newton"] = len(informes["Newton"].columns)

    # Vandermonde
    resultado_vander = metodo_vandermonde(xPoints, yPoints)
    informes["Vandermonde"] = pd.DataFrame(
        {
            "Matriz Vandermonde (matriz del sistema)": [
                "\n".join(
                    [
                        ", ".join(map(str, fila))
                        for fila in resultado_vander.get("matrix", [])
                    ]
                )
            ],
            "Coeficientes (solución del sistema)": [
                resultado_vander.get("coeficientes", [])
            ],
            "Polinomio (forma final)": [resultado_vander.get("polynomial", "")],
        }
    )
    comparables["Vandermonde"] = len(informes["Vandermonde"].columns)

    # Spline Lineal
    resultado_lineal, _ = metodo_spline(xPoints, yPoints, tipo="lineal")
    informes["Spline Lineal"] = pd.DataFrame(
        {
            "Coeficientes (valores para cada tramo)": [
                resultado_lineal.get("coeficientes", [])
            ],
            "Splines (polinomios por intervalo)": [
                "\n".join(map(str, resultado_lineal.get("splines", [])))
            ],
            "Curva X (valores X de la gráfica)": [resultado_lineal.get("curvaX", [])],
            "Curva Y (valores Y de la gráfica)": [resultado_lineal.get("curvaY", [])],
        }
    )
    comparables["Spline Lineal"] = len(informes["Spline Lineal"].columns)

    # Spline Cúbico
    resultado_cubico, _ = metodo_spline(xPoints, yPoints, tipo="cubico")
    informes["Spline Cúbico"] = pd.DataFrame(
        {
            "Coeficientes (valores para cada tramo)": [
                resultado_cubico.get("coeficientes", [])
            ],
            "Splines (polinomios por intervalo)": [
                "\n".join(map(str, resultado_cubico.get("splines", [])))
            ],
            "Curva X (valores X de la gráfica)": [resultado_cubico.get("curvaX", [])],
            "Curva Y (valores Y de la gráfica)": [resultado_cubico.get("curvaY", [])],
        }
    )
    comparables["Spline Cúbico"] = len(informes["Spline Cúbico"].columns)

    # Resumen
    mejor_metodo = min(comparables, key=comparables.get)
    resumen = pd.DataFrame(
        {
            "Método": list(comparables.keys()),
            "Cantidad de columnas": list(comparables.values()),
            "Es mejor método": [m == mejor_metodo for m in comparables.keys()],
        }
    )

    # Generar archivo en memoria
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        for nombre, df in informes.items():
            df.to_excel(writer, sheet_name=nombre, index=False)
        resumen.to_excel(writer, sheet_name="Resumen", index=False)
    output.seek(0)

    return output, mejor_metodo
