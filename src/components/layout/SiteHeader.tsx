"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const links = [
  { title: "The story", id: "origin" },
  { title: "Composition", id: "composition" },
  { title: "Collection", id: "collection" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  function close() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  }
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const items = dialog.current?.querySelectorAll<HTMLElement>(
      "button:not([disabled]), a[href]",
    );
    if (!items?.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  const href = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Maison Éclat home">
          MAISON ÉCLAT<span>PARFUMS</span>
        </Link>
        <nav aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.id} href={href(link.id)}>
              {link.title}
            </Link>
          ))}
        </nav>
        <button
          ref={trigger}
          className="menu-trigger"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
        >
          <span>Menu</span>
          <i aria-hidden="true">
            <b />
            <b />
          </i>
        </button>
      </header>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-labelledby="menu-title"
        onKeyDown={trapFocus}
        onCancel={close}
        onClose={() => setOpen(false)}
      >
        <div className="menu-top">
          <span id="menu-title" className="wordmark">
            MAISON ÉCLAT
          </span>
          <button
            onClick={close}
            className="close-menu"
            aria-label="Close menu"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Expanded navigation">
          {links.map((link, index) => (
            <Link key={link.id} href={href(link.id)} onClick={close}>
              <span>0{index + 1}</span>
              {link.title}
            </Link>
          ))}
        </nav>
        <p>The art of lingering.</p>
        <p className="menu-notice">A fictional fragrance collection.</p>
      </dialog>
    </>
  );
}
