import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { data } = useData();
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <p className="footer-text"> {data.PROFILE.name} © 2026  </p>
      <nav className="footer-links" aria-label="Enlaces secundarios">
        <a href={data.CONTACT_INFO.cvUrl} className="footer-link" target="_blank" rel="noopener noreferrer">{t("footer.cv")}</a>
      </nav>
      <p className="footer-pixel" aria-hidden="true">▚▚▚▚</p>
    </footer>
  );
}
