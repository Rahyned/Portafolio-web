import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";

const RARITIES = ["rarity-common", "rarity-rare", "rarity-epic"];

export default function Blog() {
  const { data } = useData();
  const { sfx } = useSound();

  return (
    <section className="blog-section" id="mochila" aria-labelledby="blogTitle">
      <div className="section-banner">
        <h2 className="section-title" id="blogTitle">MOCHILA — NOTAS TÉCNICAS</h2>
        <p className="section-sub">Artículos y anotaciones guardados en mi mochila.</p>
      </div>

      <div className="blog-grid reveal-stagger visible" aria-live="polite">
        {data.BLOG.map((post, i) => (
          <article
            key={post.id}
            className={`blog-card ${RARITIES[i % RARITIES.length]}`}
            onMouseEnter={() => sfx("hover")}
          >
            <div className="blog-card-top">
              <span className="blog-icon" aria-hidden="true">📦</span>
              <span className="blog-date">{post.date}</span>
            </div>
            <h3 className="blog-title">{post.title}</h3>
            <p className="blog-excerpt">{post.excerpt}</p>
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">{tag}</span>
              ))}
            </div>
            <div className="blog-footer">
              {post.link ? (
                <a className="blog-link" href={post.link} target="_blank" rel="noopener noreferrer">LEER NOTA →</a>
              ) : (
                <span className="blog-link disabled">PRÓXIMAMENTE</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
