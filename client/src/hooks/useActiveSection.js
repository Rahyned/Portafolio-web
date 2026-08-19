import { useEffect, useRef, useState } from "react";

// Detecta qué sección está en viewport (para el breadcrumb).
export function useActiveSection(ids, options = {}) {
  const [active, setActive] = useState(ids[0] || "");
  const refs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", ...options });

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        refs.current[id] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [ids.join(","), options]);

  return active;
}
