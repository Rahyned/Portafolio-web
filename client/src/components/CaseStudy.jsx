import { CASE_STUDIES } from "../data/caseStudies";
import { useLanguage } from "../context/LanguageContext";

export default function CaseStudy({ id = "solutionscars" }) {
  const { lang, t } = useLanguage();
  const entry = CASE_STUDIES[id];
  const cs = entry?.[lang] ?? entry?.es;

  if (!cs) return null;

  return (
    <main className="case-study" id="main">
      <article className="case-wrap">
        <a className="case-back" href="/#proyectos">{t("case.back")}</a>

        <header className="case-header">
          <p className="case-kicker">{t("case.kicker")}</p>
          <h1 className="case-title">{cs.title}</h1>
        </header>

        <section className="case-section">
          <h2>{t("case.summary")}</h2>
          <p>{cs.summary}</p>
        </section>

        <section className="case-section">
          <h2>{t("case.role")}</h2>
          <p>{cs.role}</p>
        </section>

        <section className="case-section">
          <h2>{t("case.problem")}</h2>
          <p>{cs.problem}</p>
        </section>

        <section className="case-section">
          <h2>{t("case.built")}</h2>
          <p>{cs.built}</p>
        </section>

        <section className="case-section">
          <h2>{t("case.architecture")}</h2>
          <ul className="case-arch">
            {cs.architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>{t("case.decisions")}</h2>
          <ul>
            {cs.decisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>{t("case.problems")}</h2>
          <ul>
            {cs.problems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>{t("case.learned")}</h2>
          <ul>
            {cs.learned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>{t("case.next")}</h2>
          <ul>
            {cs.next.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-section">
          <h2>{t("case.captures")}</h2>
          <div className="case-captures">
            <div className="case-capture">{t("case.capture")}</div>
            <div className="case-capture">{t("case.capture")}</div>
          </div>
        </section>

        <a className="case-back" href="/#proyectos">{t("case.back")}</a>
      </article>
    </main>
  );
}
