import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/" className="footer-brand">
        MAISON ÉCLAT
      </Link>
      <div className="footer-bottom">
        <p>Concept experience — no purchases processed.</p>
        <Link href="/#collection">Explore the collection</Link>
        <p>The art of lingering.</p>
      </div>
    </footer>
  );
}
