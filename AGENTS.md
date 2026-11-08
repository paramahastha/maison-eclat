# Maison Éclat implementation guidance

Read `docs/IMPLEMENTATION_LOG.md` and the project documentation before continuing. The site is an original fictional fragrance concept, with no commerce or ingredient/manufacturing claims.

- Preserve unrelated user work, including the existing deletions of Spec Kit files. Do not restore or commit those changes incidentally.
- Build in vertical phases: implement, run the relevant checks, inspect the browser, fix, log evidence. Never claim an unexecuted check passed.
- Use Next.js App Router, strict TypeScript, semantic CSS tokens/Tailwind, stable React-compatible R3F, Drei, and GSAP. Native scrolling; no wheel interception. One persistent home canvas; DOM content independent of WebGL.
- Separate content, layout, sections, product controls, scene and choreography. No per-frame React state. Clean up animation contexts and listeners.
- Editorial asymmetric compositions; ink, ivory and brass; Cormorant Garamond/Manrope. Original procedural bottle/assets. No reference-brand logos, photos, packaging, models or copied code.
- Reduced motion gets a complete static experience. Verify keyboard/menu focus, mobile, context loss and WebGL fallback. Use screenshots as evidence, not just passing tests.
- Run lint, typecheck, unit tests, production build and Playwright for final validation. Record actual outcomes, screenshot locations and limitations in docs.
- No paid services, public deployment, secrets, payments, data collection, analytics or repository publishing without explicit authorization.
- Keep `docs/IMPLEMENTATION_LOG.md` current with phase, executed commands/results, visual evidence, decisions, open issues and exact next actions. Read it on resume.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
