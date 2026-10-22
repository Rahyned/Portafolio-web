import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import FeaturedCarousel from "./FeaturedCarousel";

export default function FeaturedProjects() {
  const { data } = useData();
  const { t } = useLanguage();
  const projects = data.FEATURED_PROJECTS || [];

  if (!projects.length) return null;

  return (
    <section className="featured-section" id="proyectos" aria-labelledby="featuredTitle">
      <div className="section-banner reveal">
        <h2 className="section-title" id="featuredTitle">{t("featured.title")}</h2>
        <p className="section-sub">{t("featured.sub")}</p>
      </div>

      <FeaturedCarousel projects={projects} />
    </section>
  );
}
