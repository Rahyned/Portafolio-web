// ============================================================
// MAIN - Inicialización, Konami code, scroll reveal.
// ============================================================

(() => {
  const KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  let konamiIndex = 0;
  let konamiActive = false;

  document.addEventListener("DOMContentLoaded", async () => {
    await DataLoader.load();
    Analytics.init();
    ThemeManager.init();
    SoundManager.setMuted(SoundManager.isMuted());
    populateProfile();
    populateBadges();
    populateContact();
    renderBlog();
    PCStorage.init();
    Modal.init();
    ContactManager.init();
    Terminal.init();
    initHero();
    initBio();
    initNav();
    initKonami();
    initScrollReveal();
    initLogo();
  });

  // ---------- Datos del perfil ----------
  function populateProfile() {
    document.getElementById("trainerName").textContent = PROFILE.name;
    document.getElementById("statClass").textContent = PROFILE.class;
    document.getElementById("statLevel").textContent = `${PROFILE.level} / ${PROFILE.maxLevel}`;
    document.getElementById("statExp").textContent = PROFILE.expYears;
    document.getElementById("statProjects").textContent = PROFILE.completedProjects;
    document.getElementById("statLocation").textContent = PROFILE.location;
    document.getElementById("expLevelText").textContent = `Nv. ${PROFILE.level}/${PROFILE.maxLevel}`;
    document.getElementById("statusBadge").textContent = PROFILE.status;
    document.getElementById("headerName").textContent = PROFILE.displayName;
    document.getElementById("footerText").textContent = `© 2024 ${PROFILE.name} | Diseño & Código custom`;

    const fill = document.getElementById("expBarFill");
    requestAnimationFrame(() => {
      fill.style.width = `${Math.round((PROFILE.level / PROFILE.maxLevel) * 100)}%`;
    });
  }

  // ---------- Medallas de stack ----------
  function populateBadges() {
    const container = document.getElementById("badgesContainer");
    BADGES.forEach((badge, i) => {
      const el = document.createElement("span");
      el.className = "badge badge-owned";
      el.innerHTML = `<span class="badge-icon" aria-hidden="true">${badge.icon}</span> ${badge.name}`;
      el.addEventListener("mouseenter", () => SoundManager.sfx.hover());
      container.appendChild(el);
    });
  }

  // ---------- Datos de contacto ----------
  function populateContact() {
    document.getElementById("contactEmail").textContent = CONTACT_INFO.email;
    document.getElementById("contactLinkedin").textContent = CONTACT_INFO.linkedin;
    document.getElementById("contactGithub").textContent = CONTACT_INFO.github;
  }

  // ---------- Mochila / Blog ----------
  function renderBlog() {
    const grid = document.getElementById("blogGrid");
    if (!grid) return;
    grid.innerHTML = "";

    BLOG.forEach((post) => {
      const card = document.createElement("article");
      card.className = "blog-card";
      card.addEventListener("mouseenter", () => SoundManager.sfx.hover());

      const tags = post.tags.map((t) => `<span class="blog-tag">${t}</span>`).join("");
      const link = post.link
        ? `<a class="blog-link" href="${post.link}" target="_blank" rel="noopener noreferrer">LEER NOTA →</a>`
        : `<span class="blog-link disabled">PRÓXIMAMENTE</span>`;

      card.innerHTML = `
        <div class="blog-card-top">
          <span class="blog-icon" aria-hidden="true">📦</span>
          <span class="blog-date">${post.date}</span>
        </div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-tags">${tags}</div>
        <div class="blog-footer">${link}</div>
      `;
      grid.appendChild(card);
    });
  }

  // ---------- Hero typewriter ----------
  function initHero() {
    const el = document.getElementById("heroTypewriter");
    const text = "Explora mis proyectos y servicios →";

    // Inicia tras un pequeño delay
    setTimeout(() => {
      Typewriter.type(el, text, { speed: 38 });
    }, 600);

    document.getElementById("enterBtn").addEventListener("click", () => {
      SoundManager.sfx.click();
      Analytics.track("enter_pc_click");
      document.getElementById("ficha").scrollIntoView({ behavior: "smooth" });
    });
  }

  // ---------- Bio typewriter ----------
  async function initBio() {
    const el = document.getElementById("bioText");
    const cursor = document.getElementById("bioCursor");
    const hint = document.getElementById("bioHint");
    hint.style.display = "none";

    // Esperar a que llegue la sección a viewport
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        await Typewriter.type(el, PROFILE.bio, { speed: 22 });
        cursor.style.display = "none";
        hint.style.display = "";
      }
    }, { threshold: 0.3 });
    observer.observe(document.querySelector(".trainer-card"));
  }

  // ---------- Navegación / breadcrumb ----------
  function initNav() {
    const links = document.querySelectorAll(".breadcrumb-link");
    const sections = ["inicio", "ficha", "pc", "mochila", "contacto"];

    links.forEach((link) => {
      link.addEventListener("click", () => {
        SoundManager.sfx.click();
        setActive(link.dataset.nav);
      });
    });

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });

    function setActive(nav) {
      links.forEach((l) => l.classList.toggle("active", l.dataset.nav === nav));
    }
  }

  // ---------- Konami ----------
  function initKonami() {
    document.addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (key === KONAMI[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === KONAMI.length) {
          konamiIndex = 0;
          triggerKonami();
        }
      } else {
        konamiIndex = (key === KONAMI[0]) ? 1 : 0;
      }
    });
  }

  function triggerKonami() {
    konamiActive = !konamiActive;
    SoundManager.sfx.konami();

    if (konamiActive) {
      ThemeManager.apply("konami");
      showToast("🎮 ¡MODO MISTERIO ACTIVADO!");
    } else {
      const saved = localStorage.getItem("portfolio_theme") || "dark";
      ThemeManager.apply(saved === "konami" ? "dark" : saved);
      showToast("🎮 ¡MODO MISTERIO DESACTIVADO!");
    }
  }

  function showToast(msg) {
    const toast = document.getElementById("konamiToast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  // ---------- Scroll reveal ----------
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  // ---------- Logo: scroll a hero ----------
  function initLogo() {
    document.getElementById("logoBtn").addEventListener("click", () => {
      SoundManager.sfx.click();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
