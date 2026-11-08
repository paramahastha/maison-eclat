export const motion = {
  hover: 0.22,
  reveal: 0.7,
  intro: 0.9,
  ease: "power3.out",
} as const;
export type SceneWindowName =
  | "hero"
  | "composition"
  | "collection"
  | "invitation";
export interface StoryTarget {
  x: number;
  y: number;
  width: number;
  height: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  visible: boolean;
  opacity: number;
  progress: number;
  window: SceneWindowName;
  scale: number;
  travelY: number;
  capLift: number;
  galleryPhase: number;
  galleryDrag: number;
  pointerX: number;
  pointerY: number;
}
export const initialTarget: StoryTarget = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  rotationX: 0,
  rotationY: -0.23,
  rotationZ: 0.15,
  visible: false,
  opacity: 0,
  progress: 0,
  window: "hero",
  scale: 1,
  travelY: 0,
  capLift: 0,
  galleryPhase: 0,
  galleryDrag: 0,
  pointerX: 0,
  pointerY: 0,
};
