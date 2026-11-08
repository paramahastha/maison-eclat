import type { Metadata } from "next";
import Link from "next/link";
import { NotesExplorer } from "@/components/product/NotesExplorer";
import { fragrances } from "@/data/fragrances";

export const metadata: Metadata = {
  title: "Design study",
  robots: { index: false, follow: false },
};
export default function StyleGuidePage() {
  return (
    <main id="main" className="style-guide">
      <p className="eyebrow">MAISON ÉCLAT · DESIGN STUDY</p>
      <h1>Form, type & light.</h1>
      <section aria-labelledby="palette-title">
        <h2 id="palette-title">The palette</h2>
        <div className="swatches">
          {[
            ["Ink", "#11120f"],
            ["Ivory", "#f3efe6"],
            ["Paper", "#e7dfd2"],
            ["Brass", "#b79b68"],
          ].map(([name, color]) => (
            <span
              key={name}
              style={{
                background: color,
                color: name === "Ink" ? "#f3efe6" : "#11120f",
              }}
            >
              {name}
              <br />
              {color}
            </span>
          ))}
        </div>
      </section>
      <section aria-labelledby="type-title">
        <h2 id="type-title">A presence that remains.</h2>
        <p className="large-copy">Cormorant Garamond. The art of lingering.</p>
        <p>
          Manrope. Three original fragrance compositions, an exploration of
          memory and light.
        </p>
        <Link className="text-link" href="/#collection">
          Discover the collection<span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section aria-labelledby="states-title">
        <h2 id="states-title">Composition & states</h2>
        <NotesExplorer fragrance={fragrances[0]} />
        <p>
          Use Tab, arrow keys, Home and End to explore the note controls. Focus
          states remain visible throughout.
        </p>
        <div className="guide-products">
          {fragrances.map((item) => (
            <Link
              href={`/fragrances/${item.slug}`}
              key={item.id}
              style={{
                background: item.palette.ground,
                color: item.palette.ink,
              }}
            >
              {item.name} No. {item.number}
              <span>{item.tagline}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
