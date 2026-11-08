"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { Color, Vector3, HalfFloatType, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, UnsignedByteType } from "three";
import type { AquariumWaterState } from "./useAquariumWater";
import { waterFieldGLSL } from "./aquarium-shaders";

import type { FragranceAtmosphere } from "@/data/fragrance-atmospheres";

const fragment = `
uniform sampler2D uScene;
uniform vec3 uAbsorption;
uniform vec3 uTint;
varying vec2 vUv;
${waterFieldGLSL}
void main() {
  vec2 q = vUv;
  float mask = smoothstep(.02, .08, q.y) * (1.0 - smoothstep(.88, .99, q.y));
  vec2 slope = aquaSlope(q);
  vec2 offset = slope * .00075 * mask * uWet;
  vec3 color = texture2D(uScene, vUv + offset).rgb;
  // Beer-Lambert style attenuation keeps the depth tint tied to the water volume.
  float depth = .65 + (1.0 - clamp(q.y, 0.0, 1.0)) * .65;
  vec3 absorb = exp(-uAbsorption * depth);
  vec3 submerged = color * absorb + uTint * .2 * (1.0 - absorb);
  color = mix(color, submerged, mask * uWet);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  float edge = smoothstep(.0, .10, min(vUv.x, 1.0-vUv.x)) * smoothstep(.0, .1, min(vUv.y, 1.0-vUv.y));
  gl_FragColor.rgb = mix(vec3(25.0, 28.0, 23.0) / 255.0, gl_FragColor.rgb, edge);
}
`;

/** One scene render, restrained underwater refraction and a page-colour edge blend. */
export function AquariumOptics({ water, atmosphere }: {
  atmosphere: FragranceAtmosphere;
  water: MutableRefObject<AquariumWaterState>;
}) {
  const { gl } = useThree();
  const target = useFBO({ depthBuffer: true, samples: 0, type: gl.extensions.has("EXT_color_buffer_float") ? HalfFloatType : UnsignedByteType });
  const material = useRef<ShaderMaterial>(null);
  const pass = useMemo(() => {
    const shader = new ShaderMaterial({
      uniforms: {
        uAbsorption: { value: new Vector3(...atmosphere.absorption) }, uTint: { value: new Color(atmosphere.backdrop) }, uWet: { value: 0 }, uImpact: { value: 0 }, uImpactAge: { value: -1 }, uScene: { value: null }, uHeight: { value: null }, uTime: { value: 0 }, uUseSimulation: { value: 0 },
      },
      vertexShader: "varying vec2 vUv; void main() { vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }",
      fragmentShader: fragment, depthTest: false, depthWrite: false,
    });
    const geometry = new PlaneGeometry(2, 2);
    const scene = new Scene();
    scene.add(new Mesh(geometry, shader));
    return { shader, geometry, scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [atmosphere]);
  useEffect(() => {
    material.current = pass.shader;
    return () => { pass.shader.dispose(); pass.geometry.dispose(); };
  }, [pass]);
  useFrame(({ scene, camera }) => {
    if (!material.current) return;
    const uniforms = material.current.uniforms;
    uniforms.uWet.value = water.current.wet;
    uniforms.uImpact.value = water.current.impact;
    uniforms.uImpactAge.value = water.current.impactAge;
    uniforms.uTime.value = water.current.time;
    uniforms.uHeight.value = water.current.texture;
    uniforms.uUseSimulation.value = water.current.simulated ? 1 : 0;
    const previous = gl.getRenderTarget();
    gl.setRenderTarget(target); gl.render(scene, camera);
    uniforms.uScene.value = target.texture;
    gl.setRenderTarget(previous); gl.render(pass.scene, pass.camera);
  }, 1);
  return null;
}
