"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { useFragrance } from "@/components/product/FragranceProvider";
import { ScrollDirector } from "@/components/motion/ScrollDirector";
import { initialTarget } from "@/lib/animation-tokens";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

const StoryCanvas = dynamic(() => import("./StoryCanvas"), { ssr: false });
export function StoryVisual() {
  const { fragrance, noteLayer } = useFragrance();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const small = useMediaQuery("(max-width: 899px), (max-height: 600px)");
  const supported = useWebGLSupport();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const target = useRef({ ...initialTarget });
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const enabled = supported && !reduced && !failed;
  return (
    <>
      <ScrollDirector target={target} ready={enabled} />
      {enabled && (
        <div
          className="story-canvas-shell"
          data-ready={ready}
          aria-hidden="true"
        >
          <SceneErrorBoundary onError={onLost}>
            <StoryCanvas
              fragrance={fragrance}
              noteLayer={noteLayer}
              target={target}
              small={small}
              onReady={onReady}
              onLost={onLost}
            />
          </SceneErrorBoundary>
        </div>
      )}
      <span className="sr-only" role="status">
        {failed
          ? "The animated study is unavailable. Static product artwork is shown."
          : reduced
            ? "Reduced motion: static product artwork is shown."
            : ""}
      </span>
    </>
  );
}
