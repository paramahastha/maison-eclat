"use client";

import { useEffect, useMemo, useRef } from "react";
import { InstancedMesh, Object3D, CatmullRomCurve3, TubeGeometry, Vector3 } from "three";

// Fixed positions keep condensation consistent through route changes and poster
// capture. Keep beads off the printed label and away from the glass bevel seams.
const noise = (n: number) => { const v = Math.sin(n * 127.1 + 31.7) * 43758.5453; return v - Math.floor(v); };
const frontBeads = Array.from({ length: 46 }, (_, index) => {
  const x = (noise(index + 1) - .5) * 1.36;
  const y = -1.42 + noise(index + 51) * 2.22;
  return { x, y, z: .422, turn: 0, radius: .009 + noise(index + 101) ** 2 * .025 };
}).filter(({ x, y }) => !(y > -.99 && y < .29 && Math.abs(x) < .57));
const beads = [...frontBeads, ...Array.from({ length: 42 }, (_, index) => {
  const y = -1.42 + noise(index + 201) * 2.22;
  const radius = .009 + noise(index + 301) ** 2 * .022;
  if (index < 22) return { x: (noise(index + 401) - .5) * 1.36, y, z: -.422, turn: Math.PI, radius };
  const side = index % 2 ? 1 : -1;
  return { x: side * .833, y, z: (noise(index + 501) - .5) * .48, turn: side * Math.PI / 2, radius };
})];

export function BottleMoisture({ submerged = false }: { submerged?: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const trails = useMemo(() => [-.675, .66].map((x, index) => new TubeGeometry(
    new CatmullRomCurve3([
      new Vector3(x, .6 - index * .2, .421),
      new Vector3(x + .006, .3 - index * .2, .423),
      new Vector3(x - .008, .05 - index * .2, .423),
      new Vector3(x - .003, -.22 - index * .2, .422),
    ]), 24, .005, 5, false,
  )), []);
  useEffect(() => {
    if (!mesh.current) return;
    const matrix = new Object3D();
    beads.forEach(({ x, y, z, turn, radius }, index) => {
      matrix.position.set(x, y, z);
      matrix.rotation.y = turn;
      matrix.scale.set(radius, radius * (1.08 + index % 3 * .12), radius * .55);
      matrix.updateMatrix();
      mesh.current!.setMatrixAt(index, matrix.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, []);
  useEffect(() => () => trails.forEach((geometry) => geometry.dispose()), [trails]);
  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, beads.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshPhysicalMaterial color="#ffffff" transmission={.92} thickness={.04} roughness={.035} ior={1.333} clearcoat={1} envMapIntensity={1.8} />
      </instancedMesh>
      {!submerged && trails.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshPhysicalMaterial color="#e6ddca" transparent opacity={.36} roughness={.07} metalness={.1} clearcoat={1} envMapIntensity={1.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
