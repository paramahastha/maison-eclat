export type FragranceId = "obsidian" | "neroli" | "santal";
export type NoteLayer = "top" | "heart" | "base";
export interface Fragrance {
  id: FragranceId;
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  palette: {
    ground: string;
    ink: string;
    accent: string;
    liquid: string;
    cap: string;
  };
  visualVariant: FragranceId;
  posterSrc: string;
  ogSrc: string;
}
