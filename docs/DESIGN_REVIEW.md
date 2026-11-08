# Visual review

Latest scroll upgrade (2026-11-07): [current validation and visual evidence](motion-upgrade/QA_REPORT.md). The results below document the preceding baseline.

The supplied master plan governs the palette, display font, chapter numbering, eyebrows and underlined actions. Design-taste's conflicting bans on these devices are explicit exceptions. Its unrelated stock landscapes/pinned portraits were not substituted for the requested original fragrance story. Review uses real screenshots and rendered original assets.

## Round 1

Seen in one second: a tall amber bottle in an ink room.
Idea: three compositions become three exhibits of lingering light.
Live thing: fragrance selection changes the visual identity, notes and product destination; the product bottle turns.
Layout words: hero=split object / origin=ivory editorial study / composition=orbit and notes / collection=index plus exhibit / ritual=full-bleed light study / invitation=signature / footer=wordmark.
Scores: design 7.0 · usability 7.0 · creativity 7.0 · content 7.5 → overall 7.05.
Caps: the three-line desktop title limited the first pass; house-style conflicts with the user's brief are documented rather than treated as defects.
Top three problems:
1. Desktop hero title wrapped onto three lines in `docs/screenshots/hero-1440.png`. Widened its measure; it now fits two.
2. Browser glass hid the nested transmissive liquid in the first motion screenshots. Replaced the inner liquid with a tuned standard material, retaining physical glass/reflections and the original Blender geometry.
3. Small text was too fine on mobile. Increased running copy to 16px and interface copy to 13px; kept only the small brand ornament separate initially, then raised it too.

## Round 2

Seen in one second: the original bottle and the two-line presence statement.
Idea and live thing: unchanged; the composition continues through all six chapters.
Scores: design 7.5 · usability 8.0 · creativity 7.0 · content 7.5 → overall 7.55.
Top three problems:
1. Transparent full-viewport canvas was above the DOM in stacking order. Even though no pixels obscured text, it triggered coverage detection. Raised DOM copy above it; later raised footer too. Decorative background wordmarks are CSS ornament, outside reading content.
2. The poster-to-canvas framing used rotated bounding-box dimensions, enlarging the bottle. Match the actual image's object-fit box, including padding, while keeping the canvas mounted.
3. Native menu focus wrapping differed across browsers, and the accordion could briefly expose multiple open panels. Added explicit modal Tab wrapping and native named accordion grouping. Automated checks now cover both.

## Final inspection interpretation

The final inspector is run with `eyebrow,numbering,hairline,micro-label` exceptions because the master plan explicitly supplies those motifs. Remaining warnings are assessed against screenshots: warm ivory is the required palette; the three selector subtitles are interface content rather than mixed-font headlines; a live 3D object replaces decorative video; a fixed canvas can be missed by DOM-only fullness measurements. All actual reading content must remain clear, within the viewport, and unoccluded. Final results and screenshots are recorded in `QA_REPORT.md`.

The interactive WebGL material is a real-time approximation. The offline Cycles posters have more realistic internal reflections. No photograph or physical fragrance is claimed.

## Round 3 — final

Seen in one second: the original amber bottle and a decisive two-line title.
Live thing: the three atmospheres now update the actual rendered label, cap and liquid immediately, as well as the DOM, palette and destination.
Layout words remain distinct across all six chapters. Final hero screenshots at 375/768/1024/1440/1920 and the mobile/desktop product, menu, Neroli/Santal selection and fallback captures were inspected.
Scores: design 7.5 · usability 8.0 · creativity 7.0 · content 7.5 → overall 7.55. No claim of an award or external jury review.
Caps: no unresolved browser inspector FAIL; the user's explicitly specified editorial ornaments override conflicting house-style caps.
Final fixes:
1. Variant selection could leave the previous material visible until a scroll because the canvas renders on demand. Explicitly invalidate after material/texture edits; updated Neroli and Santal captures prove the correct label, cap and liquid without another scroll.
2. Hero fallback/name were hardcoded while the 3D object followed selection. Bind both to typed fragrance data; added a browser assertion.
3. Closed accordion content was falsely classified as covered text by the DOM-only inspector. Explicitly mirror native closed-details visibility in CSS, preserving native no-JS expansion. Final inspector reports zero FAIL and four defended WARN categories.

Remaining refinements are optional: richer physically based liquid shading, art-direction feedback on chapter pacing, and physical mobile-device review. The scene uses a lower-cost real-time material instead of the offline renderer's full refraction.
