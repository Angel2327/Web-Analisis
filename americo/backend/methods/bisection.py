def bisection_method(func, a, b, tol=1e-5, max_iter=100):
    import sympy as sp
    x = sp.symbols('x')
    f = sp.sympify(func)
    fa = f.subs(x, a)
    fb = f.subs(x, b)
    if fa * fb > 0:
        return {"error": "La función no cambia de signo en el intervalo."}
    results = []
    for i in range(max_iter):
        c = (a + b) / 2
        fc = f.subs(x, c)
        results.append({"iter": i+1, "a": a, "b": b, "c": c, "f(c)": fc})
        if abs(fc) < tol or (b - a)/2 < tol:
            return {"root": c, "iterations": i+1, "results": results}
        if fa * fc < 0:
            b = c
            fb = fc
        else:
            a = c
            fa = fc
    return {"error": "No se encontró raíz en el número máximo de iteraciones."}
