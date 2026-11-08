"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { fragrances } from "@/data/fragrances";
import { useFragrance } from "@/components/product/FragranceProvider";
import { seekCollection } from "@/lib/story-choreography";

export function CollectionSection() {
  const { fragrance, select } = useFragrance();
  const index = fragrances.findIndex((item) => item.id === fragrance.id);
  const details = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; width: number } | null>(null);
  const style = {
    "--variant-ground": fragrance.palette.ground,
    "--variant-ink": fragrance.palette.ink,
    "--variant-accent": fragrance.palette.accent,
  } as CSSProperties;
  function choose(next: number) {
    const normalized = (next + fragrances.length) % fragrances.length;
    select(fragrances[normalized].id);
    seekCollection(normalized);
  }
  function dragOffset(offset: number) {
    window.dispatchEvent(
      new CustomEvent("eclat:gallery-drag", { detail: { offset } }),
    );
  }
  function dragEnd(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const distance = event.clientX - drag.current.x;
    const threshold = Math.min(65, drag.current.width * 0.14);
    if (Math.abs(distance) > threshold) choose(index + (distance < 0 ? 1 : -1));
    drag.current = null;
    dragOffset(0);
  }
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const copy = Array.from(details.current?.children ?? []).filter(
        (element) => element.tagName !== "A",
      );
      gsap.fromTo(
        copy,
        { y: 14, opacity: 0.45 },
        {
          y: 0,
          opacity: 1,
          duration: 0.48,
          stagger: 0.035,
          ease: "power3.out",
          clearProps: "all",
        },
      );
    },
    { scope: details, dependencies: [fragrance.id], revertOnUpdate: true },
  );
  return (
    <section
      id="collection"
      className="collection chapter"
      data-chapter="3"
      data-variant={fragrance.id}
      style={style}
      aria-labelledby="collection-title"
    >
      <div className="chapter-heading">
        <p className="eyebrow">03 — THE COLLECTION</p>
        <p>Three interpretations of a moment.</p>
      </div>
      <div className="collection-title-row">
        <h2 id="collection-title" data-reveal>
          A different
          <br />
          kind of presence.
        </h2>
        <p>
          Smoke. Light. Warmth.
          <br />
          Let the collection unfold as you scroll.
        </p>
      </div>
      <div className="collection-scroll-stage" data-scroll-gallery>
        <div className="collection-exhibit">
          <div
            className="variant-selector"
            role="group"
            aria-label="Select a fragrance"
          >
            {fragrances.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={fragrance.id === item.id}
                onClick={() => choose(itemIndex)}
              >
                <span className="variant-number">{item.number}</span>
                <span>
                  {item.name}
                  <small>
                    {item.id === "obsidian"
                      ? "Smoky"
                      : item.id === "neroli"
                        ? "Luminous"
                        : "Warm"}
                  </small>
                </span>
                <span className="variant-mark" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>
          <div className="collection-feature">
            <div className="collection-visual">
              <div
                className="collection-stage poster-stage"
                data-scene-window="collection"
                role="region"
                aria-label="Interactive fragrance gallery"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    choose(index + (event.key === "ArrowRight" ? 1 : -1));
                  }
                }}
                onPointerDown={(event) => {
                  drag.current = {
                    x: event.clientX,
                    width: event.currentTarget.offsetWidth,
                  };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (drag.current)
                    dragOffset(
                      Math.max(
                        -0.8,
                        Math.min(
                          0.8,
                          (event.clientX - drag.current.x) / drag.current.width,
                        ),
                      ),
                    );
                }}
                onPointerUp={dragEnd}
                onPointerCancel={() => {
                  drag.current = null;
                  dragOffset(0);
                }}
              >
                <Image
                  src={fragrance.posterSrc}
                  unoptimized
                  alt={`${fragrance.name} No. ${fragrance.number}, selected fragrance`}
                  fill
                  sizes="(max-width: 700px) 80vw, 45vw"
                  className="bottle-poster"
                  draggable={false}
                />
              </div>
              <div className="gallery-controls">
                <button
                  type="button"
                  aria-label="Previous fragrance"
                  onClick={() => choose(index - 1)}
                >
                  ←
                </button>
                <p>
                  <span className="gallery-scroll-hint">
                    Scroll to discover.{" "}
                  </span>
                  Drag to choose.<span>{index + 1} of 3</span>
                </p>
                <button
                  type="button"
                  aria-label="Next fragrance"
                  onClick={() => choose(index + 1)}
                >
                  →
                </button>
              </div>
            </div>
            <div
              className="collection-details"
              ref={details}
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="eyebrow">EAU DE PARFUM · NO. {fragrance.number}</p>
              <h3>{fragrance.name}</h3>
              <p className="large-copy">{fragrance.tagline}</p>
              <p>{fragrance.description}</p>
              <p className="collection-notes">
                {fragrance.topNotes[0]}
                <span>—</span>
                {fragrance.heartNotes[0]}
                <span>—</span>
                {fragrance.baseNotes[0]}
              </p>
              <Link
                className="text-link"
                href={`/fragrances/${fragrance.slug}`}
              >
                Explore {fragrance.name}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="collection-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
      <noscript>
        <p>
          Explore the collection:{" "}
          {fragrances.map((item) => (
            <Link key={item.id} href={`/fragrances/${item.slug}`}>
              {item.name} No. {item.number}{" "}
            </Link>
          ))}
        </p>
      </noscript>
    </section>
  );
}
