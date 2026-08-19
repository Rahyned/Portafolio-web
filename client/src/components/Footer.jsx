import { useData } from "../context/DataContext";

export default function Footer() {
  const { data } = useData();

  return (
    <footer className="site-footer">
      <p className="footer-text">© 2024 {data.PROFILE.name} | Diseño &amp; Código custom</p>
      <nav className="footer-links" aria-label="Enlaces secundarios">
        <a href="cv.html" className="footer-link" target="_blank" rel="noopener noreferrer">📄 CV DESCARGABLE</a>
      </nav>
      <p className="footer-pixel" aria-hidden="true">▚▚▚▚</p>
    </footer>
  );
}
