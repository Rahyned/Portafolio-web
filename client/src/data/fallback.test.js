import { describe, expect, it } from "vitest";
import { FALLBACK_DATA } from "./fallback";
import { localizeData } from "../context/DataContext";

const PROFILE_URL = "https://github.com/Rahyned";

/** Palabras típicas del contenido ES que no deberían quedar en EN. */
const CASTELLANO = /\b(Construyo|taller|laboratorio|días|Quería|Tenía|Un |Una |los |las |para |sin |desde |todos|proyectos|vencimientos|facturas)\b/i;

describe("FALLBACK_DATA", () => {
  it("tiene los 5 proyectos destacados en orden", () => {
    expect(FALLBACK_DATA.FEATURED_PROJECTS.map((p) => p.id)).toEqual([
      "solutionscars",
      "stella",
      "rag",
      "panel",
      "pronostico"
    ]);
  });

  it("no usa el perfil de GitHub como link de proyecto", () => {
    const urls = FALLBACK_DATA.FEATURED_PROJECTS.flatMap((p) => p.links.map((l) => l.url));
    expect(urls).not.toContain(PROFILE_URL);
  });

  it("no incluye la palabra tests en sus textos", () => {
    expect(JSON.stringify(FALLBACK_DATA)).not.toMatch(/\btests\b/i);
  });

  it("localizeData en no deja castellano en problem/built/result/tagline", () => {
    const en = localizeData(FALLBACK_DATA, "en");
    expect(en.PROFILE.tagline).not.toMatch(CASTELLANO);
    expect(en.PROFILE.tagline).not.toBe(FALLBACK_DATA.PROFILE.tagline);

    for (const project of en.FEATURED_PROJECTS) {
      const src = FALLBACK_DATA.FEATURED_PROJECTS.find((p) => p.id === project.id);
      expect(project.problem).not.toBe(src.problem);
      expect(project.built).not.toBe(src.built);
      expect(project.result).not.toBe(src.result);
      expect(project.problem).not.toMatch(CASTELLANO);
      expect(project.built).not.toMatch(CASTELLANO);
      expect(project.result).not.toMatch(CASTELLANO);
    }
  });
});
