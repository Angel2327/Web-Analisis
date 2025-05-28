import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">Sobre esta plataforma</h1>
        <p className="about-description">
          Este sitio web muestra diversos métodos de análisis numérico aplicados
          en el área de ingeniería, organizados por capítulos: desde métodos de
          una variable y sistemas de ecuaciones lineales, hasta métodos de
          interpolación y ajuste de curvas.
        </p>

        <h2 className="about-subtitle">
          📦 Bibliotecas y herramientas utilizadas:
        </h2>
        <ul className="about-list">
          <li>
            <strong>math.js</strong>: Biblioteca matemática completa para
            JavaScript que permite evaluar funciones simbólicas, realizar
            cálculos numéricos y operaciones algebraicas.
          </li>
          <li>
            <strong>function-plot</strong>: Herramienta basada en D3.js para
            graficar funciones matemáticas en dos dimensiones.
          </li>
          <li>
            <strong>react-katex</strong>: Muestra expresiones matemáticas usando
            el motor KaTeX, ideal para fórmulas complejas y polinomios.
          </li>
          <li>
            <strong>xlsx</strong>: Para la generación de reportes en Excel
            descargables desde cada vista.
          </li>
          <li>
            <strong>FontAwesome</strong>: Biblioteca de íconos que mejora la
            experiencia visual de la interfaz.
          </li>
          <li>
            <strong>React Router DOM</strong>: Para la navegación entre las
            distintas secciones del sitio.
          </li>
        </ul>

        <h2 className="about-subtitle">🛠 Funcionalidades destacadas:</h2>
        <ul className="about-list">
          <li>
            Ingreso estructurado de datos para cada capítulo con validaciones.
          </li>
          <li>Visualización gráfica de funciones, polinomios e iteraciones.</li>
          <li>
            Generación de informes comparativos en Excel (por método o
            generales).
          </li>
          <li>
            Ayuda contextual por capítulo para guiar al usuario paso a paso.
          </li>
          <li>
            Cálculos realizados en módulos independientes para mantener una
            arquitectura limpia y organizada.
          </li>
        </ul>

        <h2 className="about-subtitle">👨‍💻 ¿Quieres colaborar?</h2>
        <p className="about-description">
          Si deseas contribuir al desarrollo, explorar el código fuente o
          instalarlo localmente, visita la página oficial del repositorio en
          GitHub:
        </p>
        <a
          href="https://github.com/Angel2327/Web-Analisis"
          className="github-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 github.com/Angel2327/Web-Analisis
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
