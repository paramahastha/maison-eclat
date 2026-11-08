"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, DoubleSide, InstancedMesh, Object3D, ShaderMaterial } from "three";
import type { AquariumWaterState } from "./useAquariumWater";
import { receiverFragment, receiverVertex, surfaceFragment, surfaceVertex } from "./aquarium-shaders";

import type { FragranceAtmosphere } from "@/data/fragrance-atmospheres";

type WaterRef = MutableRefObject<AquariumWaterState>;

function Receiver({ water, atmosphere, floor = false }: { water: WaterRef; atmosphere: FragranceAtmosphere; floor?: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uWet: { value: 0 }, uImpact: { value: 0 }, uImpactAge: { value: -1 }, uHeight: { value: null }, uTime: { value: 0 }, uUseSimulation: { value: 0 },
    uFloor: { value: floor ? 1 : 0 }, uColor: { value: new Color(floor ? atmosphere.floor : atmosphere.backdrop) },
    uGlow: { value: new Color(atmosphere.light) }, uMood: { value: atmosphere.mood }, uScale: { value: atmosphere.scale },
  }), [floor, atmosphere]);
  useFrame(() => {
    if (!material.current) return;
    material.current.uniforms.uWet.value = water.current.wet;
    material.current.uniforms.uImpact.value = water.current.impact;
    material.current.uniforms.uImpactAge.value = water.current.impactAge;
    material.current.uniforms.uTime.value = water.current.time * atmosphere.speed;
    material.current.uniforms.uHeight.value = water.current.texture;
    material.current.uniforms.uUseSimulation.value = water.current.simulated ? 1 : 0;
  });
  return (
    <mesh position={floor ? [0, -2.7, 0] : [0, 0, -2.3]} rotation={floor ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}>
      <planeGeometry args={[12, 8]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={receiverVertex} fragmentShader={receiverFragment} side={DoubleSide} transparent={floor} depthWrite={!floor} />
    </mesh>
  );
}

function Surface({ water, small, atmosphere }: { water: WaterRef; small: boolean; atmosphere: FragranceAtmosphere }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTint: { value: new Color(atmosphere.surface) }, uWet: { value: 0 }, uImpact: { value: 0 }, uImpactAge: { value: -1 }, uHeight: { value: null }, uTime: { value: 0 }, uUseSimulation: { value: 0 } }), [atmosphere]);
  useFrame(() => {
    if (!material.current) return;
    material.current.uniforms.uWet.value = water.current.wet;
    material.current.uniforms.uImpact.value = water.current.impact;
    material.current.uniforms.uImpactAge.value = water.current.impactAge;
    material.current.uniforms.uTime.value = water.current.time * atmosphere.speed;
    material.current.uniforms.uHeight.value = water.current.texture;
    material.current.uniforms.uUseSimulation.value = water.current.simulated ? 1 : 0;
  });
  return (
    <mesh position={[0, 1.9, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
      <planeGeometry args={[12, 5, small ? 64 : 96, small ? 40 : 64]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={surfaceVertex} fragmentShader={surfaceFragment} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
  );
}

function Bubbles({ water }: { water: WaterRef }) {
  const bubbles = useRef<InstancedMesh>(null);
  const matrix = useMemo(() => new Object3D(), []);
  useFrame(() => {
    if (!bubbles.current) return;
    for (let index = 0; index < 18; index++) {
      const seed = index * 1.618;
      const time = water.current.time;
      const y = ((index * .23 + time * (.09 + index % 4 * .018)) % 3.95) - 2.1;
      const x = (index % 2 ? 1 : -1) * (1.08 + Math.sin(seed) * .42) + Math.sin(time * .5 + seed) * .04;
      matrix.position.set(x, y, Math.sin(seed * 2.1) * .68);
      matrix.scale.setScalar((.012 + index % 5 * .003) * water.current.wet);
      matrix.updateMatrix();
      bubbles.current.setMatrixAt(index, matrix.matrix);
    }
    bubbles.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={bubbles} args={[undefined, undefined, 18]} frustumCulled={false}>
      <sphereGeometry args={[1, 12, 8]} />
      <meshPhysicalMaterial color="#d6eadb" transparent opacity={.38} roughness={.04} metalness={.25} clearcoat={1} envMapIntensity={1.1} depthWrite={false} />
    </instancedMesh>
  );
}

/** Ballistic droplets originate at the entry point and fall back into the surface. */
function ImpactSplash({ water }: { water: WaterRef }) {
  const mesh = useRef<InstancedMesh>(null);
  const matrix = useMemo(() => new Object3D(), []);
  useFrame(() => {
    if (!mesh.current) return;
    const age = water.current.impactAge;
    mesh.current.visible = age >= 0 && age < 1.3;
    for (let i = 0; i < 32; i++) {
      const a = i * 2.39996;
      const t = Math.max(0, age);
      const speed = .7 + (i % 7) * .12;
      const radius = .48 + speed * t;
      const y = 1.9 + (1.3 + i % 5 * .18) * t - 3.5 * t * t;
      matrix.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius * .65);
      const size = y < 1.87 ? 0 : (.018 + i % 3 * .006) * Math.max(0, 1 - t / 1.3);
      matrix.scale.set(size, size * (1.6 - Math.min(1, t)), size);
      matrix.updateMatrix();
      mesh.current.setMatrixAt(i, matrix.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={mesh} args={[undefined, undefined, 32]} frustumCulled={false}>
    <sphereGeometry args={[1, 10, 8]} />
    <meshPhysicalMaterial color="#d8e8db" roughness={.06} metalness={.15} transparent opacity={.65} clearcoat={1} depthWrite={false} />
  </instancedMesh>;
}

/** The entire product square is the water volume; its edges continue beyond view. */
export function AquariumScene({ water, small, atmosphere }: { water: WaterRef; small: boolean; atmosphere: FragranceAtmosphere }) {
  const group = useRef<Group>(null);
  useFrame(() => { if (group.current) group.current.visible = water.current.wet > 0; });
  return (
    <group ref={group} visible={false}>
      <Receiver water={water} atmosphere={atmosphere} />
      <Receiver water={water} atmosphere={atmosphere} floor />
      <Surface water={water} small={small} atmosphere={atmosphere} />
      <Bubbles water={water} />
      <ImpactSplash water={water} />
    </group>
  );
}
