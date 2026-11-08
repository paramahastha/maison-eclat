"use client";

import Image from "next/image";
import Link from "next/link";
import { useFragrance } from "@/components/product/FragranceProvider";
import { NotesExplorer } from "@/components/product/NotesExplorer";
import { CollectionSection } from "./CollectionSection";
import { StoryVisual } from "@/components/scene/StoryVisual";

export function HomeStory() {
  const { fragrance, noteLayer, setNoteLayer } = useFragrance();
  return (
    <main id="main" className="home-story">
      <StoryVisual />
      <section
        className="hero chapter"
        id="encounter"
        data-chapter="0"
        aria-labelledby="hero-title"
      >
        <div className="hero-frame">
          <div className="hero-copy">
            <p className="eyebrow intro-reveal">
              AN OLFACTORY STUDY · COLLECTION 01
            </p>
            <h1 id="hero-title" className="intro-reveal">
              A presence
              <br />
              that remains.
            </h1>
            <p className="hero-description intro-reveal">
              Three fragrances. An exploration of light,
              <br className="desktop-break" /> memory, and everything left
              unsaid.
            </p>
            <a className="text-link intro-reveal" href="#collection">
              Discover the collection<span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-stage poster-stage" data-scene-window="hero">
            <Image
              src={fragrance.posterSrc}
              unoptimized
              alt={`Original ${fragrance.name} perfume bottle, sculpted glass with a brushed cap`}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 700px) 80vw, 50vw"
              className="bottle-poster"
            />
          </div>
          <div className="hero-bottom">
            <a href="#origin" className="scroll-cue">
              <span aria-hidden="true">↓</span> Scroll to unfold the story
            </a>
            <p>
              {fragrance.name.toUpperCase()} · NO. {fragrance.number}
              <span>EAU DE PARFUM · A CONCEPT</span>
            </p>
          </div>
          <div className="hero-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      <section
        className="origin chapter light-section"
        id="origin"
        data-chapter="1"
        aria-labelledby="origin-title"
      >
        <div className="chapter-heading">
          <p className="eyebrow">01 — THE ORIGIN</p>
          <p>Less, with intention.</p>
        </div>
        <div className="origin-grid">
          <div
            className="origin-visual poster-stage"
          >
            <Image
              src={fragrance.posterSrc}
              unoptimized
              alt="A study of the bottle’s thick glass, narrow collar and brushed cap"
              fill
              sizes="(max-width: 700px) 80vw, 45vw"
              className="bottle-poster"
            />
            <span className="study-caption">
              A study of form, before fragrance.
            </span>
          </div>
          <div className="origin-copy">
            <h2 id="origin-title" data-reveal>
              Formed
              <br />
              in silence.
            </h2>
            <p className="large-copy">Remembered in motion.</p>
            <p>
              Maison Éclat begins with an idea: a fragrance can hold the
              atmosphere of a moment. The cool of an evening. A window opened to
              light. The warmth of something familiar.
            </p>
            <p>Three imagined compositions, each with a presence of its own.</p>
            <a className="text-link" href="#composition">
              Explore the composition<span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="composition chapter"
        id="composition"
        data-chapter="2"
        aria-labelledby="composition-title"
      >
        <div className="chapter-heading">
          <p className="eyebrow">02 — THE COMPOSITION</p>
          <p>An impression, unfolding.</p>
        </div>
        <div className="composition-grid">
          <div className="composition-copy">
            <h2 id="composition-title" data-reveal>
              Every note,
              <br />a different story.
            </h2>
            <p>
              A first spark. A softer heart. A trace that stays.
              <br />
              Explore the layers of {fragrance.name} No. {fragrance.number}.
            </p>
            <NotesExplorer fragrance={fragrance} onLayerChange={setNoteLayer} />
          </div>
          <div className="composition-art" data-note-layer={noteLayer}>
            <Image
              src="/textures/botanical.svg"
              width={700}
              height={700}
              alt=""
              className="botanical"
            />
            <div
              className="composition-bottle poster-stage"
              data-scene-window="composition"
            >
              <Image
                src={fragrance.posterSrc}
                unoptimized
                alt={`${fragrance.name} bottle surrounded by fine botanical studies`}
                fill
                sizes="(max-width: 700px) 70vw, 35vw"
                className="bottle-poster"
              />
            </div>
            <span className="note-orbit orbit-top">
              {fragrance.topNotes[0]}
            </span>
            <span className="note-orbit orbit-heart">
              {fragrance.heartNotes[0]}
            </span>
            <span className="note-orbit orbit-base">
              {fragrance.baseNotes[0]}
            </span>
          </div>
        </div>
      </section>

      <CollectionSection />

      <section
        className="ritual chapter"
        id="ritual"
        data-chapter="4"
        aria-labelledby="ritual-title"
      >
        <Image
          src="/textures/light-study.webp"
          alt="Original abstract study of amber light refracting through sculpted glass"
          fill
          sizes="100vw"
          className="ritual-image"
        />
        <div className="ritual-content">
          <p className="eyebrow">04 — THE RITUAL</p>
          <h2 id="ritual-title" data-reveal>
            The art
            <br />
            of lingering.
          </h2>
          <p>
            Some things need no announcement.
            <br />
            Only a little time, and a little closeness.
          </p>
          <span className="ritual-caption">LIGHT STUDY · MAISON ÉCLAT</span>
        </div>
      </section>

      <section
        className="invitation chapter"
        id="invitation"
        data-chapter="5"
        aria-labelledby="invitation-title"
      >
        <div className="invitation-copy">
          <p className="eyebrow">05 — THE INVITATION</p>
          <h2 id="invitation-title" data-reveal>
            Find your
            <br />
            signature.
          </h2>
          <p>{fragrance.tagline}</p>
          <Link href={`/fragrances/${fragrance.slug}`} className="text-link">
            Explore {fragrance.name}
            <span aria-hidden="true">↗</span>
          </Link>
          <a className="quiet-link" href="#collection">
            Revisit the three compositions
          </a>
        </div>
        <div
          className="invitation-stage poster-stage"
          data-scene-window="invitation"
        >
          <Image
            src={fragrance.posterSrc}
            unoptimized
            alt={`${fragrance.name} No. ${fragrance.number} perfume bottle`}
            fill
            sizes="(max-width: 700px) 70vw, 40vw"
            className="bottle-poster"
          />
        </div>
      </section>
    </main>
  );
}
