"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { noteLayers } from "@/data/fragrances";
import type { Fragrance, NoteLayer } from "@/types/fragrance";

export function NotesExplorer({
  fragrance,
  onLayerChange,
}: {
  fragrance: Fragrance;
  onLayerChange?: (layer: NoteLayer) => void;
}) {
  const [active, setActive] = useState<NoteLayer>("top");
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function activate(layer: NoteLayer) {
    setActive(layer);
    onLayerChange?.(layer);
  }
  function onKey(event: KeyboardEvent, index: number) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 2
          : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
    activate(noteLayers[next].id);
    buttons.current[next]?.focus();
  }
  return (
    <div className="notes-explorer">
      <div className="notes-tabs">
        <div
          role="tablist"
          aria-label={`${fragrance.name} fragrance notes`}
          className="tab-list"
        >
          {noteLayers.map((layer, index) => (
            <button
              key={layer.id}
              ref={(el) => {
                buttons.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-${layer.id}-tab`}
              aria-controls={`${id}-${layer.id}-panel`}
              aria-selected={active === layer.id}
              tabIndex={active === layer.id ? 0 : -1}
              onKeyDown={(event) => onKey(event, index)}
              onClick={() => activate(layer.id)}
            >
              {layer.id}
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
        {noteLayers.map((layer) => (
          <div
            key={layer.id}
            role="tabpanel"
            id={`${id}-${layer.id}-panel`}
            aria-labelledby={`${id}-${layer.id}-tab`}
            hidden={active !== layer.id}
            tabIndex={0}
            className="notes-panel"
          >
            <p className="note-names">
              {fragrance[`${layer.id}Notes`].join(" & ")}
            </p>
            <p>{layer.description}</p>
          </div>
        ))}
      </div>
      <div className="notes-accordion">
        {noteLayers.map((layer) => (
          <details
            key={layer.id}
            name={`${id}-notes`}
            open={active === layer.id}
            onToggle={(event) => {
              if (event.currentTarget.open) activate(layer.id);
            }}
          >
            <summary>
              {layer.id} notes<span aria-hidden="true">+</span>
            </summary>
            <div>
              <p className="note-names">
                {fragrance[`${layer.id}Notes`].join(" & ")}
              </p>
              <p>{layer.description}</p>
            </div>
          </details>
        ))}
      </div>
      <noscript>
        <p>
          Top: {fragrance.topNotes.join(", ")}. Heart:{" "}
          {fragrance.heartNotes.join(", ")}. Base:{" "}
          {fragrance.baseNotes.join(", ")}.
        </p>
      </noscript>
    </div>
  );
}
