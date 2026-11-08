import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fragrances, getFragrance } from "@/data/fragrances";
import { NotesExplorer } from "@/components/product/NotesExplorer";
import { ProductInspector } from "@/components/product/ProductInspector";

export function generateStaticParams() {
  return fragrances.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const fragrance = getFragrance((await params).slug);
  return fragrance
    ? {
        title: `${fragrance.name} No. ${fragrance.number}`,
        description: fragrance.description,
      }
    : { title: "Fragrance not found" };
}
export default async function FragrancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const fragrance = getFragrance((await params).slug);
  if (!fragrance) notFound();
  return (
    <main id="main" className="product-page" data-variant={fragrance.id}>
      <Link className="back-link" href="/#collection">
        <span aria-hidden="true">←</span> Back to the collection
      </Link>
      <div className="product-grid">
        <div className="product-heading">
          <p className="eyebrow">COLLECTION 01 · EAU DE PARFUM</p>
          <h1>
            {fragrance.name}
            <span>No. {fragrance.number}</span>
          </h1>
        </div>
        <ProductInspector fragrance={fragrance} />
        <div className="product-information">
          <p className="large-copy">{fragrance.tagline}</p>
          <p>{fragrance.description}</p>
          <NotesExplorer fragrance={fragrance} />
          <p className="concept-note">
            A fictional fragrance study.
            <br />
            Concept experience — no purchases processed.
          </p>
          <a className="text-link" href="#other-compositions">
            Discover the other compositions<span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <section
        id="other-compositions"
        className="other-compositions"
        aria-labelledby="other-title"
      >
        <h2 id="other-title">Another atmosphere.</h2>
        <div>
          {fragrances
            .filter((item) => item.id !== fragrance.id)
            .map((item) => (
              <Link href={`/fragrances/${item.slug}`} key={item.id}>
                <Image src={item.posterSrc} alt="" width={240} height={300} unoptimized />
                <span>
                  <small>NO. {item.number}</small>
                  {item.name}
                  <em>{item.tagline}</em>
                </span>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
