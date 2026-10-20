import { describe, expect, it } from "vitest";
import { FALLBACK_DATA } from "./fallback";

const PROFILE_URL = "https://github.com/Rahyned";

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
});
