import { describe, expect, it } from "vitest";
import { FALLBACK_DATA } from "../data/fallback";
import { localizeData } from "./DataContext";

describe("localizeData PROJECT_BOXES media", () => {
  it("fusiona media EN conservando type, src y poster del dato ES", () => {
    const en = localizeData(FALLBACK_DATA, "en");
    const caja2 = en.PROJECT_BOXES.find((b) => b.id === "caja2");
    const rag = caja2.projects.find((p) => p.id === "rag");

    expect(rag.media).toEqual({
      type: "video",
      src: "/media/rag-demo.mp4",
      poster: "/media/rag-poster.jpg",
      alt: "RAG assistant demo video answering with citations"
    });
  });
});