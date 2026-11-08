import type { Fragrance, FragranceId } from "@/types/fragrance";

export const fragrances: Fragrance[] = [
  {
    id: "obsidian",
    slug: "obsidian-01",
    number: "01",
    name: "Obsidian",
    tagline: "The quiet after dark.",
    description:
      "Bright bergamot gives way to the soft smoke of incense. Iris softens the edges; vetiver and amberwood leave a dark, lingering trace.",
    topNotes: ["Bergamot", "Black pepper"],
    heartNotes: ["Iris", "Incense"],
    baseNotes: ["Vetiver", "Amberwood"],
    palette: {
      ground: "#171915",
      ink: "#f3efe6",
      accent: "#b79b68",
      liquid: "#80562c",
      cap: "#282b24",
    },
    visualVariant: "obsidian",
    posterSrc: "/posters/obsidian-live.webp",
    ogSrc: "/branding/og.jpg",
  },
  {
    id: "neroli",
    slug: "neroli-02",
    number: "02",
    name: "Neroli",
    tagline: "A little closer to light.",
    description:
      "Neroli and petitgrain open like a window. Jasmine and orange blossom unfold into a luminous composition, held by white musk and cedar.",
    topNotes: ["Neroli", "Petitgrain"],
    heartNotes: ["Jasmine", "Orange blossom"],
    baseNotes: ["White musk", "Cedar"],
    palette: {
      ground: "#e5ddc9",
      ink: "#292c22",
      accent: "#74603c",
      liquid: "#c6a75a",
      cap: "#b3a17c",
    },
    visualVariant: "neroli",
    posterSrc: "/posters/neroli-live.webp",
    ogSrc: "/branding/og.jpg",
  },
  {
    id: "santal",
    slug: "santal-03",
    number: "03",
    name: "Santal",
    tagline: "Warmth, held close.",
    description:
      "Cardamom meets the green softness of fig leaf. Violet and tea settle into sandalwood and benzoin: an intimate composition with a warm finish.",
    topNotes: ["Cardamom", "Fig leaf"],
    heartNotes: ["Violet", "Tea accord"],
    baseNotes: ["Sandalwood", "Benzoin"],
    palette: {
      ground: "#493a2f",
      ink: "#f3efe6",
      accent: "#d3b88a",
      liquid: "#965c31",
      cap: "#624a30",
    },
    visualVariant: "santal",
    posterSrc: "/posters/santal-live.webp",
    ogSrc: "/branding/og.jpg",
  },
];

export function getFragrance(slug: string) {
  return fragrances.find((item) => item.slug === slug);
}
export function fragranceById(id: FragranceId) {
  return fragrances.find((item) => item.id === id) ?? fragrances[0];
}

export const noteLayers = [
  {
    id: "top",
    title: "The first impression",
    description:
      "The opening gesture. Bright, immediate notes that introduce the composition.",
  },
  {
    id: "heart",
    title: "At the heart",
    description:
      "The character unfolds. Softer notes form the centre of the fragrance.",
  },
  {
    id: "base",
    title: "What remains",
    description:
      "The lingering trace. Deep, warm notes hold the composition together.",
  },
] as const;
