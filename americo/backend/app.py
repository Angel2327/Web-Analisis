from flask import Flask, request, jsonify
from flask_cors import CORS
from metodos.capitulo1.biseccion import metodo_biseccion
from metodos.capitulo1.regla_falsa import metodo_regla_falsa
from metodos.capitulo1.punto_fijo import metodo_punto_fijo
from metodos.capitulo1.newton import metodo_newton
from metodos.capitulo1.secante import metodo_secante
from metodos.capitulo1.raices_multiples import metodo_raices_multiples
from metodos.capitulo2.jacobi import metodo_jacobi
from metodos.capitulo2.gauss_seidel import metodo_gauss_seidel
from metodos.capitulo2.sor import metodo_sor

app = Flask(__name__)
CORS(app)

@app.route('/api/biseccion', methods=['POST'])
def biseccion():
    data = request.json
    funcion_str = data.get("funcion")
    a = data.get("a")
    b = data.get("b")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_biseccion(funcion_str, a, b, tol, max_iter)
    return jsonify(resultado), codigo

@app.route('/api/regla-falsa', methods=['POST'])
def regla_falsa():
    data = request.json
    funcion_str = data.get("funcion")
    a = data.get("a")
    b = data.get("b")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_regla_falsa(funcion_str, a, b, tol, max_iter)
    return jsonify(resultado), codigo

@app.route('/api/punto-fijo', methods=['POST'])
def punto_fijo():
    data = request.json
    funcion_str = data.get("funcion")
    g_funcion_str = data.get("g_funcion")
    x0 = data.get("x0")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_punto_fijo(funcion_str, g_funcion_str, x0, tol, max_iter)
    return jsonify(resultado), codigo

@app.route('/api/newton', methods=['POST'])
def newton():
    data = request.json
    funcion_str = data.get("funcion")
    x0 = data.get("x0")
    tol = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_newton(funcion_str, x0, tol, max_iter)
    return jsonify(resultado), codigo

@app.route('/api/secante', methods=['POST'])
def secante():
    data = request.json
    funcion = data.get("funcion")
    x0 = data.get("x0")
    x1 = data.get("x1")
    tolerancia = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_secante(funcion, x0, x1, tolerancia, max_iter)
    return jsonify(resultado), codigo

@app.route('/api/raices-multiples', methods=['POST'])
def raices_multiples():
    data = request.json
    funcion = data.get("funcion")
    x0 = data.get("x0")
    tolerancia = data.get("tolerancia")
    max_iter = data.get("max_iter")

    resultado, codigo = metodo_raices_multiples(funcion, x0, tolerancia, max_iter)
    return jsonify(resultado), codigo

@app.route('/api/jacobi', methods=['POST'])
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
        return jsonify({"error": "Tolerancia o número máximo de iteraciones inválidos."}), 400

    resultado, codigo = metodo_jacobi(matrizA, vectorB, x0, tolerancia, max_iter, norma)
    return jsonify(resultado), codigo

@app.route('/api/gauss-seidel', methods=['POST'])
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

if __name__ == '__main__':
    app.run(port=8000)
