# Implementation log
Updated: 2026-11-08 (Asia/Jakarta)
Current phase: Fragrance atmospheres — validated
Status: COMPLETE

## Individual fragrance atmospheres

- Added typed atmosphere records in `src/data/fragrance-atmospheres.ts`, separate from bottle materials. Obsidian uses cool charcoal/slate, slow haze and broad caustics; Neroli uses citrus gold, brighter slanted shafts and finer/faster patterns; Santal uses amber/umber, broad warm currents and the slowest drift.
- Theme data controls the water backdrop/floor, surface reflection tint, absorption, key/fill/environment light and caustic speed/scale. The original bottle model and colors, direct fall, contact timing and seamless page-colour edge blend remain shared. Home appearance is unchanged by these optional detail atmosphere settings.
- Reduced-motion/static capture now shows each complete themed aquarium without the fall or animated water. Regenerated all six detail WebPs. Animated preparing still opens empty, as requested in the preceding revision.
- Executed lint/typecheck PASS; 11 unit tests PASS; asset validation PASS (36); production build PASS. Final headed production E2E PASS: 39 passed, 9 existing explicit skips, 0 failures/retries (28.9s), report `docs/atmospheres-e2e.json`. Captures: `docs/screenshots/atmospheres/`, all three detail pages at 1440×900 and 375×812; desktop screenshots inspected, with visibly distinct palettes and readable bottle labels.
- Inspected all three desktop captures and `phone-comparison.png`; browser capture reports no errors. No required work remains. No external assets, dependency changes, commits or deployment. Existing design-inspector brand/content findings remain outside this scoped atmosphere change.

## Shared bottle appearance

- User prefers the detail aquarium bottle to the home hero. Both already used the same GLB, but the home scene used warmer, stronger lighting and a differently tinted glass material. All variants now share neutral glass settings, one `StudioLighting` rig and the same attached surface beads. Home light tracking remains subtle; aquarium refraction and caustics remain specific to water.
- Diagnosed the pale glass fill in Three 0.185 `WebGLRenderer`: transparent-canvas transmission targets are cleared to half-alpha white. Added a home-stage shader correction that recovers coverage from that alpha, removes empty-background diffuse fill, and keeps a Fresnel edge contribution. The opaque underwater scene retains its normal transmission path. This is a rendering approximation, not a new bottle model or a full optical solver.
- Regenerated all three home live WebPs and all six detail stills. Existing composition, variant colors, geometry, drop sequence and controls preserved. No dependency change, commit or deployment.
- Executed lint/typecheck PASS; 11 unit tests PASS; asset validation PASS (36 assets); production build PASS. Final production Playwright PASS: 39 passed, 9 existing explicit skips, 0 failures/retries (33.9s), `docs/shared-bottles-e2e.json`. Executed with production server port 3008, headed Chromium/mobile/WebKit and two workers.
- Evidence capture script: `scripts/capture-shared-bottles.mjs`, output `docs/screenshots/shared-bottles/`. Inspected Neroli home/detail at full size and all 12 desktop/phone variant captures in `contact.png`. The capture report records no browser errors. All home sections and collection thumbnails reference the regenerated shared live posters. No required work remains for this revision.

## Direct fall intro — supersedes the lift sequence below

- User rejected the upward anticipation. Motion now opens on an empty stage with the bottle already above the viewport. After 350ms, a gravity-led descent enters the frame; no initial rise or visible centered poster. Preparing artwork remains available for reduced motion, no JavaScript, unsupported WebGL, model error and context loss.
- Contact is derived from the descent trajectory (~833ms). The underwater damped response matches both position and velocity at contact, replacing the previous abrupt deceleration. A slight entry tilt resolves through damped roll; water impulse, droplets, ripples and caustics retain the same contact clock. No per-frame React state or scroll interception.
- Unit coverage verifies monotonic descent before recovery, dry-before-contact, velocity continuity and settled pose. Executed lint/typecheck PASS, 11 unit tests PASS, asset validation PASS (36), production build PASS. Final headed production Playwright PASS: 39 passed, 9 existing explicit skips, 0 failed/retries (32.2s); report `docs/aquarium-fall-e2e.json`. Command uses `ECLAT_PORT=3008 BASE_URL=http://127.0.0.1:3008 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/aquarium-fall-e2e.json npm run test:e2e -- --headed --workers=2 --reporter=list,json`.
- Captured `docs/screenshots/aquarium-fall/` at 1440×900, 768×1024 and 375×812 using `scripts/capture-aquarium-entry.mjs`; all three report zero errors and zero horizontal overflow. Inspected empty preparing, impact, settling and phone impact screenshots. Recordings included. Existing page design-inspector findings in the previous review remain unchanged; this is a scoped motion correction.
- Handoff: reload `http://localhost:3001/fragrances/obsidian-01` to replay. No required work remains for this revision. Prior lift-era captures/log entries below remain historical evidence, not the current animation.

## Synchronized preparing → aquarium entry

- Replaced all six old brown detail posters with deterministic dry captures of the current live scene. The preparing and initial live camera/scale/pose match; water is absent. Reduced-motion users retain this complete dry still/static 3D option.
- Added `aquariumEntry` as the shared timing source: dry hold through 650ms, lift through 1450ms, accelerating drop, impact at 1820ms, damped recovery to floating. Shortened the poster/canvas crossfade to 350ms so it finishes before the lift. Water reveal, a one-shot GPU velocity impulse, analytic fallback ripples, ballistic droplets and temporary caustic strength are driven by the same clock. No per-frame React state.
- Refined the upper surface after screenshot review to remove an opaque band. Full-square edge blending remains; no inset tank frame returned.
- Executed lint PASS, typecheck PASS, unit tests PASS (11/11 including continuity and impact gating), asset validation PASS (36 assets), production build PASS. Final production E2E after optical refinement PASS: 39 passed, 9 existing explicit skips, 0 failures/retries, 26.3s. Command: `ECLAT_PORT=3008 BASE_URL=http://127.0.0.1:3008 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/aquarium-entry-e2e.json npm run test:e2e -- --headed --workers=2 --reporter=list,json`. Skips remain two desktop-only gallery tests on mobile and seven Chromium-only GPU tests on WebKit.
- `HEADLESS=false BASE_URL=http://localhost:3001 node scripts/generate-detail-posters.mjs`: PASS, six stills. `node scripts/capture-aquarium-entry.mjs`: PASS at 1440/768/375px, no errors or overflow. Evidence: `docs/screenshots/aquarium-entry/`, including sequence PNGs, recordings and report.json. Reviewed the handoff, impact/settling and settled mobile/desktop captures.
- `node scripts/check-aquarium-fallback.mjs`: PASS for normal and forced no-float rendering; no page/console errors and zero draw calls over one second offscreen in both. The earlier no-float pause ambiguity was resolved by allowing scroll settling before measurement.
- Design inspector executed and screenshots viewed; 8 FAIL / 7 WARN remain from existing brand/content and DOM-only motion heuristics, documented in `docs/AQUARIUM_ENTRY_REVIEW.md`. No false claim of a clean design gate.
- Limitations: lightweight heightfield and authored/analytic effects, not full volumetric simulation; mobile viewport emulation, not physical devices. No public deployment or commits. Existing Spec Kit deletions preserved.
- Handoff: local dev preview at `http://localhost:3001/fragrances/neroli-02`; reload to replay the entry. No required implementation or validation remains for this revision.

## Borderless aquarium — implementation checkpoint

- User expanded the detail-stage request to a floating bottle inside moving water, then clarified that the entire square should be the aquarium and blend into the page. The initial inset glass box was rejected; the active scene has no visible tank frame or side panels, and the water/light field fills the stage with a page-colour edge blend.
- Studied the linked MIT repository `RealAbdurRehman/fluid-simulation` at commit `08159a02eb776d086f222f50b098e5dae4944efa`: README, package manifest, `src/ssfrRenderer.ts`, `src/rigidBody.ts`, LICENSE. Its WebGPU particle engine is not embedded. The implementation keeps the stable R3F/WebGL renderer and uses a GPU height/velocity wave field, refraction/absorption pass, moving caustic lighting and a damped near-neutral floating pose. MIT notice retained at `docs/licenses/fluid-simulation-MIT.txt` for the adapted caustic shading approach.
- `useAquariumWater.ts`: two 96px desktop / 64px mobile half-float targets, fixed 60Hz finite-difference updates, reflection at boundaries, forcing and damping. An analytic wave path is available when float render targets are unsupported. `AquariumOptics.tsx`: one scene render and masked screen-space refraction/absorption, with the edge pixels blended to the page colour. The full-screen target also falls back to unsigned-byte storage where needed.
- `AquariumScene.tsx` supplies the surface, soft light receivers and sparse rising bubbles. Bottle materials receive restrained moving caustics. The float integrator is bounded and has unit coverage for long-frame stability and 30/60/120Hz consistency. Native scroll, accessible rotation, reduced motion and observer-based offscreen pause remain in place.
- Executed: lint PASS, typecheck PASS, unit tests PASS (9/9). Browser prototypes showed no page or shader errors. Evidence: `docs/screenshots/aquarium/{stage-v1,desktop-stage-v2,blended-stage-v1}.png`. Final screenshots/posters/build/production tests are still pending and are not claimed complete.
- Next exact actions: capture final desktop/phone movement and performance, verify no-float and reduced-motion paths, regenerate six detail posters, run production build and full Playwright, inspect final screenshots, update this checkpoint with actual results.

## Wet bottle and subtle water impact — final evidence

- Addressed the user's three requests: a better/smoother inspector, a small falling drop with subtle splash and natural fading ripples, and wet glass. The product stage now uses a single bottle above a calm surface with a compact caption/control row; the phone title is the actual single H1, positioned above the visual and before it in DOM reading order.
- Removed the CSS drop/rings and duplicate mirrored bottle. `WaterSurface.tsx` now provides a quadratic falling trajectory, a low scalloped splash sheet, a tiny rebound bead, and a travelling, dispersing, exponentially damped wave packet. Geometry and fragment normals share the wave height function. The floor stays independent of bottle rotation. This is a lightweight authored 3D effect, not a full fluid solver or physical planar bottle reflection.
- `BottleMoisture.tsx` adds deterministic instanced beads around the front, back and sides plus two thin surface trails. They avoid the printed label. A dedicated inspector light rig and an opaque scene background correct the pale glass/transmission artifact; `BottleModel` uses a neutral glass tint for the wet detail view. The home scene and original GLB remain intact.
- Continuous water rendering pauses when the inspector is outside the viewport or the document is hidden. No per-frame React state was added. Local headed Chromium development instrumentation measured **119.96 rendered frames/s** over 6.5 seconds and **0 rendered frames during 600ms offscreen**, with no page/console errors (`docs/screenshots/wet-study/lab-dev.json`). This is a local desktop lab sample, not a physical phone result.
- Replaced the brown button slab with one 68px caption/control row, readable 13px caption/reset text and minimum 44px controls. Drag, left/right buttons and keyboard reset work. The inspector's turn damping was tightened with a bounded delta. Mobile title is visible at about 222px from the viewport top; the earlier 390px capture placed it below the first fold.
- Updated the detail-poster generator to explicitly enable 3D under reduced motion, producing a deterministic calm-water frame. Executed `HEADLESS=false BASE_URL=http://127.0.0.1:3009 node scripts/generate-detail-posters.mjs`: PASS, all six original desktop/phone WebPs. Controlled GLB-delay comparisons showed mean per-channel still/live differences of **0.97/255 desktop** and **1.15/255 phone**, with no observed framing jump.
- Final executed checks: `npm run lint` PASS (0 warnings); `npm run typecheck` PASS; `npm run test` PASS (7/7); `npm run assets:validate` PASS (36 assets, required GLB objects); `npm run build` PASS (all routes). Final headed production Playwright command: `ECLAT_PORT=3008 BASE_URL=http://127.0.0.1:3008 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/wet-study-e2e.json npm run test:e2e -- --headed --workers=2 --reporter=list,json` — **39 passed, 9 explicit skips, 0 failed**, 31.4 seconds. Skips: two desktop-only held-gallery checks on mobile, seven Chromium-only GPU lifecycle checks on WebKit. Added a product context-loss regression; both Chromium desktop and mobile pass.
- The suite covers menu focus/Escape, keyboard notes, navigation, drag/reset, reduced motion, no-WebGL/model failure, product context loss, no horizontal overflow and axe accessibility checks. No unexecuted check is reported as passed. Intermediate lint runs caught mutable shader uniforms and the React compiler's inline-useMemo requirement; both were fixed without rule suppression.
- Final production capture command: `BASE_URL=http://127.0.0.1:3009 node scripts/capture-wet-study.mjs` PASS. Evidence in `docs/screenshots/wet-study/final/`: full pages `desktop.png` (1440×900), `tablet.png` (768×1024), `phone.png` (375×812), `wide.png` (1920×1080), `reduced.png`; keyboard/turned and Obsidian/Neroli stages; paired desktop/phone poster/live stills; `water-contact.png` and `water-motion.webm`. The capture report records zero horizontal overflow, one canvas in live views, zero in reduced motion, and no page/console errors.
- Inspected all final design-inspector fold/page sheets at 1440, 768 and 390px (`.taste-skill/wet-final/`) and the production states above. Intermediate bright floor, busy surface highlights and overly broad ripples were rejected and tuned down. Final critique: `docs/WET_STUDY_REVIEW.md`. The generic taste inspector still reports **8 FAIL / 7 WARN**, mostly retained master-plan conventions (numbering, eyebrow, rules, three original images) and its DOM-only motion count; this is explicitly not claimed as a passed house-style gate. The mobile no-title finding is fixed. No new external asset was used.
- Limits: the original opaque liquid core remains a real-time rendering compromise; water is an analytical visual effect; physical iOS/Android GPU rendering and the full range of screen readers remain untested. Unrelated user work and Spec Kit deletions were preserved. No commit or publication was made.

## Current handoff / next exact actions

1. Review `http://localhost:3001/fragrances/santal-03` (existing dev server) or `http://127.0.0.1:3009/fragrances/santal-03` (verified local production preview). Watch a full 6.4-second cycle and turn the wet bottle with drag or arrow controls.
2. No required implementation work remains for this request. Optional: review on physical iOS/Android hardware.
3. If scene materials/framing change later, regenerate the six detail posters with the command above, rerun `scripts/capture-wet-study.mjs`, and inspect the still/live transition before repeating the required validation gates.

## Product water stage and droplet motion — final evidence

- Replaced the first flat reflector prototype with a dim live bottle reflection that shares the inspector bottle's rotation. The dark procedural water surface fades into the studio backdrop without a straight horizon; a blurred, shaded overlay softens the reflected shape. Original local texture and highlight maps are generated by `scripts/generate-water-texture.mjs`.
- Added a slow moving highlight layer and an occasional small droplet from the bottle base. The drop reaches the water before two faint elliptical rings expand and fade. All three effects are CSS only, so the bottle stays steady and the inspector retains demand-rendered WebGL. Reduced-motion visitors get a complete still poster with no water animation.
- Discarded the initial flat gray reflector (`docs/screenshots/water-prototype-desktop.png`) and a later hard-edged mirror look. Inspected final live desktop, 375 px phone and reduced-motion full pages at `docs/screenshots/water-final-{desktop,phone,reduced}.png`; timing frames at `docs/screenshots/water-{drop,impact,ripples}-review.png`; rotated/variant checks at `docs/screenshots/water-desktop-turned-review.png`, `water-santal-review.png` and `water-neroli-review.png`. The water remains a stylized real-time treatment, not a physically simulated fluid or offline photo render.
- Regenerated all six desktop/phone detail opening WebPs after the water design. In a controlled Obsidian model-delay capture, the poster and settled live inspector differed by mean **2.04/255** per channel, with no visible framing jump: `docs/screenshots/water-handoff-{poster,live}.png`.
- Final executed checks: `node scripts/generate-water-texture.mjs` PASS; `BASE_URL=http://localhost:3001 node scripts/generate-detail-posters.mjs` PASS (six stills); `npm run lint` PASS (0 warnings); `npm run typecheck` PASS; `npm run test` PASS (7/7); `npm run assets:validate` PASS (36 assets and GLB required parts); `npm run build` PASS (all routes). Production Playwright with `ECLAT_PORT=3006 BASE_URL=http://127.0.0.1:3006 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/water-stage-e2e.json npm run test:e2e -- --workers=2 --reporter=list,json` PASS: **37 passed, 8 explicit mobile held-stage/WebKit GPU skips, 0 failed**. Raw results: `docs/water-stage-e2e.json`.
- Decisions: retain the original model, brand, native scroll, one persistent home canvas and static fallback. The reflection is intentionally restrained to fit the ink/ivory/brass design. Physical phone GPU rendering and real fluid simulation were not tested or claimed. Unrelated Spec Kit deletions and user work remain untouched; no commit or publication was made.

## Current handoff / next exact actions

1. Review `http://localhost:3001/fragrances/obsidian-01` and `/fragrances/santal-03`: watch one full 7.5 second droplet cycle and turn each bottle. The reflected shape should turn with it while the water itself moves slowly.
2. If the bottle shape, stage framing or water palette changes, regenerate the water textures and six detail posters using README commands, then repeat the controlled first-frame comparison and production browser suite.
3. Physical iOS/Android GPU review remains open; no further code change is required for the requested water treatment.

## Obsidian collection entrance correction — final evidence

- User follow-up identified the same timing fault at the first stop. Browser reproduction found Obsidian selected with the stage fully framed but canvas opacity `0` at gallery progress 0, `0.26` at 10%, and only `0.96` at 20%. The cause was the generic chapter entrance curve, which delayed the collection bottle after the held stage had begun.
- Collection entrance now follows viewport presence and chapter competition instead of gallery progress. This keeps Obsidian visible from the first held frame and on reverse scroll, while the Composition→Collection handoff still fades in as the stage enters the viewport. Measured opacity at gallery progress 0, 10%, 20%, and reverse 0: **1**. During the preceding entrance it rose from `0.01` at relative progress −0.8 to `0.54` at −0.7 and `0.95` at −0.6; no abrupt target jump was seen.
- Inspected before/after screenshots: `docs/screenshots/collection-first-start-before.png`, `collection-first-ten-before.png`, `collection-first-entry-final.png`, `collection-first-start-final.png`, `collection-first-reverse-zero-final.png`, and `collection-entry--0_8-final.png` / `collection-entry--0_6-final.png`. The framed bottle is present when its Obsidian copy is present. Added a pure opacity assertion and a desktop browser regression for the first held frame, forward scroll and reverse scroll.
- Executed final checks: `npm run lint` PASS; `npm run typecheck` PASS; `npm run test` PASS (7/7); `npm run assets:validate` PASS (34 assets and required GLB parts); `npm run build` PASS (all routes). Production Playwright with `ECLAT_PORT=3006 BASE_URL=http://127.0.0.1:3006 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/collection-edge-e2e.json npm run test:e2e -- --workers=2 --reporter=list,json` PASS: **37 passed, 8 explicit mobile held-stage/WebKit GPU skips, 0 failed**, 1.0 min. Raw results: `docs/collection-edge-e2e.json`.
- Decisions: retain the Santal end correction, native scroll and one persistent home canvas. No bottle assets, unrelated work, Spec Kit deletions, commits or publication were changed.

## Current handoff / next exact actions

1. Review `http://localhost:3001/#collection` from the first Obsidian frame through the final Santal frame, then scroll back through both edges.
2. If gallery framing or chapter spacing changes, rerun both Collection edge regressions and inspect the before/after frames above.
3. Physical iOS/Android GPU rendering remains untested; no further implementation action is required for the reported edge fades.

## Santal collection exit correction — final evidence

- User screenshot showed the held Collection still presenting Santal while its 3D bottles were already almost invisible. Browser reproduction confirmed collection opacity fell to `0.589` at 85% of the gallery scroll and `0` at 94%, although the sticky bottle stage remained fully inside the viewport through 100%.
- Changed only the Collection exit curve: it now stays opaque through the third stop, then uses the existing viewport-presence curve to fade as the stage actually scrolls away. Hero and Composition exits retain their earlier chapter cuts. Added unit coverage for the last stop and exit, plus a Chromium browser regression that seeks 85% → 94% → 100%, scrolls beyond the stage, and reverses to Santal.
- Visible Chromium screenshots inspected: `docs/screenshots/collection-santal-before.png`, `collection-santal-94-final.png`, `collection-santal-100-final.png`, `collection-after-stage-final.png`, and `collection-santal-reverse-final.png`. At 85%, 94% and 100%, `#collection` selected Santal and the live canvas opacity measured `1`; after the stage left, it faded, and reverse scrolling restored opacity `1`. No page errors were observed during the capture.
- Executed final checks: `npm run lint` PASS; `npm run typecheck` PASS; `npm run test` PASS (7/7); `npm run build` PASS (all routes). Production Playwright with `ECLAT_PORT=3006 BASE_URL=http://127.0.0.1:3006 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/collection-santal-e2e.json npm run test:e2e -- --workers=2 --reporter=list,json` PASS: **36 passed, 6 explicit mobile held-stage/WebKit GPU skips, 0 failed**, 1.0 min. Raw results: `docs/collection-santal-e2e.json`. The targeted Chromium regression also passed separately on the local dev server.
- Decisions: preserve native scroll, one persistent home canvas, reduced-motion static artwork and the existing bottle asset. No unrelated user work or Spec Kit deletions were touched. No commit or publication was made.

## Current handoff / next exact actions

1. Review `http://localhost:3001/#collection` through the last Santal stop and continue into Ritual; reverse scroll to confirm the bottle returns with Santal.
2. If gallery height or sticky framing changes, rerun the new browser regression and inspect the final collection screenshots above.
3. Physical iOS/Android GPU rendering remains untested; no additional implementation action is required for this reported fade.

## Bottle motion and studio lighting correction — final evidence

- User screenshots showed the home bottle lagging and rebounding when scroll direction reversed, and Santal detail switching from a differently framed still to live 3D. `BottleJourney` was easing its screen position after every scroll update; that coordinate now follows the DOM stage directly while rotation and scale retain restrained smoothing. Hero vertical travel was reduced, and Composition's cap reveal was shortened so the cap stays visually connected to the bottle.
- The detail inspector now opens at a smaller, consistent pose with a 900 ms matched still-to-canvas dissolve. Original studio lighting has a warmer key, side reflection strips and an amber point/spot accent. A soft light pool and offset cast shadow ground the floating bottle. A trial mirrored bottle/floor was rejected after phone screenshots showed a second-object artifact; the final mirror cue is the reflection in the glass and liquid surface, without an artificial duplicate. The liquid uses a subtle clearcoat and the glass has sharper environment highlights.
- Regenerated all three home WebGL stills with `scripts/generate-live-posters.mjs` and six desktop/phone detail stills with `scripts/generate-detail-posters.mjs`. Local optimized-image caching caused a stale still during iteration, so the already-small original WebPs are served directly. Controlled Santal first-frame comparisons, with the GLB request held until after poster capture, measured a mean RGB difference of **1.63/255** at 1440×900 and **1.50/255** at 375×812 between the still and settled live stage. Evidence: `docs/screenshots/santal-handoff-{poster,live}.png` and `santal-mobile-handoff-{poster,live}.png`.
- Inspected live desktop, 375 px phone and reduced-motion captures: `docs/screenshots/santal-stage-{desktop,mobile,reduced}-final.png`. Inspected Composition forward/reverse captures in `docs/screenshots/composition-{a,b,reverse}-final.png`. No horizontal overflow or page errors were observed in those captures. The bottle keeps a soft shadow while floating; the reduced-motion page has the matched static artwork.
- Final executed commands after source and asset changes: `npm run lint` PASS; `npm run typecheck` PASS; `npm run test` PASS (7/7); `npm run assets:validate` PASS (34 assets and required GLB parts); `npm run build` PASS (all routes); production Playwright with `ECLAT_PORT=3006 BASE_URL=http://127.0.0.1:3006 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/bottle-lighting-e2e.json npm run test:e2e -- --workers=2 --reporter=list,json` PASS: **35 passed, 4 explicit WebKit GPU skips, 0 failed**, 39.7 s. Raw results: `docs/bottle-lighting-e2e.json`.
- The design-taste lint on changed components passed (0 findings). Its full-page inspector captured the final detail page at desktop/tablet/phone in `.taste-skill/lighting-final`, but reported 10 FAIL and 6 WARN against its separate house style. Most are existing master-plan choices (fragrance numbering, editorial eyebrow, rule dividers, sparse imagery); one flags the new spotlight gradient that follows the user's lighting reference. It also flags the pre-existing mobile title below the first fold. These are recorded as visual limitations rather than reported as a passed inspector gate.
- Decisions: preserve the original procedural GLB and brand, native scroll and one persistent home canvas; use local generated assets only. No Blender model rebuild was needed for this lighting/motion fix. Unrelated Spec Kit deletions and other user work remain untouched. No commit, external asset, deployment or publication was made.

## Current handoff / next exact actions

1. Review `http://localhost:3001/#composition` by scrolling down and back up, then visit `http://localhost:3001/fragrances/santal-03` and turn the bottle. The phone and reduced-motion views are captured in the screenshot paths above.
2. If bottle materials or studio lights change again, regenerate both sets of WebGL-matched posters using the commands in README and rerun asset validation plus the production browser suite.
3. Optional separate design pass: bring the mobile product title into the first fold and resolve or document the remaining house-style inspector findings. Physical iOS/Android GPU rendering and complete screen-reader combinations remain untested.

## Scroll story flow correction — final evidence

- The user's new screenshots exposed the actual continuity fault: `ScrollDirector` selected whichever bottle window occupied most of the viewport, then retargeted the fixed WebGL bottle during the Hero→Origin seam. Position damping made that retargeting a visible flight across the chapter boundary.
- Rebuilt the handoff as deliberate shots while retaining one persistent home canvas and native scroll: Hero bottle makes a restrained turn and rise, then fades inside the dark chapter; Origin keeps a single framed WebGL-matched still with subtle scroll drift; Composition restores the 3D bottle for the cap reveal; Collection and Invitation have separate quiet entrances. The canvas fades at shot boundaries and snaps its camera/object target only while hidden, so the bottle does not travel across unrelated content.
- Added a pure chapter-opacity curve with a competition gate for adjacent visible windows, plus a shorter Hero exit on mobile. Static Origin stays visible when WebGL is available, and all other home posters hide once the scene is ready. Reduced motion retains the complete static story; no wheel interception or per-frame React state was added.
- Inspected actual visible Chromium production frames at 1440×900 and 375×812, including mid-transition positions, Composition→Collection and Ritual→Invitation. Contact sheets and individual screenshots: `docs/screenshots/scene-flow/production/1440-contact.png` and `375-contact.png`. At the Hero→Origin seam the canvas opacity reaches zero before the Origin bottle is fully in view; browser measurements showed no horizontal overflow. Forward and reverse seam behavior is covered by a new browser regression.
- Executed checks on the final source: `npm run lint` PASS; `npm run typecheck` PASS; `npm run test` PASS (7/7); `npm run assets:validate` PASS (28 assets and required GLB parts); `npm run build` PASS (all routes); headed production Playwright with `ECLAT_PORT=3006 BASE_URL=http://localhost:3006 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/scene-flow-e2e.json npm run test:e2e -- --headed --workers=2 --reporter=list,json` PASS: 35 passed, 4 explicit WebKit GPU skips, zero failures, 24.4s. The targeted Chromium/mobile WebGL suite also passed 8/8 after the expected Origin-poster assertion was updated.
- Decisions: chapter changes are edited like a film cut instead of forcing one object to fly between distant DOM stages; the bottle geometry and label stay identical. Existing user Spec Kit deletions and other unrelated work remain untouched. No commit, external asset, deployment or publication was made.
- Open limits: the canvas deliberately does not animate over the Origin still; real-time glass remains a WebGL approximation. Physical iOS/Android devices and full screen-reader combinations were not tested.

## Current handoff / next exact actions

1. Review locally with `npm run start -- --port 3007` (or another free port). Scroll slowly forward and backward across Encounter→Origin, Composition→Collection and Ritual→Invitation.
2. If any future layout change moves a scene stage, rerun the browser seam test and inspect the two production contact sheets above before changing the opacity windows.
3. No required implementation work remains for the reported bottle jumps. Optional: physical mobile visual review.

## Previous bottle continuity follow-up — evidence

- User screenshots showed a Cycles poster and WebGL bottle visible together in Origin, an abrupt chapter handoff, and a nearly side-on Origin pose that obscured the label. The opening image also used different offline shading from the live model.
- Active posters now come from the site's own GLB/WebGL materials, labels, light rig and opening pose: `public/posters/{obsidian,neroli,santal}-live.webp`. They were generated locally with `BASE_URL=http://localhost:3001 node scripts/generate-live-posters.mjs` on visible Chromium and added to the asset validator. The old Cycles renders remain as source material.
- `ScrollDirector` initializes the target before the first scene frame. Once the canvas is ready, CSS hides every home poster at once; the canvas appears without a crossfade over a different image. The persistent bottle now eases its position and scale between windows. Origin keeps the front label legible and the cap assembled; the cap lift begins in Composition.
- Browser visual evidence inspected: opening poster/live comparison and 1440×900 / 375×812 Hero, Origin, Composition and static Origin screenshots in `docs/screenshots/bottle-fix/`. Final Origin frames: `1440-origin-final.png` and `375-origin-final.png`. In both, the active scene was Origin, the poster was hidden, and there was no horizontal overflow. Reduced motion kept a visible static poster.
- A production Playwright rerun exposed an intermittent WebKit gallery navigation issue: moving the selected detail link during the entrance animation let Playwright scroll the held gallery into Santal before clicking. Kept the link stationary and removed a duplicate parent entrance animation. Six repeated headed WebKit clicks then navigated to Neroli; the final full suite passed.
- Executed final checks: `npm run lint` PASS; `npm run typecheck` PASS; `npm run test` PASS (6/6); `npm run assets:validate` PASS (28 assets, required GLB parts); `npm run build` PASS (all routes); production headed Playwright with `ECLAT_PORT=3004 BASE_URL=http://localhost:3004 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/bottle-fix-e2e.json npm run test:e2e -- --headed --workers=2 --reporter=list,json` PASS: 33 passed, 3 explicit WebKit GPU skips, 0 failures, 24.4s. Raw results: `docs/bottle-fix-e2e.json`.
- Remaining limits: real-time glass remains a WebGL approximation; active posters match its opening rendering but cannot reproduce a moving 3D pose in the reduced-motion/static path. Physical mobile devices were not tested. Existing unrelated Spec Kit deletions remain untouched and no changes were committed or published.

## Previous bottle continuity handoff

1. Review the local production build with `npm run start -- --port 3005` (or another free port), then scroll slowly from Encounter through Origin and Composition on desktop and phone widths.
2. If bottle geometry or WebGL materials change, regenerate the live posters after starting a local server: `BASE_URL=http://localhost:3001 node scripts/generate-live-posters.mjs`.
3. No required follow-up work remains for this reported inconsistency. Optional: physical iOS/Android visual review.

## Previous motion upgrade context

- User requested an end-to-end motion study of Chanel/D&G and an interactive motion upgrade. Existing baseline below is preserved as completed history.
- Captured the existing app before changes in `docs/motion-upgrade/before`.
- Browser bridge/OS screenshots returned blank captures; switched to the existing master-plan-authorized Playwright CLI workflow. Real reference captures and controls are available.
- Current motion brief: `docs/motion-upgrade/BRIEF.md`.

## Motion upgrade — final evidence

- Implemented reversible per-chapter poses, scale/light travel, physical cap assembly lift, sticky desktop hero and collection, three-bottle spatial gallery, drag/arrow/keyboard timeline seeking, note-sensitive poses, macro parallax and chapter masks.
- User clarified scroll-driven storytelling as the priority. Pairing studio and additional product-detail controls were removed from the proposed scope. See the updated brief.
- Inspected actual M4 browser captures of hero at 0/50/100%, Origin, Composition cap, collection at 0/50/100%, Ritual and Invitation at 1440 and 375 px. No uncaught errors in these captures.
- First production E2E attempt exposed R3F's inner pointer-events override intercepting desktop controls. Fixed all decorative home-canvas descendants to ignore pointer events, preserving the DOM drag/keyboard surface. Rerun: **30 passed, 3 explicit WebKit GPU skips**, no retries/failures, 49.4s. Includes new forward/reverse gallery, drag, keyboard, short-screen and reduced-motion tests.
- Lint, typecheck and 6 unit/component tests passed. Production build passed. Latest change increases gallery hint copy to 13px; build passed afterward.
- Final lint/typecheck and all 6 unit tests pass. Final production build passes. After the pointer and tablet fixes, production browser rerun: **33 passed / 3 explicit WebKit GPU skips**, no retries/failures, 53.0s. JSON: `docs/motion-upgrade/e2e-production.json`.
- Captured and inspected 375/768/1024/1440/1920 widths. Production inspector initially found 16px tablet overflow from the rotating botanical; contained it within the Composition chapter and added a three-position browser regression. Final production inspector: **0 FAIL / 6 defended WARN categories**, one canvas, 36 desktop and 29 compact moving DOM elements, zero console errors. Evidence: `docs/motion-upgrade/design-inspection-final.json` and `.taste-skill/motion-upgrade-final`.
- Actual visible M4 Metal production sample: hero 120.2fps / gallery 119.9fps desktop; constrained viewport with 4×CPU/100ms/1.6Mbps: hero 113.9fps / gallery 98.7fps. LCP168/712ms, CLS0.00006/0.00191, max sampled event durations64/56ms. These are local lab results, not phone GPU/field p75 guarantees. Raw: `docs/motion-upgrade/performance-lab.json`.
- Saved and verified a 29.72s / 8.6MB actual browser walkthrough: `docs/motion-upgrade/scroll-story.webm`; decoded and visually inspected frames at4/12/21s.
- Complete upgrade report and reference limits: `docs/motion-upgrade/QA_REPORT.md`, `docs/reference-motion-study/REPORT.md`. No new library installations, no borrowed reference assets, no public deployment. Firefox stays excluded.

## Previous motion upgrade handoff

1. Review the verified production preview at `http://localhost:3002` (owned local production server kept running for review). The pre-existing user dev server on 3001 and unrelated SSH listener on 3000 were preserved.
2. Scroll forward/back from the opening, then through Composition and the held Collection gallery; try drag, arrows or left/right keyboard on the focusable gallery.
3. To run afresh: `npm run dev -- --port 3001`, or `npm run build` then `npm run start -- --port 3002` on a free port. Final production suite used `ECLAT_PORT=3002`; its server was a verified production instance.
4. No required upgrade work remains. Optional: physical iOS/Android review and richer real-time glass shading. Remaining limits are in the upgrade QA report. Existing unrelated Spec Kit deletions remain untouched; changes are uncommitted.

## Baseline completed history

| Phase | Delivered and verified |
|---|---|
| 0 — Preflight | Read complete master plan; inspected repository, Git, Node/npm and tools; verified stable Next/React/R3F/Drei peers. Preserved existing user deletions of Spec Kit files. |
| 1 — Foundation | Root Next.js App Router/React/strict TypeScript/Tailwind app, typed product data, durable AGENTS and project documentation. Initial build/typecheck passed. |
| 2 — Static brand | Six semantic chapters, local fonts/tokens, original posters/branding, header/modal menu/footer, skip link, notes, variants, all product routes and useful 404. |
| 3 — Bottle | User installed Blender; verified 5.2.3 LTS. Original hollow beveled glass, liquid, cap, collar, label and base; exported 228.9 KiB GLB, editable .blend and three Cycles posters. Drag/rotation/reset inspector. |
| 4 — Story canvas | One lazy demand-rendered home canvas, normalized GSAP chapter poses, poster-window framing, viewport/DPR quality presets, ready/error/context-loss fallback; no wheel interception or per-frame React state. |
| 5 — Hero | Two-line editorial title, intro sequence, original bottle and functional CTA, mobile composition and static reduced-motion path. |
| 6 — Origin/Composition | Ivory form study, original botanical artwork, top/heart/base desktop keyboard tabs and mobile named accordions. |
| 7 — Collection | Three typed identities; selection updates DOM, palette, note preview, link, poster and actual WebGL label/cap/liquid. All local labels preload together; material edits explicitly invalidate demand rendering. |
| 8 — Finishing | Original macro light study, final selected bottle/invitation, full-width closing wordmark, hover/menu/route arrivals and chapter reveals. |
| 9 — Robustness | Responsive visual review; keyboard/focus/menu checks; reduced motion, no JavaScript, unavailable WebGL, model failure and context loss covered. |
| 10 — Tests/visual | Three unit/component tests, production browser suite, axe, original state captures and three visual critique rounds. Final design inspector has zero FAIL with documented brief-required house-style exceptions. |
| 11 — Production/performance | Production build and browser tests pass; actual M4 Metal lab sample plus constrained mobile simulation, asset budget, clean dependency audit. Software-renderer diagnostic kept separate. |
| 12 — Handoff | README/run/edit/regeneration/deployment instructions, style-guide route, CI, QA/performance/asset/design reports and screenshot evidence. No public deployment. |

## Commands actually executed and result

- `npm install` — PASS. Stable Next 16.4.5 / React 19.3.1 / R3F 9.8.2 / Drei 10.7.9; lockfile retained. No alpha renderer.
- `npm run assets:generate` — PASS; local labels, original fallback illustrations, branding, botanical and macro artwork.
- `/Applications/Blender.app/Contents/MacOS/Blender --version` — Blender 5.2.3 LTS.
- `/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/blender/generate_perfume.py` — PASS; GLB, .blend and three 48-sample Cycles PNGs generated in ~39 seconds. Raw log: `docs/blender-generation.log`.
- `node scripts/optimize-assets.mjs` — PASS; delivered WebP posters ~39–41 KiB.
- `npm run assets:validate` — PASS: 25 assets and all six required named parts; `docs/asset-budget.json`.
- `npm run lint` — PASS, including after final source/script refinements.
- `npm run typecheck` — PASS.
- `npm run test` — PASS: 3 tests, 2 files.
- `npm run build` — PASS: home, 404, three statically generated products and style guide.
- `ECLAT_PORT=3001 E2E_PRODUCTION=1 PLAYWRIGHT_JSON_OUTPUT_FILE=docs/e2e-production.json npm run test:e2e -- --workers=2 --reporter=list,json` — PASS: 24 passed, 3 explicitly skipped WebKit GPU lifecycle cases, no failures/retries. Final run ~27.7 seconds.
- `npm audit` and `npm audit --omit=dev` — 0 vulnerabilities after sharp 0.35.5 and a targeted minimatch dev-tool override. No forced framework downgrade.
- `BASE_URL=http://127.0.0.1:3001 PRODUCTION=1 HEADLESS=false node scripts/measure-performance.mjs` — PASS. Actual Apple M4 Metal renderer, ~112.4 fps desktop / 119.5 fps constrained viewport in short samples; LCP 240/656 ms, CLS 0/0.00195, maximum measured click interaction duration 40/56 ms. These are local lab signals, not field INP/p75 CWV or a physical phone GPU benchmark.
- `scripts/capture.mjs` / `scripts/capture-states.mjs` — PASS. Fonts/scene readiness and state captures on visible M4 Chromium; normal console: no errors/uncaught exceptions, eight upstream Clock deprecation warnings.
- Design-taste inspector (three rounds, final fixes rechecked) — 0 FAIL / 4 defended WARN categories. Explicit master-plan eyebrows, indices, underlines and ivory override house-style conflicts. Custom scene harness finds no library `section.scene` elements, so custom choreography is verified with actual browser/state tests instead.

## Visual checks performed

- Final motion/static full pages at 375×812, 768×1024, 1024×900, 1440×900, 1920×1080 in `docs/screenshots/final-motion` and `final-static`.
- Inspected hero at all five widths, desktop/mobile story contact sheets, original Cycles render, Origin/Composition, three collection states, product views, mobile menu, static/reduced-motion/model-error paths and footer.
- State evidence: `docs/screenshots/states`; reports: `docs/design-inspection-final.json`, `docs/DESIGN_REVIEW.md`, `docs/browser-console.json`.
- Fixed initial three-line desktop title, small copy, DOM/WebGL and footer stacking, poster-to-canvas scale, hidden accordion measurement, menu focus wrapping and immediate GPU material redraw. Regenerated and inspected Neroli/Santal state captures after the redraw fix.

## Decisions

- Build in repository root, master plan authoritative. Preserve unrelated deletions and leave work uncommitted for review; no incidental commit or repository publishing.
- Blender became available after preflight, so use its real GLB/renders rather than only procedural fallback boxes. The Python generator remains canonical; local SVG illustrations remain reproducible fallbacks.
- Native scroll, GSAP and React context. Omit optional Lenis, postprocessing, Motion and Zustand to avoid unused weight and competing transform owners.
- Use a standard-material inner liquid with physical outer glass: nested transmissive WebGL surfaces hid the liquid. Offline Cycles has richer refraction; do not call the real-time rendering photorealistic.
- All assets local and original, with open-license font notices. No paid services, reference-brand art, secrets, analytics, forms or purchase flows.
- Firefox skipped at the user's explicit request; removed from default configuration and CI. Chromium and WebKit are the verified browser engines.
- Existing unrelated SSH listener occupies port 3000. Verification used 3001; no unrelated process was stopped. Owned verification servers are stopped during final handoff. Run `npm run dev -- --port 3001` to view locally.

## Open issues / constraints

- No required application work remains. No known failing lint/typecheck/unit/build or configured browser tests.
- Three Chromium-specific GPU lifecycle cases are explicitly skipped in WebKit; physical iOS/Android devices and full screen-reader combinations were not tested.
- R3F 9 / Three 0.185 emits a nonfatal `THREE.Clock` deprecation warning. It is retained/documented, not suppressed; do not adopt an alpha renderer just to silence it.
- Software WebGL (SwiftShader) is much slower than M4 Metal; diagnostic retained in `docs/performance-software-renderer.json`. Static/reduced-motion artwork is available. No software-renderer FPS guarantee.
- No field telemetry/p75 CWV exists. Hosted CI is prepared but has not run. Public deployment requires a real `SITE_URL` at build time and separate authorization; nothing was published.

## Baseline handoff history

1. To review: `npm run dev -- --port 3001`, then open `http://localhost:3001`.
2. Optional: review the experience on physical phones and provide art-direction feedback. Regenerate assets with the documented Blender command if changing bottle proportions/materials.
3. If deployment is later requested, set the approved origin in `SITE_URL`, run the documented checks and deploy through the chosen Next.js host. No deployment action is pending automatically.
