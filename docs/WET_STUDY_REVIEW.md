# Wet bottle and water review

Scope: the existing product inspector and its mobile title order. The master plan fixes the original bottle, typography, palette, fragrance numbering and editorial conventions, so this component pass kept that direction without a new random draw. No external photographs, models or footage were introduced.

ROUND 1 — before
Seen in one second: a pale glass bottle above a second, inverted bottle.
Idea (one sentence): an original fragrance suspended above a quiet water study.
Live thing: drag or use the arrow buttons to turn the bottle.
Layout words by section: product=split / alternatives=pair / footer=wordmark.
Scores: design 5.5 · usability 6 · creativity 6 · content 8 → overall 6.0.
Caps applied: inspector house-style findings; title below the first mobile screen.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `.taste-skill/water-before/mobile-fold.jpg`: the brown caption/button slab consumes 120px and feels attached as a separate panel. Replace it with one compact caption/control row on the page background.
2. `.taste-skill/water-before/desktop-fold.jpg`: the duplicate bottle reflection reads as a second object and the glass looks pale and opaque. Remove the duplicate mesh; use a proper opaque scene background for transmission, a controlled light rig and a physically shaded water surface.
3. `.taste-skill/water-before/mobile-fold.jpg`: the product title starts below the first fold. Move the single actual H1 above the scene at phone widths.

ROUND 2 — scene refinement
Seen in one second: transparent glass with small wet beads; an overlit patch beneath it.
Idea (one sentence): water gathers on the glass, detaches and briefly disturbs a calm surface.
Live thing: the wet highlights follow the bottle turn; a repeating drop drives the surface wave.
Layout words by section: product=split / alternatives=pair / footer=wordmark.
Scores: design 6 · usability 8 · creativity 7 · content 8 → overall 6.0 (capped).
Caps applied: retained master-plan house-style differences.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `screenshots/wet-study/desktop-v1.png`: the initial floor reflects a broad white light patch. Lower its specular intensity and derive the fragment normal from the wave height field.
2. `screenshots/wet-study/stage-v2.png`: intersecting ambient waves make a busy checker pattern. Replace them with two low-amplitude directional waves.
3. `screenshots/wet-study/drop-contact.png`: ripples expand too far and retain dark, sharp crests. Reduce amplitude from .022 to .008, speed from .72 to .5 and strengthen damping; replace the torus splash with a low scalloped surface sheet.

ROUND 3 — final
Seen in one second: one wet bottle, clear glass edges and a compact set of controls.
Idea (one sentence): a small bead leaves the wet glass and sends a brief disturbance across a quiet water surface.
Live thing: drag/keyboard bottle inspection and a gravity-shaped drop, low splash, rebound bead and dispersing wave packet.
Layout words by section: product=split (phone=title/stage/details) / alternatives=pair / footer=wordmark.
Scores: design 6.5 · usability 8.5 · creativity 7 · content 8 → overall 6.0 (house-rule cap; weighted score before cap 7.35).
Caps applied: the generic inspector still reports eight FAIL findings, including the master-plan numbering/eyebrow/rules, three images rather than four, and few moving DOM elements. Its motion counter does not measure the GPU wave or droplet. The link-card text groups are flagged as three-line headlines, although the name, number and supporting sentence are separate styles. These results are recorded, not presented as a passed design-skill gate.
Top three remaining limitations (most visible first), each with the screenshot it shows in and the disposition:
1. `screenshots/wet-study/final/neroli-02.png`: the liquid core still looks more opaque than an offline optical render. It remains the documented WebGL compromise to avoid nested transmission artifacts.
2. `screenshots/wet-study/final/water-contact.png`: the effect is a small authored drop with an analytical wave field, not a full fluid solver or planar reflected bottle. This keeps it smooth and subtle in the inspector.
3. `.taste-skill/wet-final/mobile-page-01.jpg`: the existing alternative-fragrance blocks and editorial labels retain the master plan's styling. This pass did not redesign the full product page.

Inspected all six final inspector fold/page sheets at 1440, 768 and 390px, plus production desktop, tablet, phone, wide, reduced-motion, rotation, variant and poster/live states under `screenshots/wet-study/final/`. No image or control overlaps, horizontal clipping or inaccessible content were observed. Browser and test outcomes are in `IMPLEMENTATION_LOG.md` and `wet-study-e2e.json`.
