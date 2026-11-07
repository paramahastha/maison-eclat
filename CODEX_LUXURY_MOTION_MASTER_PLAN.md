# CODEX MASTER BUILD PLAN — MAISON ÉCLAT

> **Status:** Ready for Codex execution  
> **Version:** 1.0  
> **Prepared:** 2026-11-07  
> **Project:** Maison Éclat — an original, immersive luxury fragrance website  
> **Target environment:** macOS Apple Silicon (MacBook Pro M4, 16 GB RAM), Node.js LTS, npm, Codex signed in using ChatGPT  
> **Primary mode:** Codex acts as the implementation agent. This document is the single source of truth.

---

## 0. START HERE — DIRECT INSTRUCTIONS TO CODEX

**You are the autonomous lead creative developer, technical motion designer, 3D implementation engineer, QA engineer, and project integrator for this repository.** The user wants you to complete the website end to end, not merely explain how to build it.

**Read this entire file before writing application code.** Then:

1. Inspect the current directory; if an application exists, inventory it and integrate safely rather than overwriting unrelated work. If this is a new/empty directory, scaffold the project.
2. Create or update `AGENTS.md` with the enduring instructions in this document, plus `docs/PRD.md`, `docs/DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/ASSET_REGISTER.md`, `docs/IMPLEMENTATION_LOG.md`, and `docs/QA_REPORT.md`.
3. Implement the project through phases **0–12** below. **Do not stop at documentation, wireframes, scaffolding, or a visually generic template.** Your goal is a complete, running site with original aesthetics, substantial working animation, and documented validation.
4. Make pragmatic decisions independently. Do **not** ask the user to make routine technical/design choices already resolved in this specification. If a tool/asset is unavailable, implement the strongest feasible local fallback and document the difference.
5. Write actual code, run commands, render the page, inspect screenshots (using Playwright MCP if available; otherwise Playwright tests/CLI), fix issues, and verify again. Do not claim tests passed unless you executed them.
6. After each phase: run the relevant quality commands, log completed items, problems, changes, and next actions in `docs/IMPLEMENTATION_LOG.md`; commit at meaningful milestones **only when inside a Git repository and doing so is consistent with the user's workflow**.
7. Continue across phases in the current working session while tool/context limits allow. If interrupted, leave an accurate resume checkpoint in `docs/IMPLEMENTATION_LOG.md` so the next Codex session can continue without repeating completed work.
8. Never use copyrighted Chanel/Dior/Gucci/D&G/LV logos, product photos, packaging designs, 3D models, or proprietary code. These brands are **motion references only**. Create an original concept; do not present it as affiliated with an existing luxury brand.
9. Never introduce a paid SaaS dependency, request a credit card, spend money, publish publicly, register a domain, or access external credentials without the user's explicit authorization. Local execution must be completely achievable with free tools. Deployment preparation is required; actual public deployment requires appropriate access and approval.
10. If Codex cannot access an image generator, paid design service, or asset library, generate original assets programmatically using Blender Python, SVG, CSS, and/or Three.js. Do not block the project waiting for third-party images. Do not falsely label placeholders as finished photography.

**Success means the user can run `npm install && npm run dev`, scroll through a polished cinematic site, interact with the products, browse a product page, and see passing build/tests plus documented visual QA.**

### How the user should launch this plan

Place this file in the project root as `CODEX_LUXURY_MOTION_MASTER_PLAN.md`. Open the folder in Terminal and run `codex` (sign in with ChatGPT if required). Paste:

> **Read `CODEX_LUXURY_MOTION_MASTER_PLAN.md` completely and execute it as the source of truth. You own implementation, original asset generation, testing, and iteration. Start now. Do not stop after planning or scaffolding. Keep `docs/IMPLEMENTATION_LOG.md` updated and complete all feasible phases before reporting back.**

For a subsequent session, paste:

> **Continue the project according to `CODEX_LUXURY_MOTION_MASTER_PLAN.md` and `docs/IMPLEMENTATION_LOG.md`. Inspect the actual repo state, resume at the first incomplete phase, run tests, and continue implementation. Do not repeat finished work or claim unexecuted checks.**

---

## 1. PRODUCT VISION AND NON-NEGOTIABLE DELIVERABLES

### Vision

Create **Maison Éclat**, a fictional independent haute-parfumerie concept website that feels like an art-directed campaign rather than a conventional shop. The reference **experience principles** are:

| Reference | Borrow this principle | Do NOT copy |
|---|---|---|
| Dolce & Gabbana Velvet | Interactive fragrance discovery, luxurious transitions, tactile hover effects | Campaign imagery, brand identity, copy, product designs |
| Bleu de Chanel L'Exclusif | Single hero object, cinematic lighting, scroll-controlled camera/object transforms | The Bleu bottle or trademark |
| Dioriviera | Layered environmental storytelling and depth | Dior campaign assets, scenery, typography exactness |
| Gucci Beauty Wishes | Dreamlike interactive details, particles, intentional camera transitions | Gucci garden, flowers, illustrations |
| Rouge Dior | Editorial composition, dramatic product reveals, premium color changes | Dior lipstick packaging and art direction exactness |

**Website personality:** editorial, tactile, dramatic, precise, elegant, unusual but not gimmicky. Avoid generic SaaS layouts, gratuitous gradients, excessive glassmorphism, and busy card stacks.

### Scope

**Must ship:**
- Working responsive marketing website with cinematic home experience, six deliberate story chapters, and **3 original fragrance variants**.
- Procedurally generated or original authored 3D perfume bottle; user can rotate/inspect it on a product view.
- One persistent scroll-driven WebGL canvas for the home story rather than remounting canvases on every chapter.
- Art-directed 2D typography, backgrounds, patterns, lighting and textures, with graceful static alternatives.
- Route `/` plus product-detail route `/fragrances/[slug]` for each fragrance and useful `not-found` handling.
- Product variant selector, notes explorer, navigation, accessible mobile menu, transitions, and working links/CTAs.
- Original brand identity, favicon, OG image, SEO metadata, 3D fallback poster, loading state.
- Tests, visual QA, accessibility, performance optimization, README, deployment preparation.

**Not in initial release:** checkout, accounts, payments, actual inventory, analytics tied to personal data, email collection, CMS, external database, AI chat, or live stock/price claims. Provide a clear **"Concept experience — no purchases processed"** note in footer or product CTA area; never create misleading fake purchase flows.

### Primary users and journeys

- **Visual explorer:** lands on dramatic hero → scrolls through fragrance story → understands three notes → views signature variants.
- **Product browser:** navigates to collection → chooses variant → visits product page → rotates the bottle → explores composition.
- **Mobile visitor:** receives a legible, fluid, non-janky alternative, not a broken desktop 3D site.
- **Keyboard/reduced-motion user:** can access all content and controls without scroll animation or pointer-only behavior.

### Suggested original brand copy

Use short editorial language and avoid inflated factual claims about actual ingredients or manufacturing.

- Brand: **MAISON ÉCLAT**
- Tagline: **The art of lingering.**
- Hero eyebrow: **AN OLFACTORY STUDY / COLLECTION 01**
- Hero heading: **A presence that remains.**
- Hero CTA: **Discover the collection**
- Origin section: **Formed in silence. Remembered in motion.**
- Notes section: **Every note tells a different story.**
- Collection section: **Three interpretations of a moment.**
- Final CTA: **Find your signature.**

The fragrances are fictional compositions; do not make unsupported safety, sustainability, dermatological, naturalness, or origin claims.

### Three fragrance records

Maintain typed data in `src/data/fragrances.ts`, not scattered literals:

| Slug | Display name | Theme | Top | Heart | Base | Scene palette |
|---|---|---|---|---|---|---|
| `obsidian-01` | Obsidian No. 01 | smoky / sculptural | Bergamot, black pepper | Iris, incense | Vetiver, amberwood | Ink, brass, warm charcoal |
| `neroli-02` | Neroli No. 02 | luminous / airy | Neroli, petitgrain | Jasmine, orange blossom | White musk, cedar | Ivory, pale gold, muted citrus |
| `santal-03` | Santal No. 03 | intimate / warm | Cardamom, fig leaf | Violet, tea accord | Sandalwood, benzoin | Umber, sand, dark bronze |

Model fields: `id`, `slug`, `number`, `name`, `tagline`, `description`, `topNotes[]`, `heartNotes[]`, `baseNotes[]`, `palette`, `visualVariant`, `posterSrc`, `ogSrc?`. The fragrances are conceptual content, not regulated ingredient disclosures.

---

## 2. UX INFORMATION ARCHITECTURE

### Sitemap

```text
/
  ├─ Hero / The Encounter
  ├─ The Origin
  ├─ The Composition
  ├─ The Collection
  ├─ The Ritual
  └─ Final Invitation + Footer
/fragrances/obsidian-01
/fragrances/neroli-02
/fragrances/santal-03
```

### Navigation

- Wordmark `MAISON ÉCLAT` at left; `The story`, `Composition`, `Collection` and icon-based menu on desktop; accessible hamburger on mobile.
- Menu overlay: quiet full-viewport cream or near-black panel, editorial links, staggered entrance, escape-to-close, focus trap and scroll locking. Respect reduced motion.
- In-page anchors take users to actual HTML sections with `scroll-margin-top`.
- Product page contains a clearly labeled back-to-collection link.
- Footer has concept notice, accessible navigation, optional external portfolio credit if user supplies one; do not invent social accounts.

### Home chapter choreography

The sequence below defines visual direction, not arbitrary CSS parallax. Use one coordinated GSAP/scroll controller.

| Chapter | Main visual | Interaction and transition | Reduced-motion alternate |
|---|---|---|---|
| **01 Encounter** | Oversized bottle on deep ink background, backlit rim, restrained headline | Intro title reveal; bottle rises 10–15%, rotates ~10–20°, slow specular change while scrolling; cue scroll | Static product poster and full text |
| **02 Origin** | Bottle slides off-center, tall editorial heading, gold line | Camera makes modest dolly/slide, typography masked reveal, background transitions to warm ivory | Normal section flow, no pinning |
| **03 Composition** | Three note orbits around silhouette / original abstract botanicals | Click/tap top-heart-base tabs; scroll chapter subtly rotates bottle; keyboard-operable tabs | Visible notes panels without motion |
| **04 Collection** | Three product identities with distinct palettes and labels | Click variant buttons; crossfade color/lighting and bottle accents; link to product page | Instant accessible swap |
| **05 Ritual** | Dramatic close-up / generated macro abstract image, editorial quote | Gentle horizontal-to-vertical composition transition; no scroll hijacking | Static editorial layout |
| **06 Invitation** | Signature bottle returns, focused wordmark and CTA | Elegant settling motion and fade-to-footer; normal scroll resumes | Static product + CTA |

**Timings and easing guidelines:**
- UI hover: 180–260 ms; standard reveal: 500–750 ms; full-screen transition: 650–1000 ms.
- Prefer GSAP `power2.out`, `power3.out`, and custom cubic-bezier for CSS; use no artificial delay that makes controls feel sluggish.
- Scroll-tied animation should be scrubbed and use restrained easing; pin only where essential, with clear escape to next content.
- Narrative text must remain in DOM and readable if JavaScript is disabled (progressive enhancement as feasible).
- Avoid wheel event interception and custom scroll hijacking.

### Product detail page

- Title, subtitle, visual product stage with drag/swipe orbit and accessible rotation controls or reset button.
- Top/heart/base tabs with descriptions and an accessible accordion alternative on narrow screens.
- Collection thumbnails/links to switch variants.
- Clearly state demonstration concept and no checkout.
- Sticky product information on desktop only if it does not trap users; mobile uses natural vertical flow.

---

## 3. VISUAL DESIGN SYSTEM — IMPLEMENT, DON'T JUST DOCUMENT

### Tokens

Put CSS custom properties in `src/app/globals.css`, with semantic variables rather than magic colors:

```css
:root {
  --ink: #11120f;
  --ink-soft: #25261f;
  --ivory: #f3efe6;
  --paper: #e7dfd2;
  --brass: #b79b68;
  --bronze: #7a5d3a;
  --muted: #a39b8d;
  --focus: #e0b974;
  --ease-luxe: cubic-bezier(.22, 1, .36, 1);
  --content-max: 1440px;
}
```

Variant themes may override CSS variables via data attributes. Ensure meaningful contrast rather than blindly using decorative gold for small text.

### Typography

- Display: `Cormorant Garamond` or another genuinely open-license elegant display face.
- Body and interface: `Inter` or `Manrope`.
- Load using `next/font` or locally bundled assets with verified redistribution license; maintain robust system-font fallbacks.
- Desktop display scale: `clamp(4rem, 8.2vw, 10rem)` with editorial line height. Mobile: `clamp(3rem, 12vw, 5.4rem)` and no clipping.
- Body 16–18px, deliberate column widths, ample whitespace, quiet letterspacing for eyebrows.
- Small copy should remain comfortably readable; do not sacrifice usability for mood.

### Layout and surfaces

- Desktop: strong asymmetric art direction with headline/text left and product object center/right, generous margins, purposeful overlap.
- Mobile: product centered; stacked headings; no horizontal overflow; refrain from oversized pinned scenes on short viewports.
- Use subtle grain with CSS/SVG procedural noise (small asset, low opacity), not huge video overlays.
- Buttons: fine underline or thin border, soft hover translation and reveal; large enough tap targets.
- Cursor effect must be decorative and disabled for touch/reduced-motion modes, never replace the actual pointer or hide UI.

### Required design artifacts

Generate a style guide route or documented screenshots showing colors, type, navigation, CTA, note pills, selectors, and product states. Use original generated graphics / procedural backgrounds. Treat high-quality art direction as a functional deliverable.

---

## 4. TECHNOLOGY AND TOOLING

### Mandatory stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js App Router + React + TypeScript | Routing, metadata, React component model |
| Styling | Tailwind CSS + semantic CSS variables | Layout utility + coherent visual tokens |
| 3D | Three.js + React Three Fiber **stable React-compatible release** | Persistent declarative scene |
| 3D helpers | Drei | Model loading, environment, common interaction helpers |
| Scroll choreography | GSAP + ScrollTrigger + `@gsap/react` | Deterministic timeline control / cleanup |
| Smooth scrolling | Lenis (only if needed and tested) | Optional; native scrolling is acceptable |
| UI transitions | Motion for React OR GSAP, choose one per component | Avoid competing transforms on same elements |
| State | Zustand or context for minimal shared state | Selected product / menu / performance mode |
| Postprocessing | react-postprocessing, **only if performance permits** | Moderate bloom/vignette, never blanket blur |
| 3D authoring | Blender (free) via Python script, or procedural Three.js model | Generate entirely original bottle and render poster |
| Testing | Vitest, Testing Library, Playwright, axe-core | Unit, functional, browser and a11y checks |
| Browser agent | Playwright MCP when installed | Codex-controlled UX checks |
| Hosting preparation | Vercel-compatible Next.js configuration | No proprietary runtime coupling |

**Dependency policy:** Check installed Node, npm, Next, React and R3F compatibility before choosing exact versions. Use stable releases and commit `package-lock.json`. As of the reference check, R3F v10 documentation describes an alpha; **do not automatically install alpha R3F**. Avoid package churn without justification. Avoid adding entire UI kits for a small bespoke website.

### Initial bootstrap commands (adapt to environment)

```bash
node --version
npm --version
# If no app exists in this directory, scaffold it:
npx create-next-app@latest luxe-motion --ts --tailwind --eslint --app --src-dir --use-npm --yes
cd luxe-motion
npm install three @react-three/fiber @react-three/drei gsap @gsap/react lenis motion zustand
npm install -D @types/three @playwright/test vitest @testing-library/react @testing-library/jest-dom jsdom @axe-core/playwright
# Add postprocessing only when the baseline 3D scene works:
# npm install @react-three/postprocessing postprocessing
npx playwright install chromium
```

Codex should adjust the commands if the repository already exists or peer dependency resolution requires verified stable combinations; don't run a fresh create-app inside an existing project.

**Optional Codex browser tooling (if available and not already configured):**

```bash
codex mcp add playwright npx "@playwright/mcp@latest"
```

MCP is optional. Playwright tests and screenshots are mandatory regardless.

### Source of truth for implementation

- Next.js app-router docs: <https://nextjs.org/docs/app>
- React Three Fiber stable docs: <https://r3f.docs.pmnd.rs/getting-started/introduction>
- Drei: <https://github.com/pmndrs/drei>
- GSAP ScrollTrigger: <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>
- GSAP React: <https://gsap.com/resources/React/>
- Lenis: <https://github.com/darkroomengineering/lenis>
- Motion: <https://motion.dev/docs/react>
- Blender: <https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html>
- glTF Transform: <https://gltf-transform.dev/>
- Playwright: <https://playwright.dev/docs/intro>
- Codex AGENTS.md guidance: <https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex>

---

## 5. ARCHITECTURE AND KEY ENGINEERING RULES

### Proposed project structure

```text
luxe-motion/
├── CODEX_LUXURY_MOTION_MASTER_PLAN.md
├── AGENTS.md
├── README.md
├── package.json
├── package-lock.json
├── .github/workflows/ci.yml
├── docs/
│   ├── PRD.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── ASSET_REGISTER.md
│   ├── IMPLEMENTATION_LOG.md
│   ├── QA_REPORT.md
│   ├── PERFORMANCE_REPORT.md
│   └── screenshots/
├── scripts/
│   ├── blender/generate_perfume.py
│   ├── optimize-assets.mjs
│   └── validate-assets.mjs
├── public/
│   ├── models/maison-bottle.glb
│   ├── posters/
│   ├── textures/
│   └── branding/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   └── fragrances/[slug]/page.tsx
│   ├── components/
│   │   ├── motion/ScrollDirector.tsx
│   │   ├── scene/StoryCanvas.tsx
│   │   ├── scene/BottleModel.tsx
│   │   ├── scene/CameraRig.tsx
│   │   ├── scene/StudioLighting.tsx
│   │   ├── scene/BottleFallback.tsx
│   │   ├── layout/SiteHeader.tsx
│   │   ├── layout/MobileMenu.tsx
│   │   ├── layout/SiteFooter.tsx
│   │   ├── sections/HeroSection.tsx
│   │   ├── sections/OriginSection.tsx
│   │   ├── sections/CompositionSection.tsx
│   │   ├── sections/CollectionSection.tsx
│   │   ├── sections/RitualSection.tsx
│   │   ├── sections/FinalSection.tsx
│   │   └── product/NotesExplorer.tsx
│   ├── data/fragrances.ts
│   ├── hooks/useReducedMotion.ts
│   ├── hooks/useWebGLSupport.ts
│   ├── lib/animation-tokens.ts
│   ├── lib/quality-presets.ts
│   └── types/fragrance.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── playwright.config.ts
└── vitest.config.ts
```

Adjust to actual conventions, but preserve **separation of content, sections, 3D scene, motion direction, and tests**.

### Scene architecture

- The home page has **one lazily loaded client-side R3F `<Canvas>`** in a persistent fixed/sticky visual layer. It remains mounted as users move among chapters.
- DOM content lives outside WebGL in semantic `<main>` with real headings, links and buttons. The 3D canvas is decorative except the accessible product inspector on detail pages.
- A `ScrollDirector` owns chapter progress and maps it to *one coherent set of camera, bottle, light, and background properties*. Avoid each chapter independently changing the same 3D transform.
- Normalize narrative progress to `[0,1]` per chapter. Keep timeline definitions in `src/lib/animation-tokens.ts` or a related timeline module.
- Use refs to mutate animation targets rather than calling React state every scroll frame. Use `useGSAP` with proper scope/context cleanup and `ScrollTrigger` refresh when layout changes.
- If integrating Lenis, choose **one** RAF owner and synchronize ScrollTrigger properly; never instantiate competing smooth-scroll instances or double-scroll handlers. Native scroll is preferable if Lenis adds instability.
- Route transitions are DOM transitions, not a reason to remount a massive second scene. Product details may use a separate small inspector canvas, mounted only on its route.
- During route changes, dispose of textures/geometries and events associated with genuinely unmounted scenes. Test back/forward navigation.

### Performance presets

Create a quality policy rather than targeting one computer only:

| Preset | Example target | DPR | Effects | Behavior |
|---|---|---|---|---|
| High | modern desktop / user-selectable | clamp max ~1.75 | restrained effects | full smooth interactive scene |
| Medium | mainstream laptop/tablet | max ~1.25–1.5 | low-cost effects | scene simplification |
| Low | mobile / constrained | max ~1 | no heavy postprocessing | simpler glass + lower detail |
| Static | reduced motion / unsupported WebGL / context loss | N/A | none | HTML/CSS + rendered poster |

Presets must be based on feature detection and pragmatic degradation, **not** invasive device fingerprinting. Never use only the user-agent string to decide compatibility. Pause/render on demand when offscreen and appropriate.

---

## 6. ORIGINAL 3D ASSET GENERATION (NO PAID ASSET REQUIRED)

### Required bottle

Codex should create an original, refined, elegant bottle with a recognizable but non-infringing shape. Direction: tall rectangular body with softly rounded edges, thick glass base, separate dark amber inner liquid, narrow collar, brushed-metal cap, thin custom label, subtle engraved emblem. Do not imitate distinctive product trade dress from reference brands.

Required independent objects/materials:

1. `Bottle_Glass`: physically based glass / transmission appearance.
2. `Bottle_Liquid`: warm translucent fluid, slightly below shoulder line.
3. `Bottle_Cap`: independent metallic brushed cap.
4. `Bottle_Collar`: brass ring and seam.
5. `Bottle_Label`: custom wordmark/type treatment, separate mesh/texture.
6. `Bottle_Base`: thick refractive-looking base, coherent silhouette.

### Preferred implementation method

Create `scripts/blender/generate_perfume.py` using the Blender `bpy` API. It should:

- Be runnable headlessly with `blender --background --python scripts/blender/generate_perfume.py` when Blender is installed.
- Procedurally create the meshes, UVs/normals/bevels, materials and studio lighting; configure a camera.
- Export a glTF/GLB into `public/models/maison-bottle.glb` and create one or more high-quality static poster images into `public/posters/`.
- Provide a deterministic generation path, clear version requirements, and comments for modifying proportions/colors.
- Where Blender's offline material system and Three.js glTF materials differ, tune **both** separately rather than relying on Blender's render as proof that WebGL glass looks realistic.

**Fallback if Blender is not installed/available:** construct the bottle procedurally in Three.js/R3F from original geometries and simple textures. Produce an original SVG/CSS poster as a static accessible fallback. Do not fail the build because Blender is missing. Document any remaining visual quality gap.

### Render quality checklist

- Clear silhouette at small and large sizes.
- Convincing specular reflections without excessive bloom.
- Glass looks transparent/reflective (appropriate environment and lighting), with controlled visual noise.
- Label is aligned and not mirrored; cap is distinct from liquid.
- Bottle is not dark/featureless against dark background; warm gold rim light defines edges.
- Mobile lighting does not flatten the object.
- On supported browsers, the 3D model loads without texture or shader warnings.
- Static poster closely matches the 3D object's silhouette/brand identity.

### Asset legality and optimization

- Use original generated imagery, CSS/SVG, Blender output, or properly licensed CC0 material such as Poly Haven (verify individual items).
- Record each external asset, author/source URL, license, modified status, attribution requirements in `docs/ASSET_REGISTER.md`.
- No hotlinking external images in production.
- Create optimized WebP/AVIF images where supported; provide dimensions, responsive variants, stable aspect ratios.
- Run glTF optimizer if safely compatible; inspect visual quality and verify any decoder/transcoder is actually bundled.
- Initial target: main GLB around **1.5 MB or less if achievable without visible degradation**; do not sacrifice necessary quality for an arbitrary size limit.
- Keep original source `.blend` or generation script, so assets can be regenerated.

---

## 7. END-TO-END IMPLEMENTATION PHASES

The phases below are ordered. Every phase ends with a working app, updated documentation, and recorded validation. **Do not advance with knowingly broken builds.**

### PHASE 0 — Repository inspection and preflight

**Tasks**
- [ ] Check current directory, Git status, existing files, Node and npm versions, available Blender, Codex/Playwright tooling.
- [ ] If existing code, inspect before modifying; preserve user changes.
- [ ] Select stable dependency versions compatible with current Next/React/R3F; document reasons.
- [ ] Record initial assumptions and unavailable tools.

**Exit gate:** A documented preflight summary exists; there are no destructive actions pending.

### PHASE 1 — Project foundation and agent handoff

**Tasks**
- [ ] Create Next.js + TypeScript + Tailwind app if needed, strict TS and lint rules.
- [ ] Install verified dependencies and scripts (`dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`).
- [ ] Create `AGENTS.md` encoding: priority of this plan; aesthetic requirements; coding rules; phase gates; test/visual audit; asset licensing; resume instructions; prohibition on claiming unexecuted work.
- [ ] Create PRD, architecture, design system and asset register; use this plan as source, not generic filler.
- [ ] Create `src/data/fragrances.ts` with typed products and validation.
- [ ] Make initial page render and build.

**Exit gate:** `npm run build` and typecheck succeed, with a functioning skeleton and content data.

### PHASE 2 — Brand system and semantic page shells

**Tasks**
- [ ] Implement global fonts, tokens, responsive grid, texture and editorial typography.
- [ ] Implement header, accessible mobile overlay, footer, skip link, visible focus states.
- [ ] Implement the six real semantic sections with complete copy and working anchor links.
- [ ] Add responsive product detail template and 404 page.
- [ ] Add original favicon, metadata/OG image and lightweight default poster.
- [ ] Test viewport widths 375, 768, 1024, 1440 and 1920 px.

**Exit gate:** The non-WebGL website already looks coherent and is fully navigable without motion.

### PHASE 3 — Original bottle asset + inspection scene

**Tasks**
- [ ] Create procedural bottle generation script and export GLB/static posters if Blender available.
- [ ] Load GLB through Drei or create a procedural R3F bottle if unavailable.
- [ ] Create studio lighting/background with tunable dark and light environments.
- [ ] Create product inspector with controlled orbit/drag, sensible min/max polar/zoom, reset position.
- [ ] Verify lighting, cap, glass, label, liquid for desktop/mobile.
- [ ] Add error boundary/static poster fallback and accessible non-drag alternatives.

**Exit gate:** Original recognizable 3D bottle is visible, can be inspected, and doesn't break when WebGL is unavailable.

### PHASE 4 — Persistent story canvas and scroll state machine

**Tasks**
- [ ] Mount one persistent Canvas on the home story, client-only.
- [ ] Implement `ScrollDirector` and chapter triggers with clear cleanup.
- [ ] Synchronize camera, bottle transforms and environment lighting with scroll progress.
- [ ] Avoid re-rendering React state on every animation frame.
- [ ] Implement lazy loading and matchMedia quality presets.
- [ ] Add loading poster, interaction-ready state and context-loss handling.

**Exit gate:** Smooth, deterministic 3D choreography traverses all home chapters without remount glitches or console errors.

### PHASE 5 — Hero: the cinematic first impression

**Tasks**
- [ ] Implement dramatic headline typesetting, product composition, dramatic but controlled lighting, scroll cue.
- [ ] Intro sequence: reveal brand eyebrow → stagger title → bottle materializes/settles → CTA becomes interactive.
- [ ] Hero CTA scrolls or routes reliably to the collection.
- [ ] On mobile, avoid text/canvas overlap and too-long intro delay.
- [ ] Include reduced-motion fallback from the start.

**Exit gate:** Hero is editorial and distinct, not a generic centered text over a stock gradient.

### PHASE 6 — Origin and composition chapters

**Tasks**
- [ ] Implement warm-background / camera-transition Origin chapter.
- [ ] Implement composition exploration for top/heart/base note sets.
- [ ] Create original abstract note motifs (SVG/procedural shapes) instead of grabbing trademarked botanical art.
- [ ] Ensure notes work with tab/keyboard controls and no-motion mode.
- [ ] Ensure content remains readable against moving backgrounds.

**Exit gate:** The chapter transitions are visually cohesive; note controls work with mouse, touch and keyboard.

### PHASE 7 — Collection and variant switching

**Tasks**
- [ ] Create three distinct variants based on typed fragrance records.
- [ ] Variant selection updates theme, cap/liquid tint, text, note preview and selection state.
- [ ] Animate transitions without flashing or unloading/reloading the entire scene.
- [ ] Expose active item accessibly and make full-card/product CTAs route to detail pages.
- [ ] Verify direct deep links, refresh, browser back/forward and invalid slugs.

**Exit gate:** All three variants are visually distinct and all navigation and interactions work.

### PHASE 8 — Ritual, final invitation, and finishing interactions

**Tasks**
- [ ] Implement original dramatic editorial macro composition, light grain, intentional spatial typography.
- [ ] Return the hero motif elegantly in the final chapter.
- [ ] Add subtle premium hovers, menu reveal, section line growth and route transitions.
- [ ] Limit motion layers: no more than a few dominant moving elements simultaneously.
- [ ] Make all decorative effects nonblocking and disable cursor trails for touch/reduced motion.

**Exit gate:** Complete story from hero to footer feels like one intentional experience.

### PHASE 9 — Responsive, a11y, and robust fallback pass

**Tasks**
- [ ] Test small phones, tablets, common laptops, desktop and short landscape viewports.
- [ ] Verify reduced-motion mode removes scroll pinning, camera flythroughs, parallax and nonessential transitions while preserving all content.
- [ ] Test keyboard-only navigation, skip link, menu focus management, Escape-to-close, buttons and note tabs.
- [ ] Verify text contrast, meaningful alternative text, semantic regions, accessible names and focus visibility.
- [ ] Verify WebGL-disabled / shader failure / context-loss routes show useful posters or DOM content instead of blank regions.
- [ ] Confirm no horizontal overflow and no focus trapping outside overlays.

**Exit gate:** No critical accessibility or mobile defects; static experience is complete.

### PHASE 10 — Automated tests, browser audit and visual refinement

**Tasks**
- [ ] Add unit tests for typed fragrance data, variant transitions and utility functions.
- [ ] Add Playwright E2E coverage for home load, anchors, menu, notes, collection selection, product navigation, bad slug, keyboard and reduced motion.
- [ ] Add at least one check for WebGL fallback and recoverable rendering errors; mock capabilities where feasible.
- [ ] Run Playwright in Chromium desktop and mobile emulation; Safari/WebKit and Firefox when available, explicitly report if not installed/tested.
- [ ] Capture snapshots at 375×812, 768×1024, 1440×900 and 1920×1080, with stable font loading and screenshot readiness.
- [ ] If using image diffs, separate deterministic DOM screenshots from nondeterministic WebGL screenshots; do not set brittle pixel-perfect assertions on hardware-dependent 3D output.
- [ ] Use browser screenshots to actually **inspect visual composition**: crop, clipping, alignment, legibility, lighting, layout rhythm, motion continuity. Fix the visible issues and capture updated evidence.
- [ ] Add `@axe-core/playwright` accessibility checks and resolve critical/serious issues; document remaining limitations.

**Exit gate:** Tests pass (or concrete remaining failures are transparently recorded) and screenshots show a polished visual result.

### PHASE 11 — Performance, quality and production build

**Tasks**
- [ ] Run production `npm run build`, lint, typecheck, unit and E2E checks.
- [ ] Test on a production build (`npm run start`) in addition to development mode.
- [ ] Measure LCP, INP where available with actual interactions, and CLS; avoid claiming measured field CWV from lab-only simulations.
- [ ] Target good CWV: LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at p75 of real-world data when such data exists. Use lab substitutes for local checks and clearly distinguish them.
- [ ] Measure scene frame rate on the Mac M4, and approximate a mobile constrained profile. Aim ~60 FPS desktop with graceful degradation; report real results, not promises.
- [ ] Eliminate gratuitous 3D draw calls, too-large canvas DPR, oversized geometry, unused huge textures, unnecessary shadows, frame-by-frame React rerenders, and unneeded postprocessing.
- [ ] Defer noncritical bundles and load 3D assets behind appropriate poster/suspense boundaries.
- [ ] Optimize fonts, metadata, headings, image formats, internal linking and responsive asset sizing.
- [ ] Add a simple asset budget report and check for broken internal links and bad console messages.

**Exit gate:** Production build works, critical regressions are fixed and limitations are documented.

### PHASE 12 — Final handoff and deployment readiness

**Tasks**
- [ ] Finish README with prerequisites, local install, development, build, tests, how to regenerate assets and how to change brand/products.
- [ ] Create a CI workflow that runs lint, typecheck, unit tests, build and feasible headless smoke tests, without paid dependencies.
- [ ] Add `.env.example` only if truly needed; do not commit secrets.
- [ ] Prepare Vercel-friendly configuration and optional deploy instructions. **Do not deploy publicly without user permission/access.**
- [ ] Write `docs/QA_REPORT.md`, `docs/PERFORMANCE_REPORT.md`, and final `docs/IMPLEMENTATION_LOG.md` checkpoint.
- [ ] Provide user with: implementation summary, files created, local URL, validation commands executed, screenshot locations, known limitations, deployment steps and any missing optional external actions.

**Exit gate:** A new developer can clone the repo, install dependencies, regenerate assets if desired, build, test and run the website without additional proprietary services.

---

## 8. TEST SPECIFICATIONS AND ACCEPTANCE CRITERIA

### Mandatory functional scenarios

1. `/` loads with nonempty text content even if client WebGL is delayed or unsupported.
2. CTA `Discover the collection` navigates/scrolls correctly.
3. Menu opens/closes by mouse/touch, Escape, and navigation selection; focus returns correctly.
4. Top, heart, and base notes can be switched by mouse/touch/keyboard with visible state.
5. Switching among three fragrances changes visible name, color theme, note content, and product link consistently.
6. `/fragrances/[slug]` works on direct navigation and refresh for all three products.
7. Unknown slug produces a useful 404.
8. Drag interaction is bounded, resets correctly and never prevents normal page scrolling on mobile.
9. With `prefers-reduced-motion: reduce`, users can still browse every section and choose products.
10. When WebGL is disabled or model loading fails, static product content remains usable.
11. No broken images, hydration warnings, uncaught client exceptions or broken route transitions.
12. No purchase/checkout is implied to be available in this concept-only site.

### Accessibility acceptance

- Meets WCAG 2.2 AA principles where applicable: meaningful semantics, keyboard access, focus indication, contrast, nonessential motion reduction, sufficient target sizes, and no keyboard traps.
- One H1 per page; structured heading hierarchy.
- Forms (if introduced) need explicit labels and validation. Avoid adding forms merely for decoration.
- Buttons are `<button>`; navigation is `<a>`/Next Link; not clickable `<div>` elements.
- All interactive product affordances have accessible names and non-gesture alternatives.
- Decorative canvases are hidden from screen readers; equivalent content exists in DOM.

### Visual QA acceptance

Codex must inspect screenshots and state-specific captures, not merely run tests. Look for:

- No image/model cut off at 375 px; no heading too large to read.
- Bottle never disappears against the scene or intersects text.
- Metallic/glass highlights show the form without clipping or blowing out.
- Typography is aligned and consistently spaced; section changes feel purposeful.
- A complete visual fallback exists for users who do not see the 3D scene.
- Menu and interactive states have complete, intentionally designed visuals.
- Variation 01/02/03 clearly differs in aesthetic treatment.
- Scrolling never leaves a blank pinned section.

### Suggested scripts

Keep equivalent entries in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

Run the applicable commands after each phase and all commands at final handoff:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

If Playwright needs a running server, configure `webServer` in `playwright.config.ts`; do not require the user to manually launch a second terminal for automated tests.

---

## 9. OPERATIONAL STANDARD FOR CODEX

### Quality rules

- Work in coherent vertical slices: implement → run → inspect → fix → document → proceed.
- Maintain small, reusable components rather than a monolithic 1,000-line page.
- Prefer explicit types; avoid `any`, dead dependencies, suppressed lint errors, unexplained animation magic numbers and silent catch blocks.
- Test the important behavior, not just snapshots.
- Keep scroll state and product-selection state deterministic.
- Don't implement an entire design with generated Lorem Ipsum or placeholder gray blocks.
- Never claim "photorealistic" when the actual asset looks cartoonish or synthetic; improve or openly describe the gap.
- Build the static, accessible website first; 3D must enhance rather than gate content.
- For complex changes, read relevant code and tests before altering them.
- Avoid editing files outside this repository without approval.

### Automatic decisions: allowed

Codex may choose stable dependency versions, exact folder names, minor copy, responsive breakpoints, original procedural artwork, camera positions, animation curves, and implementation details if they remain faithful to the intended experience.

### Actions that require explicit user authorization

- Public deployment / publishing a live URL, repository publishing, purchases or paid subscriptions.
- Editing/deleting unrelated existing work or secret management outside repo.
- Using proprietary third-party imagery without confirmed license.
- Provisioning payment systems, collecting user information, enabling analytics/cookies requiring consent.

### Failure and fallback handling

- **Blender unavailable:** build the procedural Three.js model, record Blender generation as optional; do not stop.
- **No Playwright MCP:** use `@playwright/test` and screenshot files; do not stop.
- **No browser visual inspection capability:** capture screenshots and include their paths; describe the exact unverified aspects without fabricated approval.
- **Network/package install fails:** retry appropriate mirrors/settings safely; if blocked, implement maximum available work and write a reproducible blocker.
- **Performance below target:** simplify effects, optimize draw calls, lower DPR and reduce postprocessing; prioritize smooth readability over shader complexity.
- **3D glass unrealistic:** prioritize transparent silhouette, studio lighting and good static product art rather than bloating the scene with unstable shaders.
- **Codex context/session limit:** persist the milestone state and exact next command; continue in next session.

### Required implementation log format

Continuously update `docs/IMPLEMENTATION_LOG.md`:

```markdown
# Implementation log
Updated: YYYY-MM-DD HH:MM (local)
Current phase: Phase N — <name>
Status: NOT STARTED | IN PROGRESS | BLOCKED | COMPLETED

## Completed
- [x] ...

## Commands actually executed and result
- `npm run build` — PASS/FAIL; key diagnostic

## Visual checks performed
- Device/viewport, screenshot path, observed issue, fix

## Decisions
- What changed and why

## Open issues / constraints
- ...

## Next exact actions
1. ...
2. ...
```

At every end-of-session checkpoint, include the exact repository state, remaining phases and known failing commands. Codex must read the log before continuing.

---

## 10. OPTIONAL QUALITY UPGRADES AFTER CORE ACCEPTANCE

Only attempt these after Phases 0–12 meet acceptance; do not compromise baseline delivery.

- Subtle procedural visual notes (particle motes, ink diffusion or refractive highlights) with GPU budget and reduced-motion fallback.
- A camera-choreographed product comparison view.
- Original editorial image set and improved product stage rendered offline in Blender.
- A case study route describing UX, engineering, animation approach, and recorded performance.
- Add localization framework for Indonesian/English (do not machine-translate blindly and publish inaccurate marketing claims).
- Integrate actual commerce **only as a separately specified and authorized future phase**.
- Create a reusable template package if user later wants to launch several fashion/beauty/fragrance brands.

---

## 11. RECOMMENDED MILESTONE CHECKPOINTS

| Milestone | Included phases | Evidence to show |
|---|---|---|
| M1 — Foundation | 0–2 | Responsive static brand site screenshot + successful build |
| M2 — Signature product | 3–4 | Original 3D model, poster, and persistent scroll scene recording/screenshots |
| M3 — Story and interaction | 5–8 | End-to-end home and product pages with notes/variants/navigation |
| M4 — Quality | 9–11 | Mobile/a11y/functional QA, test output, performance report |
| M5 — Delivery | 12 | README, asset generator, CI, final screenshots, deploy-readiness checklist |

Each milestone should be useful and testable independently. Do not report completion solely on the basis of files existing.

---

## 12. DEFINITION OF DONE (FINAL CODEX CHECKLIST)

**The task is finished only when all items below are true or an explicit, well-documented blocker prevents completion:**

- [ ] The site starts and loads locally with no unhandled error.
- [ ] The six story chapters and three product-detail URLs are implemented.
- [ ] The 3D bottle is original, consistent with the concept, visually acceptable and inspectable.
- [ ] Scroll choreography is functional; one home canvas remains mounted across chapters.
- [ ] Variant switching and fragrance note interaction are usable.
- [ ] Page, menu, hover and section transitions are smooth and deliberate.
- [ ] 375 px mobile, tablet and desktop layouts are visually inspected and corrected.
- [ ] Reduced motion, keyboard navigation and WebGL fallback are operational.
- [ ] Unit, E2E, lint, typecheck and production build have actually been run and status recorded.
- [ ] Screenshot evidence and QA/performance reports exist.
- [ ] Asset licenses/origins are documented.
- [ ] README, `AGENTS.md`, PRD, architecture and deployment instructions are complete.
- [ ] No copyrighted reference-brand assets, unapproved fees, misleading checkout, or fabricated results.
- [ ] Codex final response lists what was truly built, what was tested, limitations, and exact run commands.

---

## 13. FINAL RESPONSE FORMAT REQUIRED FROM CODEX

When implementation is complete or you reach a genuine blocker, answer the user in this structure:

1. **Result:** concise summary of what really works; what is not complete.
2. **Run:** exact local development/build/testing commands, including project path.
3. **Experience:** sections/features built and interaction notes.
4. **3D assets:** how bottle was generated; how to edit/regenerate; realistic limitations.
5. **Quality:** commands actually run and their pass/fail outcomes; mobile/a11y/performance results; screenshot paths.
6. **Files:** key implementation and documentation locations.
7. **Deployment:** ready/not ready, required user authorization, specific next steps.
8. **Next steps:** only unresolved issues or optional upgrades.

**Final instruction: implement the website. Do not substitute a proposal, architecture diagram, or README for the working product.**
