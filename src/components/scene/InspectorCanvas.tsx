"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { StudioLighting } from "./StudioLighting";
import { Suspense, useEffect, useRef, type MutableRefObject } from "react";
import { Group, MathUtils } from "three";
import { fragranceAtmospheres } from "@/data/fragrance-atmospheres";
import type { Fragrance } from "@/types/fragrance";
import { BottleModel } from "./BottleModel";
import { BottleMoisture } from "./BottleMoisture";
import { AquariumScene } from "./AquariumScene";
import { AquariumOptics } from "./AquariumOptics";
import { useAquariumWater } from "./useAquariumWater";
import { advanceFloatingPose, aquariumEntry } from "@/lib/aquarium-motion";

function InspectorBottle({
  fragrance,
  angle,
  reduced,
  active,
  small,
  onReady,
}: {
  fragrance: Fragrance;
  angle: MutableRefObject<number>;
  reduced: boolean;
  active: boolean;
  small: boolean;
  onReady: () => void;
}) {
  const group = useRef<Group>(null);
  const bottle = useRef<Group>(null);
  const initialized = useRef(false);
  const floating = useRef({ height: 0, velocity: 0, roll: 0, angularVelocity: 0 });
  const water = useAquariumWater(active, reduced, small);
  const { viewport, invalidate } = useThree();
  useEffect(() => {
    const update = () => invalidate();
    window.addEventListener("eclat:inspector-update", update);
    return () => window.removeEventListener("eclat:inspector-update", update);
  }, [invalidate]);
  useFrame((_, delta) => {
    if (!group.current || !bottle.current) return;
    if (!initialized.current) {
      initialized.current = true;
      onReady();
    }
    group.current.scale.setScalar(Math.min(viewport.height / 5.25, viewport.width / 3.5));
    if (active && !reduced && water.current.time > 4) advanceFloatingPose(floating.current, water.current.time, delta);
    const entry = aquariumEntry(reduced ? 0 : water.current.time);
    bottle.current.position.y = floating.current.height + (reduced ? -.06 : entry.height);
    bottle.current.rotation.z = -.035 + floating.current.roll + (reduced ? 0 : entry.roll);
    bottle.current.rotation.x = .04 + Math.sin(water.current.time * .51) * .018;
    bottle.current.rotation.y = reduced
      ? angle.current
      : MathUtils.damp(bottle.current.rotation.y, angle.current, 16, Math.min(delta, .05));
    if (Math.abs(bottle.current.rotation.y - angle.current) > 0.001)
      invalidate();
  });
  return (
    <group ref={group}>
      <group ref={bottle} rotation={[0.04, -0.25, 0]}>
        <BottleModel fragrance={fragrance} aquarium={water} />
        <BottleMoisture submerged />
      </group>
      <AquariumScene water={water} small={small} atmosphere={fragranceAtmospheres[fragrance.id]} />
      <AquariumOptics water={water} atmosphere={fragranceAtmospheres[fragrance.id]} />
    </group>
  );
}

export default function InspectorCanvas({
  fragrance,
  angle,
  small,
  reduced,
  active,
  onReady,
  onLost,
}: {
  fragrance: Fragrance;
  angle: MutableRefObject<number>;
  small: boolean;
  reduced: boolean;
  active: boolean;
  onReady: () => void;
  onLost: () => void;
}) {
  return (
    <Canvas
      frameloop="demand"
      orthographic
      camera={{ position: [0, 1.8, 10], zoom: 100 }}
      dpr={small ? 1 : 1.5}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
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
      <color attach="background" args={["#191c17"]} />
      <Suspense fallback={null}>
        <StudioLighting resolution={small ? 64 : 128} atmosphere={fragranceAtmospheres[fragrance.id]} />
        <InspectorBottle
          fragrance={fragrance}
          angle={angle}
          reduced={reduced}
          active={active}
          small={small}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}
