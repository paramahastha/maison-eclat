"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type MutableRefObject } from "react";
import { Group, MathUtils } from "three";
import type { Fragrance, NoteLayer } from "@/types/fragrance";
import type { StoryTarget } from "@/lib/animation-tokens";
import { fragrances } from "@/data/fragrances";
import { BottleModel } from "./BottleModel";
import { BottleMoisture } from "./BottleMoisture";
import { StudioLighting } from "./StudioLighting";
import { getQuality } from "@/lib/quality-presets";

function BottleJourney({
  fragrance,
  noteLayer,
  target,
  small,
  onReady,
}: {
  fragrance: Fragrance;
  noteLayer: NoteLayer;
  target: MutableRefObject<StoryTarget>;
  small: boolean;
  onReady: () => void;
}) {
  const groups = useRef<(Group | null)[]>([]);
  const initialized = useRef(false);
  const phase = useRef(0);
  const previousWindow = useRef("");
  const { viewport, size, invalidate } = useThree();
  const selectedIndex = fragrances.findIndex(
    (item) => item.id === fragrance.id,
  );
  useEffect(() => {
    const update = () => invalidate();
    window.addEventListener("eclat:scene-update", update);
    return () => window.removeEventListener("eclat:scene-update", update);
  }, [invalidate]);
  useEffect(() => {
    invalidate();
  }, [fragrance, noteLayer, invalidate]);
  useFrame((_, delta) => {
    if (!initialized.current) {
      initialized.current = true;
      onReady();
    }
    const state = target.current;
    const gallery = state.window === "collection";
    const nextPhase =
      (gallery && !small ? state.galleryPhase : selectedIndex) -
      (gallery ? state.galleryDrag * 1.5 : 0);
    const changedWindow = previousWindow.current !== state.window;
    if (changedWindow) {
      previousWindow.current = state.window;
      phase.current = nextPhase;
    }
    const phaseDistance =
      ((((nextPhase - phase.current + 1.5) % 3) + 3) % 3) - 1.5;
    phase.current += phaseDistance * (1 - Math.exp(-Math.min(delta, 0.05) * 9));
    const baseX = (state.x / size.width - 0.5) * viewport.width;
    const baseY = (0.5 - state.y / size.height) * viewport.height;
    const baseScale =
      (((state.height / size.height) * viewport.height) / 4.35) * state.scale;
    const span = (state.width / size.width) * viewport.width * 0.42;
    const blend = 1 - Math.exp(-Math.min(delta, 0.05) * 10);
    let moving = Math.abs(phaseDistance) > 0.001;
    groups.current.forEach((group, index) => {
      if (!group) return;
      const visible = state.visible && (gallery || index === selectedIndex);
      const wasVisible = group.visible;
      group.visible = visible;
      if (!visible) return;
      const angle = ((index - phase.current) * Math.PI * 2) / 3;
      const depth = gallery ? (Math.cos(angle) + 1) / 2 : 1;
      const desiredScale = baseScale * (gallery ? 0.48 + depth * 0.52 : 1);
      const x = baseX + (gallery ? Math.sin(angle) * span : 0);
      const y =
        baseY +
        baseScale * (0.07 + state.travelY) -
        (gallery ? (1 - depth) * baseScale * 0.12 : 0);
      const z = gallery ? (depth - 1) * baseScale * 0.8 : 0;
      // Screen position follows the native scrollbar exactly. Easing this coordinate
      // made the bottle lag its DOM stage and visibly rebound on reverse scroll.
      group.position.set(x, y, z);
      if (changedWindow || !wasVisible) group.scale.setScalar(desiredScale);
      else
        group.scale.setScalar(
          MathUtils.lerp(group.scale.x, desiredScale, blend),
        );
      const noteAngle =
        state.window === "composition"
          ? { top: -0.22, heart: 0.08, base: 0.3 }[noteLayer]
          : 0;
      const rx = state.rotationX + state.pointerY * 0.15;
      const ry =
        state.rotationY +
        state.pointerX * 0.28 +
        noteAngle +
        (gallery ? Math.sin(angle) * -0.3 : 0);
      const rz = state.rotationZ + (gallery ? Math.sin(angle) * 0.055 : 0);
      group.rotation.x =
        changedWindow || !wasVisible
          ? rx
          : MathUtils.lerp(group.rotation.x, rx, blend);
      group.rotation.y =
        changedWindow || !wasVisible
          ? ry
          : MathUtils.lerp(group.rotation.y, ry, blend);
      group.rotation.z =
        changedWindow || !wasVisible
          ? rz
          : MathUtils.lerp(group.rotation.z, rz, blend);
      if (
        Math.abs(group.rotation.y - ry) > 0.001 ||
        Math.abs(group.rotation.x - rx) > 0.001 ||
        Math.abs(group.rotation.z - rz) > 0.001 ||
        Math.abs(group.scale.x - desiredScale) > 0.001
      )
        moving = true;
    });
    if (moving) invalidate();
  });
  return (
    <>
      {fragrances.map((item, index) => (
        <group
          key={item.id}
          ref={(el) => {
            groups.current[index] = el;
          }}
          visible={false}
          scale={0}
        >
          <BottleModel fragrance={item} sceneMotion={target} />
          <BottleMoisture submerged />
        </group>
      ))}
    </>
  );
}

export default function StoryCanvas({
  fragrance,
  noteLayer,
  target,
  small,
  onReady,
  onLost,
}: {
  fragrance: Fragrance;
  noteLayer: NoteLayer;
  target: MutableRefObject<StoryTarget>;
  small: boolean;
  onReady: () => void;
  onLost: () => void;
}) {
  const quality = getQuality(small);
  return (
    <Canvas
      frameloop="demand"
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 50 }}
      dpr={quality.dpr}
      gl={{
        alpha: true,
        antialias: quality.antialias,
        powerPreference: small ? "low-power" : "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onLost();
          },
          { once: true },
        );
      }}
    >
      <Suspense fallback={null}>
        <StudioLighting
          resolution={quality.environmentResolution}
          sceneMotion={target}
        />
        <BottleJourney
          fragrance={fragrance}
          noteLayer={noteLayer}
          target={target}
          small={small}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}
