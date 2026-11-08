"use client";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { DirectionalLight } from "three";
import type { FragranceAtmosphere } from "@/data/fragrance-atmospheres";
import type { StoryTarget } from "@/lib/animation-tokens";

export function StudioLighting({
  resolution = 128,
  sceneMotion,
  atmosphere,
}: {
  atmosphere?: FragranceAtmosphere;
  resolution?: number;
  sceneMotion?: MutableRefObject<StoryTarget>;
}) {
  const key = useRef<DirectionalLight>(null);
  const { viewport, size } = useThree();
  useFrame(() => {
    if (!key.current || !sceneMotion) return;
    const state = sceneMotion.current;
    const x = (state.x / size.width - 0.5) * viewport.width;
    const y = (0.5 - state.y / size.height) * viewport.height;
    key.current.position.set(
      x - 3 + Math.sin(state.progress * Math.PI) * .6,
      y + 5,
      4,
    );
    key.current.target.position.set(x, y, 0);
    key.current.target.updateMatrixWorld();
    key.current.intensity = 2.8 + Math.sin(state.progress * Math.PI) * .3;
  });
  return (
    <>
      <ambientLight intensity={.4} color="#bcd9c7" />
      <directionalLight ref={key} position={[-3, 5, 4]} intensity={2.8} color={atmosphere?.key ?? "#e4f1d9"} />
      <directionalLight position={[4, 1, 2]} intensity={.8} color={atmosphere?.fill ?? "#b9d8cd"} />
      <Environment resolution={resolution} frames={1}>
        <color attach="background" args={[atmosphere?.environment ?? "#23352e"]} />
        <Lightformer form="rect" intensity={4} position={[-3, 2, 4]} scale={[.8, 6, 1]} rotation={[0, Math.PI / 5, 0]} color={atmosphere?.key ?? "#e3f1e2"} />
        <Lightformer form="rect" intensity={2.5} position={[4, 1, 2]} scale={[1.2, 5, 1]} rotation={[0, -Math.PI / 3, 0]} color="#e8c9a4" />
        <Lightformer form="rect" intensity={4} position={[0, 5, -1]} scale={[4, 2, 1]} rotation={[Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={1.5} position={[-1, 1, -4]} scale={[2, 5, 1]} />
      </Environment>
    </>
  );
}
