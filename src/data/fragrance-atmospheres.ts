import type { FragranceId } from "@/types/fragrance";

export interface FragranceAtmosphere {
  backdrop: string; floor: string; light: string; surface: string;
  key: string; fill: string; environment: string;
  absorption: [number, number, number]; speed: number; scale: number; mood: number;
}

export const fragranceAtmospheres: Record<FragranceId, FragranceAtmosphere> = {
  obsidian: {
    backdrop: "#202b38", floor: "#39434e", light: "#a8becf", surface: "#8299ad",
    key: "#d5e2f0", fill: "#a9b8cf", environment: "#202733",
    absorption: [.09, .065, .025], speed: .55, scale: .75, mood: 0,
  },
  neroli: {
    backdrop: "#69613a", floor: "#8b8050", light: "#fff1b5", surface: "#e5d7a2",
    key: "#fff4d4", fill: "#dce8c3", environment: "#484733",
    absorption: [.025, .045, .14], speed: 1.05, scale: 1.25, mood: 1,
  },
  santal: {
    backdrop: "#513125", floor: "#79513b", light: "#e9b984", surface: "#c59d7e",
    key: "#f4ddc2", fill: "#d5a386", environment: "#36271f",
    absorption: [.025, .09, .16], speed: .4, scale: .6, mood: 2,
  },
};
