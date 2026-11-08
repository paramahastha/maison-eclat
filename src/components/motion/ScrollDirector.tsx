"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MutableRefObject } from "react";
import {
  motion,
  type SceneWindowName,
  type StoryTarget,
} from "@/lib/animation-tokens";
import {
  clampProgress,
  collectionIndex,
  getSceneOpacity,
  getStoryPose,
} from "@/lib/story-choreography";
import { fragrances } from "@/data/fragrances";
import { useFragrance } from "@/components/product/FragranceProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollDirector({
  target,
  ready,
}: {
  target: MutableRefObject<StoryTarget>;
  ready: boolean;
}) {
  const { select } = useFragrance();
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".intro-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        ease: motion.ease,
        stagger: 0.08,
        clearProps: "all",
      });
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((element, index) => {
          gsap.from(element, {
            y: index % 2 ? 26 : 12,
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
            clearProps: "all",
          });
        });
      gsap.fromTo(
        ".origin-visual",
        { clipPath: "inset(9% 0% 9% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: "#origin",
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".origin-visual .bottle-poster",
        { yPercent: 5, scale: 0.96 },
        {
          yPercent: -4,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: "#origin",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".botanical",
        { rotate: -18, scale: 0.9 },
        {
          rotate: 18,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: "#composition",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.to(".orbit-top", {
        y: -22,
        x: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "#composition",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".orbit-base", {
        y: 18,
        x: -15,
        ease: "none",
        scrollTrigger: {
          trigger: "#composition",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.fromTo(
        ".ritual-image",
        { scale: 1.17, yPercent: -5 },
        {
          scale: 1.04,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: "#ritual",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".ritual-content",
        { y: 35 },
        {
          y: -25,
          ease: "none",
          scrollTrigger: {
            trigger: "#ritual",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
    media.add(
      "(min-width: 900px) and (min-height: 601px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(".hero-copy", {
          yPercent: -9,
          ease: "none",
          scrollTrigger: {
            trigger: "#encounter",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
        gsap.to(".hero-progress span", {
          scaleX: 1,
          transformOrigin: "left",
          ease: "none",
          scrollTrigger: {
            trigger: "#encounter",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
        let lastIndex = -1;
        ScrollTrigger.create({
          trigger: "[data-scroll-gallery]",
          start: "top top",
          end: "bottom bottom",
          onUpdate(self) {
            if (!self.isActive && self.progress !== 1) return;
            const index = collectionIndex(self.progress);
            if (index !== lastIndex) {
              lastIndex = index;
              select(fragrances[index].id);
            }
          },
        });
      },
    );
    return () => media.revert();
  }, []);

  useGSAP(
    () => {
      if (!ready) return;
      const windows = gsap.utils.toArray<HTMLElement>("[data-scene-window]");
      const desktop = window.matchMedia(
        "(min-width: 900px) and (min-height: 601px)",
      );
      const shell = document.querySelector<HTMLElement>(".story-canvas-shell");
      let previous: HTMLElement | undefined;
      function update() {
        const vh = window.innerHeight;
        let best: HTMLElement | undefined;
        let bestScore = 0;
        let secondScore = 0;
        for (const element of windows) {
          const rect = element.getBoundingClientRect();
          const visible = Math.max(
            0,
            Math.min(rect.bottom, vh) - Math.max(rect.top, 0),
          );
          const score = visible / Math.min(rect.height, vh);
          if (score > bestScore) {
            secondScore = bestScore;
            bestScore = score;
            best = element;
          } else if (score > secondScore) secondScore = score;
        }
        if (previous !== best) {
          previous?.removeAttribute("data-scene-active");
          best?.setAttribute("data-scene-active", "true");
          previous = best;
        }
        if (!best) {
          Object.assign(target.current, { visible: false, opacity: 0 });
          shell?.style.setProperty("--scene-opacity", "0");
          window.dispatchEvent(new Event("eclat:scene-update"));
          return;
        }
        const rect = best.getBoundingClientRect();
        const poster = best.querySelector<HTMLImageElement>(".bottle-poster");
        const style = poster ? getComputedStyle(poster) : null;
        const width =
          best.offsetWidth -
          (style
            ? parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
            : 0);
        const height =
          best.offsetHeight -
          (style
            ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
            : 0);
        const aspect =
          poster?.naturalWidth && poster.naturalHeight
            ? poster.naturalWidth / poster.naturalHeight
            : 5 / 6;
        const fittedHeight = Math.min(height, width / aspect);
        const name = best.dataset.sceneWindow as SceneWindowName;
        const section = best.closest<HTMLElement>("[data-chapter]");
        const gallery = best.closest<HTMLElement>("[data-scroll-gallery]");
        const chapterRect = (gallery || section)?.getBoundingClientRect();
        const held =
          desktop.matches && (name === "hero" || name === "collection");
        const progress = chapterRect
          ? clampProgress(
              held
                ? -chapterRect.top / Math.max(1, chapterRect.height - vh)
                : (vh - chapterRect.top) / (vh + chapterRect.height),
            )
          : 0;
        const pose = getStoryPose(name, progress);
        const opacity = getSceneOpacity(
          name,
          progress,
          bestScore,
          secondScore,
          held,
        );
        Object.assign(target.current, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: fittedHeight * aspect,
          height: fittedHeight,
          ...pose,
          visible: opacity > 0.001,
          opacity,
          progress,
          window: name,
          galleryPhase: progress * 2,
        });
        shell?.style.setProperty("--scene-opacity", String(opacity));
        section?.style.setProperty("--story-progress", String(progress));
        window.dispatchEvent(new Event("eclat:scene-update"));
      }
      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: update,
        onRefresh: update,
      });
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      windows.forEach((element) => observer.observe(element));
      function pointer(event: PointerEvent) {
        if (event.pointerType !== "mouse") return;
        const rect = previous?.getBoundingClientRect();
        const inside =
          rect &&
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        Object.assign(target.current, {
          pointerX: inside ? (event.clientX - rect.left) / rect.width - 0.5 : 0,
          pointerY: inside ? (event.clientY - rect.top) / rect.height - 0.5 : 0,
        });
        window.dispatchEvent(new Event("eclat:scene-update"));
      }
      function drag(event: Event) {
        Object.assign(target.current, {
          galleryDrag: (event as CustomEvent<{ offset: number }>).detail.offset,
        });
        window.dispatchEvent(new Event("eclat:scene-update"));
      }
      window.addEventListener("eclat:gallery-drag", drag);
      window.addEventListener("pointermove", pointer, { passive: true });
      update();
      return () => {
        trigger.kill();
        observer.disconnect();
        previous?.removeAttribute("data-scene-active");
        window.removeEventListener("pointermove", pointer);
        window.removeEventListener("eclat:gallery-drag", drag);
      };
    },
    { dependencies: [ready], revertOnUpdate: true },
  );
  return null;
}
