from flask import Flask, request, jsonify
from flask_cors import CORS
from metodos.biseccion import metodo_biseccion

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

if __name__ == '__main__':
    app.run(port=8000)
