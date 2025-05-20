from flask import Flask, request, jsonify
from flask_cors import CORS
from methods.bisection import bisection_method

app = Flask(__name__)
CORS(app)

@app.route('/api/bisection', methods=['POST'])
def bisection():
    data = request.json
    func = data.get('function')
    a = data.get('a')
    b = data.get('b')
    tol = data.get('tol', 1e-5)
    max_iter = data.get('max_iter', 100)

    # Validar que todos los datos estén presentes y sean correctos
    if func is None or a is None or b is None:
        return jsonify({"error": "Faltan parámetros obligatorios."}), 400

    try:
        a = float(a)
        b = float(b)
        tol = float(tol)
        max_iter = int(max_iter)
    except ValueError:
        return jsonify({"error": "Los parámetros numéricos no son válidos."}), 400

    result = bisection_method(func, a, b, tol, max_iter)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=8000)
