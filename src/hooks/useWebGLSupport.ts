"use client";
import { useSyncExternalStore } from "react";
let supported: boolean | undefined;
function detect() {
  if (supported !== undefined) return supported;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });
    supported = !!context;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    supported = false;
  }
  return supported;
}
const subscribe = () => () => {};
export function useWebGLSupport() {
  return useSyncExternalStore(subscribe, detect, () => false);
}
