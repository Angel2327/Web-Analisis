import io
import pandas as pd
from metodos.capitulo1.biseccion import metodo_biseccion
from metodos.capitulo1.regla_falsa import metodo_regla_falsa
from metodos.capitulo1.punto_fijo import metodo_punto_fijo
from metodos.capitulo1.newton import metodo_newton
from metodos.capitulo1.secante import metodo_secante
from metodos.capitulo1.raices_multiples import metodo_raices_multiples
from metodos.capitulo2.jacobi import metodo_jacobi
from metodos.capitulo2.gauss_seidel import metodo_gauss_seidel
from metodos.capitulo2.sor import metodo_sor
from metodos.capitulo3.lagrange import metodo_lagrange
from metodos.capitulo3.newton_interpolante import metodo_newton_interpolante
from metodos.capitulo3.vandermonde import metodo_vandermonde
from metodos.capitulo3.spline import metodo_spline


def generar_informe_individual_cap1(nombre_metodo, datos_dict):
    datos_entrada = datos_dict["datos"]

    if nombre_metodo == "biseccion":
        resultado, _ = metodo_biseccion(
            datos_entrada["funcion"],
            datos_entrada["a"],
            datos_entrada["b"],
            datos_entrada["tolerancia"],
            datos_entrada["max_iter"],
        )

    elif nombre_metodo == "regla-falsa":
        resultado, _ = metodo_regla_falsa(
            datos_entrada["funcion"],
            datos_entrada["a"],
            datos_entrada["b"],
            datos_entrada["tolerancia"],
            datos_entrada["max_iter"],
        )

    elif nombre_metodo == "newton":
        resultado, _ = metodo_newton(
            datos_entrada["funcion"],
            datos_entrada["x0"],
            datos_entrada["tolerancia"],
            datos_entrada["max_iter"],
        )

    elif nombre_metodo == "punto-fijo":
        resultado, _ = metodo_punto_fijo(
            datos_entrada["funcion"],
            datos_entrada["g_funcion"],
            datos_entrada["x0"],
            datos_entrada["tolerancia"],
            datos_entrada["max_iter"],
        )

    elif nombre_metodo == "raices-multiples":
        resultado, _ = metodo_raices_multiples(
            datos_entrada["funcion"],
            datos_entrada["x0"],
            datos_entrada["tolerancia"],
            datos_entrada["max_iter"],
        )

    elif nombre_metodo == "secante":
        resultado, _ = metodo_secante(
            datos_entrada["funcion"],
            datos_entrada["x0"],
            datos_entrada["x1"],
            datos_entrada["tolerancia"],
            datos_entrada["max_iter"],
        )

    else:
        raise ValueError("Método no reconocido")

    df = pd.DataFrame(resultado["tabla"])

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Resultados")
    output.seek(0)

    return output


def generar_informe_individual_cap2(
    nombre_metodo, A, b, x0, tol, max_iter, norma, omega=None
):

    if nombre_metodo == "jacobi":
        resultado, _ = metodo_jacobi(A, b, x0, tol, max_iter, norma)
        data = {
            "Iteraciones": [
                "\n".join(
                    f"Iteración {fila['iteracion']}: "
                    + ", ".join(f"{k} = {v:.6f}" for k, v in fila["x"].items())
                    + f", Error = {fila['error']:.6f}"
                    for fila in resultado.get("tabla", [])
                )
            ],
            "Radio Espectral": [resultado.get("radio_espectral")],
            "Converge": ["Sí" if resultado.get("converge") else "No"],
        }
        df = pd.DataFrame(data)
    elif nombre_metodo == "gauss-seidel":
        resultado = metodo_gauss_seidel(A, b, x0, tol, max_iter, norma)
        data = {
            "Iteraciones": [
                "\n".join(
                    f"Iteración {fila['iteracion']}: "
                    + ", ".join(f"{k} = {v:.6f}" for k, v in fila["x"].items())
                    + f", Error = {fila['error']:.6f}"
                    for fila in resultado.get("tabla", [])
                )
            ],
            "Radio Espectral": [resultado.get("radio_espectral")],
            "Converge": ["Sí" if resultado.get("converge") else "No"],
        }
        df = pd.DataFrame(data)
    elif nombre_metodo == "sor":
        resultado = metodo_sor(A, b, x0, tol, max_iter, norma, omega or 1.0)
        data = {
            "Iteraciones": [
                "\n".join(
                    f"Iteración {fila['iteracion']}: "
                    + ", ".join(f"{k} = {v:.6f}" for k, v in fila["x"].items())
                    + f", Error = {fila['error']:.6f}"
                    for fila in resultado.get("tabla", [])
                )
            ],
            "Radio Espectral": [resultado.get("radio_espectral")],
            "Converge": ["Sí" if resultado.get("converge") else "No"],
        }
        df = pd.DataFrame(data)
    else:
        raise ValueError("Método no reconocido")

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name=nombre_metodo.capitalize())
    output.seek(0)

    return output


def generar_informe_general_cap2(A, b, x0, tol, max_iter, norma):
    informes = {}
    comparables = {}

    # Jacobi
    jac, _ = metodo_jacobi(A, b, x0, tol, max_iter, norma)
    data_jacobi = {
        "Iteraciones": [
            "\n".join(
                f"Iteración {fila['iteracion']}: "
                + ", ".join(f"{k} = {v:.6f}" for k, v in fila["x"].items())
                + f", Error = {fila['error']:.6f}"
                for fila in jac.get("tabla", [])
            )
        ],
        "Radio Espectral": [jac.get("radio_espectral")],
        "Converge": ["Sí" if jac.get("converge") else "No"],
    }
    informes["Jacobi"] = pd.DataFrame(data_jacobi)
    comparables["Jacobi"] = jac.get("radio_espectral", float("inf"))

    # Gauss-Seidel
    gs = metodo_gauss_seidel(A, b, x0, tol, max_iter, norma)
    data_gs = {
        "Iteraciones": [
            "\n".join(
                f"Iteración {fila['iteracion']}: "
                + ", ".join(f"{k} = {v:.6f}" for k, v in fila["x"].items())
                + f", Error = {fila['error']:.6f}"
                for fila in gs.get("tabla", [])
            )
        ],
        "Radio Espectral": [gs.get("radio_espectral")],
        "Converge": ["Sí" if gs.get("converge") else "No"],
    }
    informes["Gauss-Seidel"] = pd.DataFrame(data_gs)
    comparables["Gauss-Seidel"] = gs.get("radio_espectral", float("inf"))

    # SOR con ω = 0.5
    sor_05 = metodo_sor(A, b, x0, tol, max_iter, norma, 0.5)
    data_sor05 = {
        "Iteraciones": [
            "\n".join(
                f"Iteración {fila['iteracion']}: "
                + ", ".join(f"{k} = {v:.6f}" for k, v in fila["x"].items())
                + f", Error = {fila['error']:.6f}"
                for fila in sor_05.get("tabla", [])
            )
        ],
        "Radio Espectral": [sor_05.get("radio_espectral")],
        "Converge": ["Sí" if sor_05.get("converge") else "No"],
    }
    informes["SOR (ω=0.5)"] = pd.DataFrame(data_sor05)
    comparables["SOR (ω=0.5)"] = sor_05.get("radio_espectral", float("inf"))

    # SOR con ω = 1.5
    sor_15 = metodo_sor(A, b, x0, tol, max_iter, norma, 1.5)
    data_sor15 = {
        "Iteraciones": [
            "\n".join(
                f"Iteración {fila['iteracion']}: "
                + ", ".join(f"{k} = {v:.6f}" for k, v in fila["x"].items())
                + f", Error = {fila['error']:.6f}"
                for fila in sor_15.get("tabla", [])
            )
        ],
        "Radio Espectral": [sor_15.get("radio_espectral")],
        "Converge": ["Sí" if sor_15.get("converge") else "No"],
    }
    informes["SOR (ω=1.5)"] = pd.DataFrame(data_sor15)
    comparables["SOR (ω=1.5)"] = sor_15.get("radio_espectral", float("inf"))

    # Determinar mejor método (menor radio espectral)
    mejor_metodo = min(comparables, key=comparables.get)
    resumen = pd.DataFrame(
        {
            "Método": list(comparables.keys()),
            "Radio Espectral": list(comparables.values()),
            "Es Mejor Método": [m == mejor_metodo for m in comparables.keys()],
        }
    )

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        for nombre, df in informes.items():
            df.to_excel(writer, index=False, sheet_name=nombre)
        resumen.to_excel(writer, index=False, sheet_name="Resumen")
    output.seek(0)

    return output, mejor_metodo


def generar_informe_individual_cap3(nombre_metodo, xPoints, yPoints, tipo_spline=None):
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

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name=nombre_metodo.capitalize())
    output.seek(0)

    return output


def generar_informe_general_cap3(xPoints, yPoints):
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
