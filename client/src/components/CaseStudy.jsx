import { CASE_STUDIES } from "../data/caseStudies";

export default function CaseStudy({ id = "solutionscars" }) {
  const study = CASE_STUDIES[id];

  if (!study) return null;

  return (
    <main className="case-study" id="main">
      <article className="case-wrap">
        <a className="case-back" href="/#proyectos">← Volver a proyectos</a>

        <header className="case-header">
          <p className="case-kicker">Caso de estudio</p>
          <h1 className="case-title">{study.title}</h1>
        </header>

        <section className="case-section">
          <h2>Resumen</h2>
          <p>{study.summary}</p>
        </section>

        <section className="case-section">
          <h2>Mi rol</h2>
          <p>{study.role}</p>
        </section>

        <section className="case-section">
          <h2>El problema</h2>
          <p>{study.problem}</p>
        </section>

        <section className="case-section">
          <h2>Qué construí</h2>
          <p>{study.built}</p>
        </section>

        <section className="case-section">
          <h2>Arquitectura</h2>
          <ul className="case-arch">
            {study.architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>Decisiones</h2>
          <ul>
            {study.decisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>Qué salió mal (y cómo lo resolví)</h2>
          <ul>
            {study.problems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>Qué aprendí</h2>
          <ul>
            {study.learned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>Próximos pasos</h2>
          <ul>
            {study.next.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>Capturas</h2>
          <div className="case-captures">
            <div className="case-capture">Captura próximamente</div>
            <div className="case-capture">Captura próximamente</div>
          </div>
        </section>

        <a className="case-back" href="/#proyectos">← Volver a proyectos</a>
      </article>
    </main>
  );
}
