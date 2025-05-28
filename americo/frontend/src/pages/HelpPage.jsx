import React, { useState } from "react";
import "./HelpPage.css";

const AccordionItem = ({ title, children, isOpen, onClick, id }) => {
  return (
    <div className="accordion-item">
      <button
        className={`accordion-header ${isOpen ? "open" : ""}`}
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`section-${id}`}
        id={`accordion-${id}`}
      >
        <span>{title}</span>
        <svg
          className="accordion-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        id={`section-${id}`}
        role="region"
        aria-labelledby={`accordion-${id}`}
        className={`accordion-panel ${isOpen ? "open" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-container">
      <div className="help-content">
        <h1 className="help-title">Ayuda para AMerico</h1>

        <AccordionItem
          id={1}
          title="¿Cómo usar la aplicación?"
          isOpen={openIndex === 1}
          onClick={() => toggleIndex(1)}
        >
          <p>
            Esta aplicación te permite experimentar con métodos numéricos para
            resolver problemas matemáticos. Navega a través de los capítulos y
            métodos para ingresar tus datos, obtener resultados y comparar
            métodos.
          </p>
          <p>
            Usa los botones y formularios en cada sección para ingresar tus
            puntos o datos, y genera informes en Excel si lo deseas.
          </p>
        </AccordionItem>

        <AccordionItem
          id={2}
          title="Capítulo 1: Ingreso y uso de puntos"
          isOpen={openIndex === 2}
          onClick={() => toggleIndex(2)}
        >
          <p>
            En este capítulo se trabaja con métodos que requieren ingresar
            puntos específicos con coordenadas X y Y. Puedes ingresar de 2 a 8
            puntos.
          </p>
          <p>
            Asegúrate que cada punto tenga valores numéricos y que las X no se
            repitan para evitar errores.
          </p>
          <p>
            Una vez ingresados, podrás ver el resultado de la interpolación y la
            gráfica que muestra cómo el método aproxima los datos.
          </p>
        </AccordionItem>

        <AccordionItem
          id={3}
          title="Capítulo 2: Interpretación de resultados"
          isOpen={openIndex === 3}
          onClick={() => toggleIndex(3)}
        >
          <p>
            Después de procesar tus datos, la aplicación muestra polinomios,
            tablas y gráficas que ayudan a entender cómo funciona cada método.
          </p>
          <p>
            Por ejemplo, podrás ver el polinomio generado, sus coeficientes, y
            la forma en que aproxima los puntos originales.
          </p>
          <p>
            Revisa cada sección con cuidado para comprender mejor el
            comportamiento de los métodos.
          </p>
        </AccordionItem>

        <AccordionItem
          id={4}
          title="Capítulo 3: Métodos avanzados (Lagrange, Newton, Spline y Vandermonde)"
          isOpen={openIndex === 4}
          onClick={() => toggleIndex(4)}
        >
          <p>
            Aquí trabajas con métodos específicos que ayudan a crear polinomios
            que pasan por tus puntos.
            <strong>Por ejemplo:</strong>
          </p>
          <ul>
            <li>
              <strong>Lagrange:</strong> Crea un polinomio único que pasa por
              todos los puntos dados.
            </li>
            <li>
              <strong>Newton:</strong> Usa diferencias divididas para calcular
              el polinomio paso a paso.
            </li>
            <li>
              <strong>Spline:</strong> Crea curvas suaves entre puntos para una
              mejor aproximación.
            </li>
            <li>
              <strong>Vandermonde:</strong> Usa matrices para obtener los
              coeficientes del polinomio.
            </li>
          </ul>
          <p>
            Para ingresar puntos, el rango es similar (2 a 8), y los resultados
            incluyen tablas y gráficos detallados que puedes descargar.
          </p>
        </AccordionItem>

        <AccordionItem
          id={5}
          title="Errores comunes y cómo solucionarlos"
          isOpen={openIndex === 5}
          onClick={() => toggleIndex(5)}
        >
          <p>Algunos errores comunes son:</p>
          <ul>
            <li>Ingresar valores no numéricos o vacíos.</li>
            <li>Repetir valores de X cuando no es permitido.</li>
            <li>Dejar puntos incompletos.</li>
          </ul>
          <p>
            Asegúrate de revisar tus datos antes de enviar y si tienes dudas,
            intenta con ejemplos sencillos primero.
          </p>
        </AccordionItem>

        <AccordionItem
          id={6}
          title="Contacto y soporte"
          isOpen={openIndex === 6}
          onClick={() => toggleIndex(6)}
        >
          <p>
            Si tienes preguntas o necesitas ayuda, puedes escribirme a:{" "}
            <a href="mailto:angel@example.com">angelydiego2323@gmail.com</a>
          </p>
          <p>
            Estoy aquí para ayudarte a aprovechar esta aplicación al máximo.
          </p>
        </AccordionItem>
      </div>

      <footer className="help-footer">
        <p>© 2025 AMerico - Ingeniería de Sistemas</p>
      </footer>
    </div>
  );
}
