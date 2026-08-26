import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { data } = useData();
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <p className="footer-text">© 2024 {data.PROFILE.name} | Diseño &amp; Código custom</p>
      <nav className="footer-links" aria-label="Enlaces secundarios">
        <a href="cv.html" className="footer-link" target="_blank" rel="noopener noreferrer">{t("footer.cv")}</a>
      </nav>
      <p className="footer-pixel" aria-hidden="true">▚▚▚▚</p>
    </footer>
  );
}
