import { describe, expect, it } from "vitest";
import { fragrances, getFragrance, fragranceById } from "@/data/fragrances";
describe("The conceptual fragrance collection", () => {
  it("has unique direct links, complete note layers and distinct visual identities", () => {
    expect(new Set(fragrances.map((item) => item.slug)).size).toBe(3);
    expect(new Set(fragrances.map((item) => item.palette.ground)).size).toBe(3);
    for (const item of fragrances) {
      expect(getFragrance(item.slug)?.id).toBe(item.id);
      expect(fragranceById(item.id)).toEqual(item);
      for (const notes of [item.topNotes, item.heartNotes, item.baseNotes])
        expect(notes).toHaveLength(2);
      expect(item.posterSrc).toMatch(/^\/posters\/[\w-]+\.webp$/);
    }
    expect(getFragrance("unwritten-composition")).toBeUndefined();
  });
});
