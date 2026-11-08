import type { SceneWindowName } from "./animation-tokens";

export function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}
export function smoothProgress(value: number) {
  const p = clampProgress(value);
  return p * p * (3 - 2 * p);
}

function smoothRange(start: number, end: number, value: number) {
  return smoothProgress((value - start) / (end - start));
}

/** Each chapter has a quiet exit and entrance, so a new camera target is never shown mid-flight. */
export function getSceneOpacity(
  chapter: SceneWindowName,
  progress: number,
  visibleFraction: number,
  competingFraction = 0,
  held = false,
) {
  const p = clampProgress(progress);
  const presence = smoothRange(0.08, 0.48, visibleFraction);
  const separation = smoothRange(
    0.015,
    0.22,
    visibleFraction - competingFraction,
  );
  const entrance =
    chapter === "hero" || chapter === "collection"
      ? 1
      : smoothRange(0.04, 0.22, p);
  const exit =
    chapter === "invitation" || chapter === "collection"
      ? 1
      : chapter === "hero"
        ? 1 - smoothRange(held ? 0.62 : 0.56, held ? 0.88 : 0.73, p)
        : 1 - smoothRange(0.78, 0.94, p);
  return presence * separation * entrance * exit;
}

/** Scroll is the clock. Seeking backward produces the exact same target pose. */
export function getStoryPose(chapter: SceneWindowName, progress: number) {
  const p = smoothProgress(progress);
  const arc = Math.sin(p * Math.PI);
  switch (chapter) {
    case "hero":
      return {
        rotationX: -0.08 + p * 0.15,
        rotationY: -0.38 + p * 0.58,
        rotationZ: 0.13 - p * 0.12,
        scale: 1 + arc * 0.1,
        travelY: p * 0.12,
        capLift: 0,
      };
    case "composition":
      return {
        rotationX: -0.03 + arc * 0.08,
        rotationY: -0.7 + p * 1.4,
        rotationZ: -0.08 + p * 0.16,
        scale: 0.85 + arc * 0.02,
        travelY: 0,
        capLift: arc * 0.12,
      };
    case "collection":
      return {
        rotationX: 0.03,
        rotationY: -0.16,
        rotationZ: 0,
        scale: 0.87,
        travelY: 0,
        capLift: 0,
      };
    case "invitation":
      return {
        rotationX: 0.1 - p * 0.08,
        rotationY: 0.8 - p * 1.03,
        rotationZ: -0.12 + p * 0.2,
        scale: 1.1 - p * 0.1,
        travelY: 0,
        capLift: (1 - p) * 0.2,
      };
  }
}

export function collectionIndex(progress: number) {
  return Math.round(clampProgress(progress) * 2);
}

/** Button/drag navigation seeks the same scroll interval used by the 3D gallery. */
export function seekCollection(index: number) {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function" ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 899px), (max-height: 600px)",
    ).matches
  )
    return;
  const stage = document.querySelector<HTMLElement>("[data-scroll-gallery]");
  if (!stage) return;
  const top = stage.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(0, stage.offsetHeight - window.innerHeight);
  window.scrollTo({
    top: top + range * (Math.max(0, Math.min(2, index)) / 2),
    behavior: "instant",
  });
}
