"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import type { Fragrance } from "@/types/fragrance";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { SceneErrorBoundary } from "@/components/scene/SceneErrorBoundary";

const InspectorCanvas = dynamic(
  () => import("@/components/scene/InspectorCanvas"),
  { ssr: false },
);
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const clampAngle = (value: number) =>
  Math.max(-Math.PI, Math.min(Math.PI, value));

export function ProductInspector({ fragrance }: { fragrance: Fragrance }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const small = useMediaQuery("(max-width: 700px)");
  const supported = useWebGLSupport();
  const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
  const [optIn, setOptIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [turn, setTurn] = useState(-0.25);
  const [active, setActive] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const angle = useRef(-0.25);
  const drag = useRef<{ x: number; angle: number } | null>(null);
  const enabled = supported && (!reduced || optIn) && !failed;
  useEffect(() => {
    let intersects = true;
    const update = () => setActive(intersects && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting;
      update();
    });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  function rotate(value: number) {
    angle.current = clampAngle(value);
    setTurn(angle.current);
    window.dispatchEvent(new Event("eclat:inspector-update"));
  }
  function move(event: PointerEvent) {
    if (!drag.current || !ready) return;
    angle.current = clampAngle(
      drag.current.angle + (event.clientX - drag.current.x) * 0.009,
    );
    window.dispatchEvent(new Event("eclat:inspector-update"));
  }
  return (
    <div className="product-visual">
      <div
        className="product-inspector"
        ref={stage}
        data-ready={ready && enabled}
        data-fallback={failed || (hydrated && !supported)}
        data-angle={turn.toFixed(2)}
        onPointerDown={(event) => {
          if (ready) {
            drag.current = { x: event.clientX, angle: angle.current };
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerMove={move}
        onPointerUp={() => {
          drag.current = null;
          setTurn(angle.current);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div className="product-poster poster-stage">
          <picture>
            <source
              media="(max-width: 700px)"
              srcSet={`/posters/${fragrance.id}-detail-mobile.webp`}
            />
            <img
              src={`/posters/${fragrance.id}-detail.webp`}
              alt={`${fragrance.name} perfume bottle with original Maison Éclat label`}
              loading="eager"
              fetchPriority="high"
              className="bottle-poster detail-poster"
            />
          </picture>
        </div>
        {enabled && (
          <div className="inspector-canvas" aria-hidden="true">
            <SceneErrorBoundary onError={onLost}>
              <InspectorCanvas
                fragrance={fragrance}
                angle={angle}
                small={small}
                reduced={reduced}
                active={active}
                onReady={onReady}
                onLost={onLost}
              />
            </SceneErrorBoundary>
          </div>
        )}
      </div>
      {ready && enabled ? (
        <div className="inspection-toolbar">
          <p className="inspection-hint">
            Drag to turn the bottle
          </p>
          <div
            className="rotation-controls"
            role="group"
            aria-label="Bottle rotation"
          >
            <button
              type="button"
              aria-label="Rotate bottle left"
              onClick={() => rotate(angle.current - Math.PI / 6)}
            >
              ←
            </button>
            <button type="button" aria-label="Reset view" onClick={() => rotate(-0.25)}>
              Reset
            </button>
            <button
              type="button"
              aria-label="Rotate bottle right"
              onClick={() => rotate(angle.current + Math.PI / 6)}
            >
              →
            </button>
          </div>
        </div>
      ) : (
        <div className="inspector-static-message">
          <p className="inspection-hint" role="status">
            {failed
              ? "3D inspection is unavailable. Original bottle artwork is shown."
              : reduced
                ? "A still study, with reduced motion."
                : supported
                  ? "Preparing the glass study…"
                  : "Original bottle artwork. 3D is unavailable in this browser."}
          </p>
          {supported && reduced && !failed && (
            <button className="text-link" onClick={() => setOptIn(true)}>
              Enable 3D inspection
            </button>
          )}
        </div>
      )}
      <noscript>
        <style>{`.product-inspector .product-poster { visibility: visible !important; }`}</style>
        <p className="inspection-hint">
          Original bottle artwork. Enable JavaScript for 3D inspection.
        </p>
      </noscript>
    </div>
  );
}
