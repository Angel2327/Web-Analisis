from sympy import symbols, simplify, expand


def metodo_lagrange(xPoints, yPoints):
    if len(xPoints) != len(yPoints):
        raise ValueError("Los vectores X y Y deben tener la misma longitud")

    if len(set(xPoints)) != len(xPoints):
        raise ValueError("Los valores de X deben ser únicos para poder interpolar")

    n = len(xPoints)
    x = symbols("x")

    # Construcción de los polinomios base L_i(x) como strings
    lagrange_bases = []
    for i in range(n):
        numerador_terms = []
        denominador_terms = []
        for j in range(n):
            if i != j:
                numerador_terms.append(f"(x - {xPoints[j]})")
                denominador_terms.append(f"({xPoints[i]} - {xPoints[j]})")

        numerador = "".join(numerador_terms)
        denominador = "".join(denominador_terms)
        Li_str = f"{numerador}/{denominador}"
        lagrange_bases.append(Li_str)

    # Construcción del polinomio completo en forma sumatoria con coeficientes
    terms = []
    for i in range(n):
        terms.append(f"({yPoints[i]}*{lagrange_bases[i]})")

    expanded_poly = " + ".join(terms)

    # Opcional: polinomio simplificado como string (por si quieres enviarlo también)
    polynomial = 0
    for i in range(n):
        term = yPoints[i]
        for j in range(n):
            if i != j:
                term *= (x - xPoints[j]) / (xPoints[i] - xPoints[j])
        polynomial += term
    polynomial_simplified = str(simplify(expand(polynomial)))

    return {
        "lagrange_bases": lagrange_bases,
        "expanded_poly": expanded_poly,
        "polynomial_simplified": polynomial_simplified,
    }
