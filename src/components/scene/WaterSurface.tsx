"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, DoubleSide, Mesh, MeshPhysicalMaterial, type WebGLProgramParametersWithUniforms } from "three";

const SURFACE_Y = -2.02;
const RELEASE_Y = -1.65;
const FALL_TIME = 0.32;
const IMPACT_TIME = 1.72;
const CYCLE = 6.4;

function createSplash() {
  const positions: number[] = [];
  const indices: number[] = [];
  const segments = 48;
  for (let row = 0; row <= 4; row++) {
    const t = row / 4;
    for (let segment = 0; segment <= segments; segment++) {
      const theta = segment / segments * Math.PI * 2;
      const radius = .018 + t * .052;
      const height = Math.sin(t * Math.PI) * .038 * (1 + .16 * Math.sin(theta * 7));
      positions.push(Math.cos(theta) * radius, height, Math.sin(theta) * radius);
      if (row < 4 && segment < segments) {
        const a = row * (segments + 1) + segment;
        const b = a + segments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// An outward travelling, dispersing wave packet. The normal is derived from the
// same height field as the geometry, so light moves across actual wave crests.
const waveGLSL = `
uniform float uWaterTime;
uniform float uImpactAge;
varying vec2 vWaterPosition;
varying vec3 vWaterTangent;
varying vec3 vWaterBitangent;
varying vec3 vWaterUp;
float waterHeight(vec2 p) {
  float ambient = sin(p.x * 2.4 + p.y * 9.0 + uWaterTime * .24) * .0012;
  ambient += sin(p.x * 1.1 - p.y * 6.0 + uWaterTime * .19) * .0008;
  float age = max(uImpactAge, 0.0);
  float radius = length(p);
  float front = radius - age * .5;
  float envelope = exp(-front * front / (.008 + age * .012));
  float fade = exp(-age * 1.7) * smoothstep(0.0, .07, age);
  float wave = sin(front * 34.0) * envelope * fade * .008;
  return ambient + (uImpactAge > 0.0 ? wave : 0.0);
}
`;

function prepareSurface(shader: WebGLProgramParametersWithUniforms, time: { value: number }, impact: { value: number }) {
  shader.uniforms.uWaterTime = time;
  shader.uniforms.uImpactAge = impact;
  shader.vertexShader = waveGLSL + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    `float d = .006;
     float hx = (waterHeight(position.xy + vec2(d, 0.0)) - waterHeight(position.xy - vec2(d, 0.0))) / (2.0 * d);
     float hy = (waterHeight(position.xy + vec2(0.0, d)) - waterHeight(position.xy - vec2(0.0, d))) / (2.0 * d);
     vec3 objectNormal = normalize(vec3(-hx, -hy, 1.0));`,
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `vWaterPosition = position.xy;
     vWaterTangent = normalMatrix * vec3(1.0, 0.0, 0.0);
     vWaterBitangent = normalMatrix * vec3(0.0, 1.0, 0.0);
     vWaterUp = normalMatrix * vec3(0.0, 0.0, 1.0);
     vec3 transformed = vec3(position.xy, waterHeight(position.xy));`,
  );
  shader.fragmentShader = waveGLSL + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <normal_fragment_begin>",
    `#include <normal_fragment_begin>
     float wd = .003;
     float wx = (waterHeight(vWaterPosition + vec2(wd, 0.0)) - waterHeight(vWaterPosition - vec2(wd, 0.0))) / (2.0 * wd);
     float wy = (waterHeight(vWaterPosition + vec2(0.0, wd)) - waterHeight(vWaterPosition - vec2(0.0, wd))) / (2.0 * wd);
     normal = normalize(vWaterUp - wx * vWaterTangent - wy * vWaterBitangent);`,
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <color_fragment>",
    "#include <color_fragment>\ndiffuseColor.a *= 1.0 - smoothstep(1.3, 3.8, length(vWaterPosition));",
  );
}

/** A small ballistic drop, low splash and damped surface waves; no fluid solver. */
export function WaterSurface({ active, reduced, small }: { active: boolean; reduced: boolean; small: boolean }) {
  const drop = useRef<Mesh>(null);
  const rebound = useRef<Mesh>(null);
  const crown = useRef<Mesh>(null);
  const elapsed = useRef(0);
  const { invalidate } = useThree();
  const uniforms = useRef({ time: { value: 0 }, impact: { value: -1 } });
  const splashGeometry = useMemo(() => createSplash(), []);
  const water = useMemo(() => {
    const material = new MeshPhysicalMaterial({
      color: "#241b15", metalness: 0, roughness: .14,
      clearcoat: 0, ior: 1.333, specularIntensity: .2,
      envMapIntensity: .16, transparent: true, opacity: .88,
      depthWrite: false, side: DoubleSide,
    });
    material.onBeforeCompile = (shader) => prepareSurface(shader, uniforms.current.time, uniforms.current.impact);
    material.customProgramCacheKey = () => "eclat-water-wave-v1";
    return material;
  }, []);
  useEffect(() => () => water.dispose(), [water]);
  useEffect(() => () => splashGeometry.dispose(), [splashGeometry]);
  useEffect(() => { invalidate(); }, [active, reduced, invalidate]);

  useFrame((_, delta) => {
    if (!drop.current || !rebound.current || !crown.current) return;
    if (active && !reduced) elapsed.current += Math.min(delta, .05);
    const phase = elapsed.current % CYCLE;
    const fall = (phase - (IMPACT_TIME - FALL_TIME)) / FALL_TIME;
    const age = phase - IMPACT_TIME;
    uniforms.current.time.value = elapsed.current;
    uniforms.current.impact.value = age;

    const forming = phase > .9 && fall < 0;
    drop.current.visible = !reduced && (forming || (fall >= 0 && fall < 1));
    const growth = forming ? Math.min(1, (phase - .9) / .45) : 1;
    drop.current.position.y = RELEASE_Y - Math.max(0, fall) ** 2 * (RELEASE_Y - SURFACE_Y);
    drop.current.scale.set(.028 * growth, .031 * growth * (1 + Math.max(0, fall) * .45), .028 * growth);

    // A low capillary splash: it rises only a few drop diameters, then collapses.
    crown.current.visible = !reduced && age > 0 && age < .24;
    const splash = Math.max(0, Math.sin(Math.min(1, age / .24) * Math.PI));
    const spread = .5 + Math.max(0, age) * 3.4;
    crown.current.scale.set(spread, splash, spread);
    (crown.current.material as MeshPhysicalMaterial).opacity = splash * .58;

    const bounce = (age - .08) / .3;
    rebound.current.visible = !reduced && bounce > 0 && bounce < 1;
    rebound.current.position.y = SURFACE_Y + .015 + Math.max(0, 4 * bounce * (1 - bounce)) * .105;
    if (active && !reduced) invalidate();
  });

  return (
    <group>
      <mesh position={[0, SURFACE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={water}>
        <planeGeometry args={[8, 8, small ? 72 : 112, small ? 72 : 112]} />
      </mesh>
      <mesh ref={drop} visible={false} position={[0, RELEASE_Y, .02]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial color="#f4e8d5" roughness={.025} metalness={.05} transmission={.88} thickness={.07} ior={1.333} clearcoat={1} envMapIntensity={2.1} />
      </mesh>
      <mesh ref={crown} visible={false} position={[0, SURFACE_Y + .003, .02]} geometry={splashGeometry}>
        <meshPhysicalMaterial color="#d6c3a6" transparent opacity={0} roughness={.06} metalness={.15} clearcoat={1} envMapIntensity={1.5} depthWrite={false} side={DoubleSide} />
      </mesh>
      <mesh ref={rebound} visible={false} position={[0, SURFACE_Y, .02]} scale={[.013, .021, .013]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshPhysicalMaterial color="#e8d3b4" roughness={.04} metalness={.15} clearcoat={1} envMapIntensity={1.7} />
      </mesh>
    </group>
  );
}
