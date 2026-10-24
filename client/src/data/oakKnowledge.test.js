import { describe, it, expect } from "vitest";
import { OAK_PROJECTS_ES, OAK_PROJECTS_EN } from "./oakKnowledge.js";

describe("oakKnowledge", () => {
  const es = OAK_PROJECTS_ES.join("\n");

  it("ES incluye SolutionsCars con el caso de estudio y sin el repo de releases", () => {
    expect(es).toContain("SolutionsCars");
    expect(es).toContain("lautaro.is-a.dev/proyectos/solutionscars");
    expect(es).not.toContain("SolutionsCars-releases");
  });

  it("EN tiene la misma cantidad de líneas que ES", () => {
    expect(OAK_PROJECTS_EN.length).toBe(OAK_PROJECTS_ES.length);
  });
});
