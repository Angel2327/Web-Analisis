from flask import Flask, request, jsonify
from flask_cors import CORS
import sympy as sp
from flask import send_file
from utils.generar_informe_excel import (
    generar_informe_individual_cap1,
    generar_informe_individual_cap2,
    generar_informe_general_cap2,
    generar_informe_individual_cap3,
    generar_informe_general_cap3,
)
from utils.graficar_funcion import graficar_funcion
from metodos.capitulo1.biseccion import metodo_biseccion
from metodos.capitulo1.regla_falsa import metodo_regla_falsa
from metodos.capitulo1.punto_fijo import metodo_punto_fijo
from metodos.capitulo1.newton import metodo_newton
from metodos.capitulo1.secante import metodo_secante
from metodos.capitulo1.raices_multiples import metodo_raices_multiples
from metodos.capitulo2.jacobi import metodo_jacobi
from metodos.capitulo2.gauss_seidel import metodo_gauss_seidel
from metodos.capitulo2.sor import metodo_sor
from metodos.capitulo3.vandermonde import metodo_vandermonde
from metodos.capitulo3.newton_interpolante import metodo_newton_interpolante
from metodos.capitulo3.lagrange import metodo_lagrange
from metodos.capitulo3.spline import metodo_spline

app = Flask(__name__)
CORS(app)


@app.route("/api/derivada", methods=["POST"])
def derivada():
    data = request.json
    funcion_str = data.get("funcion", "")
    x = sp.symbols("x")
    try:
        f_expr = sp.sympify(funcion_str)
        f_deriv = sp.diff(f_expr, x)
        if f_deriv == 0:
            mensaje = "Esta función no tiene derivada."
        else:
            mensaje = f"{str(f_deriv)}"
    except Exception:
        mensaje = "No se pudo calcular la derivada."
    return jsonify({"derivada_mensaje": mensaje})


@app.route("/api/graficar-funcion", methods=["POST"])
def graficar_funcion_endpoint():
    try:
        data = request.get_json()
        funcion_str = data.get("funcion")
        x_min = data.get("x_min", -10)
        x_max = data.get("x_max", 10)
        puntos = data.get("puntos", 500)

        if not funcion_str:
            return jsonify({"message": "Debe proporcionar una función válida"}), 400

        resultado, codigo = graficar_funcion(funcion_str, x_min, x_max, puntos)
        return jsonify(resultado), codigo

    except Exception as e:
        return jsonify({"message": f"Error interno: {str(e)}"}), 500


@app.route("/api/biseccion", methods=["POST"])
def biseccion():
    data = request.json
    funcion_str = data.get("funcion")
    a = data.get("a")
    b = data.get("b")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_biseccion(funcion_str, a, b, tol, max_iter)
    return jsonify(resultado), codigo


@app.route("/api/regla-falsa", methods=["POST"])
def regla_falsa():
    data = request.json
    funcion_str = data.get("funcion")
    a = data.get("a")
    b = data.get("b")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_regla_falsa(funcion_str, a, b, tol, max_iter)
    return jsonify(resultado), codigo


@app.route("/api/punto-fijo", methods=["POST"])
def punto_fijo():
    data = request.json
    funcion_str = data.get("funcion")
    g_funcion_str = data.get("g_funcion")
    x0 = data.get("x0")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_punto_fijo(funcion_str, g_funcion_str, x0, tol, max_iter)
    return jsonify(resultado), codigo


@app.route("/api/newton", methods=["POST"])
def newton():
    data = request.json
    funcion_str = data.get("funcion")
    x0 = data.get("x0")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_newton(funcion_str, x0, tol, max_iter)
    return jsonify(resultado), codigo


@app.route("/api/secante", methods=["POST"])
def secante():
    data = request.json
    funcion = data.get("funcion")
    x0 = data.get("x0")
    x1 = data.get("x1")
    tolerancia = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_secante(funcion, x0, x1, tolerancia, max_iter)
    return jsonify(resultado), codigo


@app.route("/api/raices-multiples", methods=["POST"])
def raices_multiples():
    data = request.json
    funcion = data.get("funcion")
    x0 = data.get("x0")
    tolerancia = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_raices_multiples(funcion, x0, tolerancia, max_iter)
    return jsonify(resultado), codigo


@app.route("/api/jacobi", methods=["POST"])
def jacobi():
    data = request.json
    matrizA = data.get("matrix")
    vectorB = data.get("vector")
    x0 = data.get("x0")

    tolerancia = data.get("tolerance")
    max_iter = data.get("iterations")
    norma = data.get("norm")

    try:
        tolerancia = float(tolerancia)
        max_iter = int(max_iter)
    except Exception:
        return (
            jsonify({"error": "Tolerancia o número máximo de iteraciones inválidos."}),
            400,
        )

    resultado, codigo = metodo_jacobi(matrizA, vectorB, x0, tolerancia, max_iter, norma)
    return jsonify(resultado), codigo


@app.route("/api/gauss-seidel", methods=["POST"])
def gauss_seidel():
    data = request.json
    matrizA = data.get("matrix")
    vectorB = data.get("vector")
    x0 = data.get("x0")
    tolerancia = data.get("tolerance")
    max_iter = data.get("iterations")
    norma = data.get("norm")

    resultado = metodo_gauss_seidel(matrizA, vectorB, x0, tolerancia, max_iter, norma)
    return jsonify(resultado), 200


@app.route("/api/sor", methods=["POST"])
def sor():
    data = request.get_json()
    matriz = data.get("matrix")
    vector = data.get("vector")
    x0 = data.get("x0")
    tolerance = data.get("tolerance")
    iterations = data.get("iterations")
    norm = data.get("norm")
    omega = data.get("omega")

    resultado = metodo_sor(matriz, vector, x0, tolerance, iterations, norm, omega)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]["error"]}), resultado[1]
    return jsonify(resultado)


@app.route("/api/vandermonde", methods=["POST"])
def vandermonde():
    try:
        data = request.json
        xPoints = data.get("xPoints", [])
        yPoints = data.get("yPoints", [])

        if not xPoints or not yPoints:
            return jsonify({"message": "Debe proporcionar puntos X e Y"}), 400

        resultado = metodo_vandermonde(xPoints, yPoints)
        return jsonify(resultado)

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "Error interno en el servidor"}), 500


@app.route("/api/newton-interpolante", methods=["POST"])
def newton_interpolante():
    try:
        data = request.json
        xPoints = data.get("xPoints", [])
        yPoints = data.get("yPoints", [])

        if not xPoints or not yPoints:
            return jsonify({"message": "Debe proporcionar puntos X e Y"}), 400

        resultado = metodo_newton_interpolante(xPoints, yPoints)
        return jsonify(resultado)

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "Error interno en el servidor"}), 500


@app.route("/api/lagrange", methods=["POST"])
def lagrange():
    try:
        data = request.json
        xPoints = data.get("xPoints", [])
        yPoints = data.get("yPoints", [])

        if not xPoints or not yPoints:
            return jsonify({"message": "Debe proporcionar puntos X e Y"}), 400

        resultado = metodo_lagrange(xPoints, yPoints)
        return jsonify(resultado)

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "Error interno en el servidor"}), 500


@app.route("/api/spline", methods=["POST"])
def spline():
    try:
        data = request.json
        xPoints = data.get("xPoints", [])
        yPoints = data.get("yPoints", [])
        tipo = data.get("tipo", "lineal")

        if not xPoints or not yPoints:
            return jsonify({"message": "Debe proporcionar puntos X e Y"}), 400

        resultado, codigo = metodo_spline(xPoints, yPoints, tipo)

        if codigo != 200:
            return jsonify(resultado), codigo

        return jsonify(resultado), 200

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception:
        return jsonify({"message": "Error interno en el servidor"}), 500


@app.route("/api/informe-individual-cap1", methods=["POST"])
def informe_individual_cap1():
    try:
        data = request.json
        metodo = data.get("metodo")

        if not metodo:
            return jsonify({"message": "Método no especificado"}), 400

        archivo_excel = generar_informe_individual_cap1(metodo, data)

        return send_file(
            archivo_excel,
            as_attachment=True,
            download_name=f"informe_{metodo}.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    except Exception as e:
        print(f"Error interno: {e}")
        return (
            jsonify({"message": f"Error generando informe individual: {str(e)}"}),
            500,
        )


@app.route("/api/informe-individual-cap2", methods=["POST"])
def informe_individual_cap2():
    try:
        data = request.json
        metodo = data.get("metodo")
        matrizA = data.get("matrizA")
        vectorB = data.get("vectorB")
        x0 = data.get("x0")
        tol = data.get("tol")
        max_iter = data.get("max_iter")
        norma = data.get("norma", "inf")
        omega = data.get("omega", "1.0")

        if not metodo or matrizA is None or vectorB is None or x0 is None:
            return jsonify({"message": "Datos incompletos"}), 400

        archivo_excel = generar_informe_individual_cap2(
            metodo, matrizA, vectorB, x0, tol, max_iter, norma, omega
        )

        return send_file(
            archivo_excel,
            as_attachment=True,
            download_name=f"informe_{metodo}.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    except Exception as e:
        return (
            jsonify({"message": f"Error generando informe individual: {str(e)}"}),
            500,
        )


@app.route("/api/informe-general-cap2", methods=["POST"])
def informe_general_cap2():
    try:
        data = request.json
        matrizA = data.get("matrizA")
        vectorB = data.get("vectorB")
        x0 = data.get("x0")
        tol = data.get("tol")
        max_iter = data.get("max_iter")
        norma = data.get("norma", "inf")

        if matrizA is None or vectorB is None or x0 is None:
            return (
                jsonify({"message": "Debe proporcionar todos los datos necesarios"}),
                400,
            )

        archivo_excel, mejor_metodo = generar_informe_general_cap2(
            matrizA, vectorB, x0, tol, max_iter, norma
        )

        return send_file(
            archivo_excel,
            as_attachment=True,
            download_name="informe_general_capitulo2.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    except Exception as e:
        return jsonify({"message": f"Error generando informe general: {str(e)}"}), 500


@app.route("/api/informe-individual-cap3", methods=["POST"])
def informe_individual():
    try:
        data = request.json
        metodo = data.get("metodo")
        xPoints = data.get("xPoints", [])
        yPoints = data.get("yPoints", [])
        tipo_spline = data.get("tipo_spline", "lineal")

        if not metodo or not xPoints or not yPoints:
            return jsonify({"message": "Datos incompletos"}), 400

        archivo_excel = generar_informe_individual_cap3(
            metodo, xPoints, yPoints, tipo_spline
        )

        return send_file(
            archivo_excel,
            as_attachment=True,
            download_name=f"informe_{metodo}.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    except Exception as e:
        return (
            jsonify({"message": f"Error generando informe individual: {str(e)}"}),
            500,
        )


@app.route("/api/informe-general-cap3", methods=["POST"])
def informe_general():
    try:
        data = request.json
        xPoints = data.get("xPoints", [])
        yPoints = data.get("yPoints", [])

        if not xPoints or not yPoints:
            return jsonify({"message": "Debe proporcionar puntos X e Y"}), 400

        archivo_excel, _ = generar_informe_general_cap3(xPoints, yPoints)

        return send_file(
            archivo_excel,
            as_attachment=True,
            download_name="informe_general_capitulo3.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    except Exception as e:
        return jsonify({"message": f"Error generando informe general: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)
