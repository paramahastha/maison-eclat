"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  Group,
  MathUtils,
} from "three";
import type { Fragrance } from "@/types/fragrance";
import type { AquariumWaterState } from "./useAquariumWater";
import { causticGLSL } from "./aquarium-shaders";

export function BottleModel({
  fragrance,
  capLift = 0,
  sceneMotion,
  reduced = false,
  reflection = false,
  aquarium,
}: {
  fragrance: Fragrance;
  capLift?: number;
  sceneMotion?: React.MutableRefObject<{ capLift: number }>;
  reduced?: boolean;
  reflection?: boolean;
  aquarium?: React.MutableRefObject<AquariumWaterState>;
}) {
  const causticTime = useRef({ value: 0 });
  const causticWet = useRef({ value: 0 });
  const submerged = Boolean(aquarium);
  const transparentStage = Boolean(sceneMotion);
  const invalidate = useThree((state) => state.invalidate);
  const { scene } = useGLTF("/models/maison-bottle.glb");
  // Load all three small local labels once; changing variants must not suspend the scene.
  const labels = useTexture([
    "/textures/label-obsidian.png",
    "/textures/label-neroli.png",
    "/textures/label-santal.png",
  ]);
  const sourceLabel =
    labels[{ obsidian: 0, neroli: 1, santal: 2 }[fragrance.id]];
  const label = useMemo(() => {
    const texture = sourceLabel.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
    texture.needsUpdate = true;
    return texture;
  }, [sourceLabel]);
  const instance = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      if (object.name === "Bottle_Glass")
        object.material = new MeshPhysicalMaterial({
          color: "#f3f0e8",
          metalness: 0,
          roughness: 0.045,
          transmission: 0.98,
          transparent: true,
          thickness: 0.1,
          ior: 1.45,
          envMapIntensity: 1.2,
        });
      // An opaque inner liquid avoids the WebGL transmission pass hiding nested transmissive meshes.
      else if (object.name === "Bottle_Liquid")
        object.material = new MeshPhysicalMaterial({
          color: "#80562c",
          metalness: 0.08,
          roughness: 0.2,
          clearcoat: 0.8,
          clearcoatRoughness: 0.07,
          envMapIntensity: 1.7,
        });
      else if (object.name === "Bottle_Cap")
        object.material = new MeshStandardMaterial({
          color: "#282b24",
          metalness: 0.8,
          roughness: 0.32,
          envMapIntensity: 1.7,
        });
      else if (object.name === "Bottle_Label")
        object.material = new MeshStandardMaterial({
          color: "#ffffff",
          roughness: 0.75,
          metalness: 0,
        });
      else object.material = (object.material as MeshStandardMaterial).clone();
      // Three clears transmission targets to half-alpha white for transparent canvases.
      // Recover coverage so that empty background stays clear instead of milky grey.
      if (transparentStage && object.name === "Bottle_Glass") {
        const material = object.material as MeshPhysicalMaterial;
        material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace("#include <transmission_fragment>", `
            #include <transmission_fragment>
            #ifdef USE_TRANSMISSION
              float coverage = clamp((transmitted.a - .5) * 2.0, 0.0, 1.0);
              totalDiffuse *= coverage;
              float edgeReflection = .16 + .84 * pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 5.0);
              material.transmissionAlpha = max(coverage, edgeReflection);
            #endif
          `);
        };
        material.customProgramCacheKey = () => "clear-stage-glass-v1";
      }
      if (submerged) {
        const material = object.material as MeshStandardMaterial;
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uAquariumTime = causticTime.current;
          shader.uniforms.uAquariumWet = causticWet.current;
          shader.vertexShader = "varying vec3 vAquariumWorld;\n" + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvAquariumWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;");
          shader.fragmentShader = "varying vec3 vAquariumWorld;\nuniform float uAquariumTime;\nuniform float uAquariumWet;\n" + causticGLSL + shader.fragmentShader;
          const strength = object.name === "Bottle_Liquid" ? ".05" : ".025";
          shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", `outgoingLight += uAquariumWet * diffuseColor.rgb * aquaCaustic(vAquariumWorld.xy * 2.1 + vAquariumWorld.z * .4, uAquariumTime) * ${strength};\n#include <opaque_fragment>`);
        };
        material.customProgramCacheKey = () => `aquarium-caustics-${object.name === "Bottle_Liquid" ? "liquid" : "glass"}`;
      }
      if (reflection) {
        const material = object.material as MeshPhysicalMaterial;
        material.transparent = true;
        material.opacity = object.name === "Bottle_Label" ? 0.11 : 0.2;
        material.depthWrite = false;
        material.color.multiplyScalar(0.55);
        if (object.name === "Bottle_Glass") material.transmission = 0;
      }
    });
    const cap = new Group();
    cap.name = "CapAssembly";
    const parts = clone.children.filter(
      (part) => part.name === "Bottle_Cap" || part.name.startsWith("Cap_"),
    );
    clone.add(cap);
    parts.forEach((part) => cap.add(part));
    return clone;
    // Variants update existing materials below, retaining the same scene and mesh instances.
  }, [scene, reflection, submerged, transparentStage]);
  useFrame((_, delta) => {
    causticTime.current.value = aquarium?.current.time ?? 0;
    causticWet.current.value = aquarium?.current.wet ?? 0;
    const cap = instance.getObjectByName("CapAssembly");
    if (!cap) return;
    const destination = sceneMotion?.current.capLift ?? capLift;
    cap.position.y = reduced
      ? destination
      : MathUtils.damp(cap.position.y, destination, 9, Math.min(delta, 0.05));
    cap.rotation.y = cap.position.y * 0.12;
    if (Math.abs(cap.position.y - destination) > 0.001) invalidate();
  });
  useEffect(() => {
    invalidate();
  }, [capLift, invalidate]);
  useEffect(() => {
    instance.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const material = object.material as MeshStandardMaterial;
      if (object.name === "Bottle_Liquid")
        material.color.copy(new Color(fragrance.palette.liquid)).multiplyScalar(reflection ? 0.55 : 1);
      if (object.name === "Bottle_Cap")
        material.color.copy(new Color(fragrance.palette.cap)).multiplyScalar(reflection ? 0.55 : 1);
      if (object.name === "Bottle_Label") {
        material.map = label;
        material.needsUpdate = true;
      }
    });
    // Demand mode cannot observe imperative material/texture edits.
    invalidate();
  }, [instance, fragrance, label, invalidate, reflection]);
  useEffect(() => () => label.dispose(), [label]);
  useEffect(
    () => () => {
      instance.traverse((object) => {
        if (object instanceof Mesh)
          (object.material as MeshStandardMaterial).dispose();
      });
    },
    [instance],
  );
  return <primitive object={instance} dispose={null} />;
}
