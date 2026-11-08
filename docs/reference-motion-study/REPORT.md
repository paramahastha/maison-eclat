# Reference motion walkthrough — 2026-11-07

These are motion and interaction studies, not production assets. Sources: [Bleu de Chanel](https://www.chanel.com/fr/parfums/bleu-de-chanel/les-fragrances/) and [D&G Velvet layering](https://beautytools.dolcegabbana.com/en-id/velvet/layering). Inspected in visible Chromium at 1440×900 using Playwright, after the browser bridge returned blank OS screenshots. No Firecrawl was needed. Cookies were dismissed to reach the experience.

## Chanel journey

1. Landing: cinematic environment with a three-bottle composition and quiet discovery cue. Evidence: `02-chanel-hero.png`.
2. Discover/scroll: enlarged bottle/cap framing and sparse product narrative; scroll moves the visual hierarchy through the campaign. Evidence: `03-chanel-discover.png`.
3. Fragrance comparison: changed the fragrance/intensity selection, observed the active fragrance/copy change and explored the arrows. Evidence: `10-chanel-comparison.png`, `11-chanel-selected.png`, `14-chanel-details.png`.
4. Continued to the campaign's end/footer. Evidence: `07-chanel-scroll.png`.

Health limitation: “En savoir plus” displayed an in-page error toast. Some subsequent selectors were unavailable in that state. This run therefore does **not** verify successful downstream detail/purchase flows. No purchase/cart actions were performed.

## D&G journey

1. Entered the spatial gallery: bottle, ingredient objects, reflections, ambient particles, previous/next arrows and gallery/list controls. Evidence: `04-dg-gallery.png`.
2. Advanced the camera/selection, dragged the gallery and observed a settled new bottle/material arrangement. Evidence: `05-dg-next.png`, `06-dg-drag.png`, `08-dg-settled.png`.
3. Switched to list view and selected Blue Musk. Evidence: `09-dg-list.png`, `12-dg-selected.png`.
4. Entered customization: the centered product became a choice between transform/enhance intentions. Evidence: `13-dg-customize.png`.
5. Chose Transform and reached the recommended pairing/explanation; scrolled to the final Art of Layering content. Evidence: `18-dg-result.png`, `19-dg-enhance-end.png`.
6. Attempted the alternate enhancement checkbox. The subsequent capture still showed Transform; the alternate result is **not verified**. `20-dg-enhance.png` records that outcome. External commerce destinations were outside this study.

## Applied principles

- Let a product's changing orientation and light carry the story, with bounded periods of stable editorial framing.
- Use spatial depth and scale to communicate selected versus neighboring identities.
- Transition product, palette, text and destination together; provide explicit controls alongside gesture discovery.
- Build chapter-specific motion rather than repeating a generic entrance animation.

Maison Éclat translates these principles into original models, original art and native scroll. Its new sequence deliberately focuses on scrolling after the user's clarification. Reference screenshots are stored only as private repository research evidence; none are imported by the app. Files `01-chanel-current.png` and `01-chanel-visible.png` are blank bridge failures and are not evidence.
