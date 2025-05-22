from flask import Flask, request, jsonify
from flask_cors import CORS
from metodos.biseccion import metodo_biseccion
from metodos.regla_falsa import metodo_regla_falsa
from metodos.punto_fijo import metodo_punto_fijo
from metodos.newton import metodo_newton
from metodos.secante import metodo_secante
from metodos.raices_multiples import metodo_raices_multiples


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

if __name__ == '__main__':
    app.run(port=8000)
