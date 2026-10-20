import { useLanguage } from "../context/LanguageContext";

const MEDIA_SIZE = {
  "/media/rag-demo.gif": { width: 780, height: 560 },
  "/media/pronostico.png": { width: 1320, height: 600 }
};

export default function ProjectCard({ project }) {
  const { t } = useLanguage();
  const { title, status, since, problem, built, stack, result, links, media, private: isPrivate } = project;

  const hasLinks = links.length > 0;
  const privateText = project.id === "stella" ? t("featured.clientPrivate") : t("featured.repoPrivate");
  const size = MEDIA_SIZE[media.src] || { width: 1200, height: 675 };

  return (
    <article className="featured-card">
      <header className="featured-card-head">
        <h3 className="featured-card-title">
          {title} <span className="featured-card-meta">· {status}{since ? ` · ${since}` : ""}</span>
        </h3>
      </header>

      {media.type === "placeholder" ? (
        <div className="featured-media-placeholder" role="img" aria-label={media.alt}>
          {media.alt}
        </div>
      ) : (
        <img
          className="featured-media"
          src={media.src}
          alt={media.alt}
          width={size.width}
          height={size.height}
          loading="lazy"
          decoding="async"
        />
      )}

      <div className="featured-block">
        <h4>{t("featured.problem")}</h4>
        <p>{problem}</p>
      </div>

      <div className="featured-block">
        <h4>{t("featured.built")}</h4>
        <p>{built}</p>
      </div>

      <div className="featured-block">
        <h4>{t("featured.stack")}</h4>
        <div className="featured-stack">
          {stack.map((tech) => (
            <span key={tech} className="featured-chip">{tech}</span>
          ))}
        </div>
      </div>

      <div className="featured-block">
        <h4>{t("featured.result")}</h4>
        <p>{result}</p>
      </div>

      <div className="featured-block featured-block-links">
        <h4>{t("featured.links")}</h4>
        {hasLinks ? (
          <div className="featured-links">
            {links.map((link) => (
              link.url.startsWith("/") ? (
                <a key={link.label} href={link.url} className="btn-link">{link.label}</a>
              ) : (
                <a key={link.label} href={link.url} className="btn-link" target="_blank" rel="noopener noreferrer">{link.label}</a>
              )
            ))}
          </div>
        ) : (
          isPrivate ? <p className="featured-private">{privateText}</p> : null
        )}
      </div>
    </article>
  );
}
