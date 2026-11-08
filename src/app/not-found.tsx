import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <p className="eyebrow">AN UNWRITTEN CHAPTER · 404</p>
      <h1>
        A trace
        <br />
        not found.
      </h1>
      <p>This composition isn’t part of the collection.</p>
      <Link className="text-link" href="/#collection">
        Return to the collection<span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
