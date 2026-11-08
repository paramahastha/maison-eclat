# QA report

Latest wet-bottle/inspector correction (2026-11-07): lint, typecheck, 7 unit tests, 36-asset validation and production build PASS. Final headed production Playwright: **39 passed, 9 explicit skips, zero failures**, 31.4s. Product context loss, drag/reset, keyboard/menu focus, reduced motion, fallback and axe checks passed. Final responsive/variant/transition evidence and motion recording: `docs/screenshots/wet-study/final/`; raw results: `docs/wet-study-e2e.json`. Controlled still/live mean channel difference: 0.97/255 desktop and 1.15/255 phone. No overflow or page errors in the capture report. See `docs/WET_STUDY_REVIEW.md` for the visual critique and retained taste-inspector limitations. Physical mobile GPU behavior remains untested.

Latest scroll flow correction (2026-11-07): the Hero bottle exits before the Origin panel enters; Origin is one framed still, and the persistent canvas returns in Composition, Collection and Invitation with hidden shot changes. Final validation: lint, typecheck, 7 unit tests, asset validation, production build and headed production Playwright (35 passed, 4 explicit WebKit GPU skips). See `docs/IMPLEMENTATION_LOG.md`, `docs/scene-flow-e2e.json`, and `docs/screenshots/scene-flow/production/` for executed evidence.

Previous bottle continuity fix: the opening poster was captured from the live GLB scene and the overlapping poster/canvas handoff was removed. Its earlier results and screenshots remain in `docs/bottle-fix-e2e.json` and `docs/screenshots/bottle-fix/`. The historical baseline below predates both follow-ups.

Latest scroll upgrade (2026-11-07): [current validation and visual evidence](motion-upgrade/QA_REPORT.md). The results below document the preceding baseline.

Date: 2026-11-07, Asia/Jakarta. The project is a local, fictional concept experience. No public deployment has occurred.

## Executed checks

| Check | Actual result |
|---|---|
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS: 3 tests in 2 files |
| `npm run build` | PASS: home, 404, all 3 product URLs and style guide |
| `npm run assets:validate` | PASS: 25 assets, all 6 required model objects |
| `npm audit` / `npm audit --omit=dev` | 0 vulnerabilities after targeted dependency fixes |
| Production Playwright | PASS: 24 tests; 3 explicitly skipped WebKit GPU lifecycle cases; no failures or retries |

Latest production command: `ECLAT_PORT=3001 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/e2e-production.json npm run test:e2e -- --workers=2 --reporter=list,json`. Raw results: `docs/e2e-production.json`. CI workflow is prepared; hosted CI itself has not been run.

## Functional and accessibility coverage

- Home has all six semantic chapters and real text before WebGL. The collection CTA and anchors navigate correctly.
- All three variants change the selected state, palette, copy, note preview, poster and destination. The hero also reflects the selected fragrance. Texture/material mutations explicitly invalidate demand-mode rendering, so the bottle label/cap/liquid update without waiting for a scroll.
- All three product URLs work on direct navigation and reload. Unknown slugs show a useful 404 and return link.
- Menu opens/closes, traps Tab/Shift+Tab, closes with Escape/navigation, restores focus and releases scroll lock.
- Desktop note tabs support arrows/Home/End with synchronized focus/selection/content. Mobile uses native named details groups.
- Product inspection supports bounded horizontal drag, left/right buttons and reset; `touch-action: pan-y` preserves vertical scrolling.
- Chromium verifies one persistent home canvas across chapter changes, context-loss recovery, model-request failure and inspection controls on desktop/mobile emulation.
- Reduced motion produces a complete static experience and working variant/notes controls; product 3D is available only through explicit opt-in in this mode.
- Disabled WebGL retains useful posters and content. Disabled JavaScript retains all chapters, complete note text and links to all three products.
- Automated axe checks return **zero violations** for the tested WCAG A/AA tags on home, product, Neroli selection and menu, in Chromium desktop/mobile and WebKit. This is automated coverage plus keyboard checks, not a formal accessibility certification.
- Normal browser state captures recorded no console errors or uncaught exceptions. Eight nonfatal `THREE.Clock` deprecation warnings originate in the stable R3F/Three dependency combination; they were not suppressed. Evidence: `docs/browser-console.json`. The intentional model-failure test is excluded from normal-console counts.

## Visual evidence

Final captures: `docs/screenshots/final-motion` and `docs/screenshots/final-static`, at 375×812, 768×1024, 1024×900, 1440×900, and 1920×1080. `docs/screenshots/states` contains chapter windows, all three collection palettes, all three product routes at mobile/desktop sizes, menu, style guide, reduced motion and model-error fallback. Final captures use visible Chromium on the M4 Metal renderer.

Reviewed: desktop/mobile hero composition, full story contact sheets, light Origin, Composition notes, variant identity, product inspector, menu, footer and static fallback. Refinements include two-line hero typesetting, readable copy, matched poster/3D framing, DOM text above the transparent canvas, footer stacking, named accordion grouping and immediate variant redraw.

Design-taste house-style exceptions follow the supplied brief: ink/ivory/brass, chapter eyebrows/numbering and thin underlined actions. Its custom scene harness reports no library `section.scene` stages because this project uses a custom GSAP/R3F controller; the actual chapters are verified by Playwright and state captures. It is not evidence of testing a nonexistent pinned scene. Final inspector measurements and manual critique are in `docs/design-inspection-final.json` and `docs/DESIGN_REVIEW.md`.

Final browser inspector: **0 FAIL, 4 WARN categories**. The warnings concern required ivory, mixed type in selector labels (not a prose headline), the brief's fluid display scales/wordmark, and absence of video where the live 3D study supplies motion. Explicit closed-details CSS makes native collapsed content unambiguously hidden to DOM-only inspection. No content was removed to satisfy the inspector.

## Limits and remaining optional work

- Firefox is skipped at the user's request and excluded from CI. Its installed local binary also failed before page launch. No Firefox compatibility claim is made.
- WebKit content/accessibility/navigation checks passed. Three low-level GPU lifecycle cases run only in Chromium and are explicitly skipped in WebKit. No physical iPhone/iPad/Android test or full screen-reader audit was performed.
- Real-time glass is an approximation, especially the opaque inner liquid used to avoid nested-transmission artifacts. The active posters match that real-time rendering; the retained offline Cycles source renders have more realistic refraction. No photorealism claim is made.
- Performance measurements are local lab results, with a separate constrained mobile simulation on the M4 GPU. No field CWV or real mobile GPU results exist; see `PERFORMANCE_REPORT.md`.
- Public deployment, a real origin for social metadata and any future commerce are separate actions. Set `SITE_URL` at deployment build time.

The existing user deletions of Spec Kit files were preserved. No secrets, paid services, external reference-brand assets, data collection, fake purchase flow or public publishing were introduced.


## Aquarium entry revision — 2026-11-08

Lint, typecheck, 11 unit tests, 36-asset validation and production build passed. Final headed production Playwright: 39 passed, 9 existing explicit skips, no failures or retries (26.3s), `docs/aquarium-entry-e2e.json`. Includes keyboard/menu focus, reduced motion, mobile, no-JS/WebGL failure and Chromium context-loss paths. Three-width browser captures and forced no-float rendering produced no console/page errors. Normal/no-float offscreen draw count was zero. See `AQUARIUM_ENTRY_REVIEW.md` for screenshots, design-inspector findings and simulation limitations; no physical-device claim.


## Direct fall correction — 2026-11-08

Removed upward anticipation; motion starts empty and falls from above. Lint/typecheck/build and all 11 unit tests pass; asset validation passes. Final production E2E: 39 passed, 9 existing explicit skips, 0 failures/retries (32.2s), `aquarium-fall-e2e.json`. Responsive sequence captures at 1440/768/375px: no console errors or overflow; inspected preparing, impact and settling including mobile. Evidence: `screenshots/aquarium-fall/`. Complete reduced-motion, unsupported WebGL, failed model, no-JS and context-loss fallback behavior remains covered by the browser suite.


## Shared bottle appearance — 2026-11-08

Unified glass material, lighting and attached beads across home/detail. Corrected the transparent-canvas transmission white fill without changing geometry. Regenerated three home and six detail WebPs. Lint/typecheck/build, all 11 unit tests and 36-asset validation passed. Production Playwright: 39 passed, 9 existing explicit skips, no failures/retries (33.9s), `shared-bottles-e2e.json`. Inspected all three variants on home/detail at desktop and phone widths; no browser errors (`screenshots/shared-bottles/report.json`). Underwater tint/caustics intentionally remain specific to the aquarium, and the home retains its original pose. Glass coverage correction is a renderer-specific optical approximation.


## Fragrance atmospheres — 2026-11-08

Obsidian: slate/charcoal haze; Neroli: citrus-gold light shafts; Santal: amber/umber currents. Each has independent receiver colors, surface tint, absorption, environment/key/fill light and drift scale/speed, while sharing model and impact choreography. Six detail posters regenerated for complete static themed scenes. Lint/typecheck/build and 11 unit tests pass; 36-asset validation passes. Production E2E: 39 passed, 9 existing explicit skips, no failures/retries (28.9s), `atmospheres-e2e.json`. Desktop/phone captures for all three variants inspected; no browser errors in `screenshots/atmospheres/report.json`. Physical phones untested.
