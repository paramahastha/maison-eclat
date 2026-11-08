"use client";

import { aquariumEntry, AQUARIUM_IMPACT_TIME } from "@/lib/aquarium-motion";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { HalfFloatType, Mesh, LinearFilter, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderTarget, type Texture } from "three";

export interface AquariumWaterState { time: number; texture: Texture | null; simulated: boolean; wet: number; impactAge: number; impact: number }

const stepFragment = `
uniform sampler2D uPrevious;
uniform float uTime;
uniform float uInit;
uniform float uPixel;
uniform float uImpact;
varying vec2 vUv;
void main() {
  if (uInit > .5) {
    float h = sin(vUv.x * 12.0 + vUv.y * 7.0) * .012 + sin(vUv.y * 17.0) * .007;
    gl_FragColor = vec4(h, 0.0, 0.0, 1.0); return;
  }
  vec2 state = texture2D(uPrevious, vUv).rg;
  float neighbors = texture2D(uPrevious, vUv + vec2(uPixel, 0.0)).r
    + texture2D(uPrevious, vUv - vec2(uPixel, 0.0)).r
    + texture2D(uPrevious, vUv + vec2(0.0, uPixel)).r
    + texture2D(uPrevious, vUv - vec2(0.0, uPixel)).r;
  float velocity = (state.g + (neighbors - 4.0 * state.r) * .22) * .994;
  vec2 a = vUv - vec2(.12, .3 + sin(uTime * .19) * .12);
  vec2 b = vUv - vec2(.85, .7 + cos(uTime * .23) * .1);
  velocity += (exp(-dot(a,a) * 500.0) - exp(-dot(b,b) * 500.0)) * sin(uTime * 1.7) * .00065;
  velocity += exp(-dot(vUv - vec2(.5), vUv - vec2(.5)) * 220.0) * uImpact * -.065;
  gl_FragColor = vec4(clamp(state.r + velocity, -.1, .1), velocity, 0.0, 1.0);
}
`;

/** A fixed-step, reflecting-boundary height/velocity field on two small GPU targets. */
export function useAquariumWater(active: boolean, reduced: boolean, small: boolean) {
  const { gl, invalidate } = useThree();
  const state = useRef<AquariumWaterState>({ time: 0, texture: null, simulated: false, wet: 0, impactAge: -1, impact: 0 });
  const runtime = useRef({ initialized: false, read: 0, accumulator: 0, impacted: false });
  const resources = useMemo(() => {
    const resolution = small ? 64 : 96;
    const targets = [0, 1].map(() => new WebGLRenderTarget(resolution, resolution, {
      type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false,
    }));
    const material = new ShaderMaterial({
      uniforms: { uImpact: { value: 0 }, uPrevious: { value: null }, uTime: { value: 0 }, uInit: { value: 1 }, uPixel: { value: 1 / resolution } },
      vertexShader: "varying vec2 vUv; void main() { vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }",
      fragmentShader: stepFragment, depthTest: false, depthWrite: false,
    });
    const geometry = new PlaneGeometry(2, 2);
    const scene = new Scene();
    scene.add(new Mesh(geometry, material));
    return { targets, material, geometry, scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [small]);
  const gpu = useRef<typeof resources | null>(null);
  useEffect(() => {
    gpu.current = resources;
    runtime.current = { initialized: false, read: 0, accumulator: 0, impacted: false };
    invalidate();
    return () => { resources.targets.forEach((target) => target.dispose()); resources.material.dispose(); resources.geometry.dispose(); };
  }, [resources, invalidate]);
  useEffect(() => { invalidate(); }, [active, reduced, invalidate]);
  useFrame((_, delta) => {
    if (!gpu.current) return;
    const dt = active && !reduced ? Math.min(delta, .05) : 0;
    state.current.time += dt;
    const entry = aquariumEntry(state.current.time);
    state.current.wet = reduced ? 1 : entry.wet;
    state.current.impactAge = reduced ? -1 : entry.impactAge;
    state.current.impact = reduced ? 0 : entry.impact;
    state.current.simulated = gl.extensions.has("EXT_color_buffer_float");
    if (state.current.simulated) {
      const previousTarget = gl.getRenderTarget();
      const { material, targets, scene, camera } = gpu.current;
      if (!runtime.current.initialized) {
        material.uniforms.uInit.value = 1;
        gl.setRenderTarget(targets[0]); gl.render(scene, camera);
        runtime.current.initialized = true;
        material.uniforms.uInit.value = 0;
      }
      runtime.current.accumulator += dt;
      while (runtime.current.accumulator >= 1 / 60) {
        const read = runtime.current.read;
        material.uniforms.uPrevious.value = targets[read].texture;
        material.uniforms.uTime.value = state.current.time;
        const hit = !runtime.current.impacted && state.current.time >= AQUARIUM_IMPACT_TIME;
        material.uniforms.uImpact.value = hit ? 1 : 0;
        if (hit) runtime.current.impacted = true;
        gl.setRenderTarget(targets[1 - read]); gl.render(scene, camera);
        runtime.current.read = 1 - read;
        runtime.current.accumulator -= 1 / 60;
      }
      state.current.texture = targets[runtime.current.read].texture;
      gl.setRenderTarget(previousTarget);
    }
    if (active && !reduced) invalidate();
  }, -2);
  return state;
}
