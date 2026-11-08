"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { fragranceById } from "@/data/fragrances";
import type { Fragrance, FragranceId, NoteLayer } from "@/types/fragrance";

const FragranceContext = createContext<{
  fragrance: Fragrance;
  select: (id: FragranceId) => void;
  noteLayer: NoteLayer;
  setNoteLayer: (layer: NoteLayer) => void;
} | null>(null);
export function FragranceProvider({ children }: { children: ReactNode }) {
  const [selected, select] = useState<FragranceId>("obsidian");
  const [noteLayer, setNoteLayer] = useState<NoteLayer>("top");
  return (
    <FragranceContext.Provider
      value={{
        fragrance: fragranceById(selected),
        select,
        noteLayer,
        setNoteLayer,
      }}
    >
      {children}
    </FragranceContext.Provider>
  );
}
export function useFragrance() {
  const context = useContext(FragranceContext);
  if (!context) throw new Error("FragranceProvider is required");
  return context;
}
