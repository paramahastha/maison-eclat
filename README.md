# Maison Éclat

An original fictional fragrance experience: six editorial chapters, three compositions, an original Blender bottle, scroll-driven WebGL, and accessible product inspection. **Concept experience — no purchases processed.**

Project requirements are documented in the [product brief](docs/PRD.md). The latest scroll upgrade is documented in [the motion brief](docs/motion-upgrade/BRIEF.md) and [its QA evidence](docs/motion-upgrade/QA_REPORT.md). Current implementation and validation evidence are in [the implementation log](docs/IMPLEMENTATION_LOG.md), [QA report](docs/QA_REPORT.md), and [performance report](docs/PERFORMANCE_REPORT.md).

## Run locally

Use Node.js 22 or newer and npm. Verified locally with Node 26.12.0 / npm 11.20.0. No API keys or paid services are required.

```sh
cd /Users/macbookprom4/Projects/website/maison-eclat
npm install
npm run dev
```

Open http://localhost:3000. Home is `/`; fragrance routes are `/fragrances/obsidian-01`, `/fragrances/neroli-02`, and `/fragrances/santal-03`. `/style-guide` documents the visual system.

If port 3000 is occupied, use `npm run dev -- --port 3001` and open http://localhost:3001. Local production verification used port 3001 to preserve an existing SSH listener on port 3000; use `ECLAT_PORT=3001` for Playwright in that case.

```sh
npm run build
npm run start
```

The browser installs listed below are only needed for automated QA, not for running the website.

## Validate

```sh
npm run lint
npm run typecheck
npm run test
npm run assets:validate
npx playwright install chromium webkit
npm run test:e2e
```

Playwright starts the server automatically. The default suite covers Chromium desktop, Chromium mobile emulation and WebKit. GPU lifecycle tests run in Chromium; content, controls and accessibility run across the configured browsers.

To test the production build, stop any server already on port 3000, then run:

```sh
npm run build
E2E_PRODUCTION=1 npm run test:e2e
```

Firefox is excluded from this project's validation and CI at the user's request. The downloaded binary also failed to launch on this Mac. See the QA report.

## Edit the experience

- Product names, notes, copy and palettes: `src/data/fragrances.ts`.
- Six home chapters: `src/components/sections/HomeStory.tsx` and `CollectionSection.tsx`.
- Type, colors and responsive composition: `src/app/globals.css`.
- Scroll poses and timings: `src/lib/story-choreography.ts` and `src/lib/animation-tokens.ts`; chapter/window synchronization: `src/components/motion/ScrollDirector.tsx`.
- WebGL materials: `src/components/scene/BottleModel.tsx`; home lighting: `StudioLighting.tsx`; detail lighting: `InspectorCanvas.tsx`.
- Wet glass and water: `BottleMoisture.tsx` and `WaterSurface.tsx`. The drop, low splash and damped waves are procedural; the scene pauses offscreen and reduced motion retains still artwork.
- Menu: `src/components/layout/SiteHeader.tsx`; note controls: `src/components/product/NotesExplorer.tsx`.

The home canvas remains mounted between chapters. It renders on demand as scroll/selection changes. The Hero bottle exits before the framed Origin still enters; the canvas returns in Composition for the cap reveal, then in Collection and Invitation. DOM copy and generated posters remain usable when WebGL, model loading or JavaScript fails. Reduced-motion preferences use still artwork; product visitors can explicitly enable 3D inspection.

## Regenerate original assets

The committed assets are ready to run. Blender is needed only to author or regenerate the model and posters. The generator was verified with Blender **5.2.3 LTS**.

```sh
# Generate original labels, SVG fallback illustrations, botanical art and branding:
npm run assets:generate

# macOS Blender app (or use `blender` if available on PATH):
/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/blender/generate_perfume.py

# Keep the offline Cycles source renders, then capture the active posters
# from the actual WebGL scene using a running local server:
node scripts/optimize-assets.mjs
npm run dev -- --port 3001
# In another terminal:
BASE_URL=http://localhost:3001 node scripts/generate-live-posters.mjs
HEADLESS=false BASE_URL=http://localhost:3001 node scripts/generate-detail-posters.mjs
npm run assets:validate
```

Blender exports `public/models/maison-bottle.glb`, saves the editable `.blend` studio, and renders three transparent PNG source posters. `-- --geometry-only` skips poster rendering. Modify proportions, bevels, materials, studio lights and camera in the generator. The browser tunes glTF materials separately; its liquid uses a lower-cost opaque inner material to avoid nested WebGL transmission artifacts. The active `*-live.webp` home posters and desktop/phone `*-detail*.webp` inspector posters are captured from their respective browser scenes so the first frame matches the interactive bottle.

The fallback generator can replace the offline posters with illustrations until Blender rendering/optimization runs. Original PNGs, Cycles WebPs and `.blend` are source assets; the site requests only the WebGL-matched WebPs and GLB. All imagery and models are original; open-license font notices are retained in `public/fonts`. See [the asset register](docs/ASSET_REGISTER.md).

## Visual and performance evidence

Latest product stage: [aquarium entry review](docs/AQUARIUM_ENTRY_REVIEW.md) and [responsive sequence screenshots/video](docs/screenshots/aquarium-fall/). The animated stage opens empty; the bottle falls directly from above and triggers water ripples, droplets and caustics before settling smoothly. Static and fallback modes retain full bottle artwork. Run `node scripts/capture-aquarium-entry.mjs` and `node scripts/check-aquarium-fallback.mjs` with the local dev server on port 3001.

Wet bottle and subtle water impact: [final screenshots and motion recording](docs/screenshots/wet-study/final/), [visual review](docs/WET_STUDY_REVIEW.md), and [validation log](docs/IMPLEMENTATION_LOG.md). With a local production preview running, use `BASE_URL=http://127.0.0.1:3009 node scripts/capture-wet-study.mjs` to reproduce responsive, variant, keyboard, reduced-motion and still/live evidence.

Latest upgrade: [scroll recording](docs/motion-upgrade/scroll-story.webm), [QA and GPU measurements](docs/motion-upgrade/QA_REPORT.md), and [reference study](docs/reference-motion-study/REPORT.md). Use `BASE_URL=http://127.0.0.1:3002 node scripts/capture-motion-upgrade.mjs` or `node scripts/record-scroll-story.mjs` with a running production preview to recreate evidence.

- `node scripts/capture.mjs` captures reduced-motion pages at five viewport widths; `MOTION=on` captures the animated version.
- `node scripts/capture-states.mjs` captures chapter positions, product variants, menu and fallback states.
- With a production server running: `PRODUCTION=1 HEADLESS=false node scripts/measure-performance.mjs` records local loading metrics, instrumented WebGL frame delivery during scrolling and a constrained mobile simulation. Add `BASE_URL=http://127.0.0.1:3001` when using port 3001. A visible browser uses this Mac's M4 Metal GPU; the default headless browser used SwiftShader software rendering here.
- Reports distinguish lab interaction durations from field INP/CWV. Mobile emulation is not a physical-device certification.

## Deployment preparation

This is a standard Next.js App Router project suitable for Vercel or another Node-compatible Next.js host. Use `npm ci`, `npm run build`, then the host's Next.js runtime (or `npm run start`). No external database or environment secrets are needed.

Set `SITE_URL` to the real HTTPS origin **at build time** when deploying so social image URLs resolve correctly. Local builds default to `http://localhost:3000`; no unowned public domain is invented. CI runs lint, typecheck, unit tests, asset validation, build and production E2E.

The project has not been published. Public deployment remains a separate authorized action.
