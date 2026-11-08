# Asset register

| Asset | Origin | License / use | Modified |
|---|---|---|---|
| Bottle geometry and labels | `scripts/blender/generate_perfume.py`, Blender 5.2.3 LTS | Original concept, no third-party trade dress | Authored here; hollow beveled glass, inner liquid, collar, cap, base and custom label |
| Live bottle posters | `scripts/generate-live-posters.mjs`, local Chromium WebGL capture of the original GLB | Original project asset | Three transparent WebP stills regenerated with the shared detail-style lighting, corrected clear glass, attached beads, labels and opening pose of the interactive scene |
| Detail opening posters | `scripts/generate-detail-posters.mjs`, local Chromium capture of the original inspector scene | Original project asset | Desktop and phone WebP stills for all three bottles use the current camera, glass materials and variant-specific static aquarium. Reduced motion retains this complete still; the animated opening hides it so the stage stays empty until entry |
| Studio water textures | `scripts/generate-water-texture.mjs` | Original procedural asset | Archived original textures from the previous CSS water study; the active detail scene now uses a procedural Three.js wave surface |
| Posters, macro study, botanical motifs, favicon and OG | `scripts/generate-assets.mjs` | Original procedural SVG and raster derivatives | Authored here |
| Cormorant Garamond | `@fontsource/cormorant-garamond`, https://github.com/CatharsisFonts/Cormorant | SIL Open Font License 1.1; license retained in package and `public/fonts` | Font subset distributed unchanged |
| Manrope | `@fontsource/manrope`, https://github.com/sharanda/manrope | SIL Open Font License 1.1; license retained in package and `public/fonts` | Font subset distributed unchanged |

No product photographs, reference-brand imagery, external HDRIs, hotlinks or paid assets. The three active bottle posters are local captures of the site's own WebGL scene, not photographs. The original Blender Cycles renders remain in `public/posters` as authored source material; SVG illustrations remain as a regeneration fallback. `public/models/maison-bottle.blend` is the editable studio scene; the Python script is canonical for geometry.

Final GLB: 234,436 bytes (228.9 KiB). Active WebGL-matched WebP posters are about 66–71 KiB each; source PNGs, Cycles WebPs and `.blend` are not requested by the application. The generated local environment uses Drei Lightformer, with no remote HDRI or decoder. Grain and botanical motifs are original SVG. Exact asset sizes are written by `npm run assets:validate` to `docs/asset-budget.json`.

The current detail water uses `AquariumScene.tsx`, `useAquariumWater.ts`, `AquariumOptics.tsx` and `aquarium-shaders.ts`, with instanced beads from `BottleMoisture.tsx`. `WaterSurface.tsx` is the earlier drop study. The aquarium is a GPU heightfield plus authored entry/splash and optical approximation, not a full particle simulation. Reference: RealAbdurRehman/fluid-simulation at commit `08159a02eb776d086f222f50b098e5dae4944efa` (MIT); its separation of caustics, absorption and refraction informed the implementation. License notice: `docs/licenses/fluid-simulation-MIT.txt`. No external model, imagery or fluid service is used.
