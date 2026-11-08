# Scroll motion upgrade — QA and visual review

Date: 2026-11-07. Production app at `http://127.0.0.1:3002`. Original baseline reports remain historical evidence; this report covers the scroll upgrade.

## Delivered

Six chapters now have specific choreography: opening orbit/approach, form study and cap lift, separating cap/botanical orbits, a three-bottle spatial gallery with scroll-controlled identities, macro-image/text parallax, and a settling signature. Desktop has two finite sticky intervals; mobile/tablet/short screens keep natural document flow. The same gallery supports drag, arrows, selection buttons and keyboard. No wheel interception or new dependencies. All art/models remain original.

## Executed validation

- `npm run lint`, `npm run typecheck`, `npm run test` — PASS; 6 tests in 3 files. Latest production build PASS for every existing route.
- Production Playwright: **33 passed, 3 explicitly skipped, no failures/retries**; final result in `e2e-production.json`; configured engines are Chromium desktop, Chromium mobile emulation and WebKit. Covers forward/reverse scroll identities, control/timeline synchronization, drag, keyboard, short screens, animated tablet overflow, notes, routes, menu focus, no-JS, reduced motion, unavailable WebGL, failed model, persistent canvas and context loss. GPU lifecycle cases remain explicitly Chromium-only.
- Axe checks: zero violations in tested home, selected collection, product and menu states.
- Actual visible Chromium captures: 375×812, 768×1024, 1024×900, 1440×900, 1920×1080 in `after/`. `capture-notes.json` records no uncaught errors. Desktop gallery captured at scroll 0/50/100% with Obsidian/Neroli/Santal respectively. Compact mode deliberately retains manual selection.
- Final design inspector: **0 FAIL / 6 WARN categories** at 1440, 768 and 390. `design-inspection-final.json`; inspected complete contact sheets under `.taste-skill/motion-upgrade-final`. Detected 36 moving DOM elements on desktop and 29 on compact views, plus the one persistent WebGL canvas. No console errors in this inspection.

Motion recording: [29.72-second browser walkthrough](scroll-story.webm), 8.6MB. Decoded/visually reviewed frames at 4, 12 and 21 seconds; metadata and frames in `recording/`.

## Fixes proven during review

1. First production tests caught the R3F inner wrapper intercepting desktop clicks despite the outer decorative layer. All home-canvas descendants now ignore pointer events; the semantic DOM handles controls and drag. Rerun passed.
2. Initial inspector flagged the new 12px gallery hint. Raised to 13px; final inspector has no small-text warning.
3. Production tablet inspection found a rotated botanical corner causing 16px sideways overflow. Clip the visual within its composition chapter; added a regression test at three scroll points. Final inspector has zero overflow findings.

The initial dev-server inspector did not observe the canvas/hydrated motion and failed its motion count. It is retained in `.taste-skill/motion-upgrade/report.json`. The intermediate production run (`design-inspection.json`) found the tablet overflow; the final production run above is the acceptance evidence. No failing run is presented as passing.

## Remaining inspector warnings, assessed against images

- Mixed-font headline: the three selector names/subtitles are distinct interface hierarchy, not decorative italic words within a headline.
- Cream palette: the authoritative master plan explicitly requires ivory.
- Font size count: responsive display scales, note labels and UI sizes are intentional; running copy remains readable.
- No video footage: the original live 3D sculpture and procedural art carry the experience; no unrelated stock footage is introduced.
- Lopsided Ritual: the quiet opposite field contains the full-bleed original macro art, deliberately balancing the left editorial text.
- Pinned-over-picture: DOM image rectangles include transparent product posters behind the WebGL layer; inspected captions/headlines stay in separate visible columns. See full-size hero and gallery samples, not only rectangle overlap detection.

## Actual M4 lab measurements

`performance-lab.json`, visible Chromium, production build, ANGLE Metal Apple M4. Four-second samples instrument real WebGL draw callbacks; these are short local samples, not performance guarantees.

| Profile | Hero rendered FPS | Gallery rendered FPS | LCP | CLS | Max sampled interaction duration |
|---|---:|---:|---:|---:|---:|
| 1440×900, DPR1, unthrottled | 120.2 | 119.9 | 168ms | 0.00006 | 64ms |
| 375×812, DPR1, 4×CPU, 100ms RTT, 1.6Mbps | 113.9 | 98.7 | 712ms | 0.00191 | 56ms |

The second profile still uses the M4 GPU and is not a physical phone test. Interaction durations are Event Timing samples, not field INP or p75 CWV. No field telemetry exists. Headless SwiftShader is slower and unsuitable for claims about this Mac's GPU.

## Visual critique — upgrade rounds

ROUND 1
Seen in one second: a lit original glass bottle against ink.
Idea (one sentence): encounter a presence, open its composition, then discover three identities through scroll.
Live thing: reversible object/light targets, opening cap and spatial gallery.
Layout words by section: hero=held object / origin=form study / composition=orbit / collection=spatial exhibit / ritual=macro / invitation=signature.
Scores: design 7.5 · usability 6.0 · creativity 7.0 · content 7.5 → overall 6.95.
Caps applied: intercepted desktop controls limited usability pending fix; brief-required ivory/index/underlines override house conflicts.
Top three problems:
1. Desktop control interception in first failing browser trace: fixed decorative canvas descendants.
2. Gallery hint too small: raised to 13px.
3. Tablet botanical corner overflow: contained within its chapter.

ROUND 2
Seen in one second: clear type beside a bottle that changes orientation with scroll.
Idea (one sentence): unchanged, now verified in both scroll directions.
Live thing: three identities, depth and selected narrative move together.
Layout words by section: unchanged; mobile uses natural flow.
Scores: design 7.5 · usability 8.0 · creativity 7.0 · content 7.5 → overall 7.55.
Caps applied: no remaining inspector FAIL; no external award claim.
Top three problems:
1. Hard rect-overlap warning: examined full-size hero/gallery; no actual reading-text collision.
2. Ritual asymmetry warning: examined full-bleed macro art; retained intended quiet composition.
3. Real-time material remains less physically rich than Cycles posters: documented rather than claiming photorealism.

## Limits

Firefox skipped by user request. Physical iOS/Android and full screen-reader combinations remain untested. Three upstream WebKit GPU lifecycle skips remain explicit. R3F/Three emits a nonfatal Clock deprecation warning. Reference walkthrough has a Chanel detail-service error and an unverified alternate D&G recommendation; see the separate research report. Public deployment was not performed. Realtime glass/liquid is an approximation; Blender source/generator remains editable.
