# Aquarium entry review

**Superseded motion (2026-11-08):** the lift described below was rejected. Current motion starts empty, falls directly from above after 350ms, contacts at approximately 833ms, and transitions into a position- and velocity-continuous damped underwater response. There is no rise before the fall. Current screenshots/video: `docs/screenshots/aquarium-fall/`. Static/reduced-motion/error artwork remains complete. Earlier sections below preserve the preceding iteration’s evidence.

The full product square is the aquarium, with no inset glass frame. The page-colour edge blend remains. The latest change replaces the stale brown loading artwork with six dry opening stills rendered by the same camera, model, lighting and pose as the live canvas.

## Sequence

- First 650ms of the live clock: hold the dry pose. The 350ms DOM crossfade completes before movement begins.
- 650–1450ms: lift the bottle beyond the upper edge.
- 1450–2200ms: accelerating descent. At 1820ms the entry impulse activates the water, radial wave packet and ballistic droplets together.
- Following seconds: damped bottle recovery, dispersing ripples and stronger caustic patterns decay into the steady underwater float. No repeat/restart on ordinary scrolling. Native scrolling and rotation controls remain available.
- Reduced motion: dry still, or an explicitly enabled static 3D inspection; no drop. Offscreen and hidden-tab clocks pause. No per-frame React state.

## Visual evidence

`docs/screenshots/aquarium-entry/`: preparing, handoff, lift, impact, settling and ready frames at 1440×900, 768×1024 and 375×812, plus WebM recordings. Reviewed desktop handoff/settling/ready and phone preparing/ready at full size. No console/page errors and no horizontal overflow in the capture report. Surface opacity and edge falloff were reduced after the initial capture showed an overly solid horizontal band. Strong impact patterns are brief; the label remains readable in the settled view.

`fallback-report.json`: normal half-float and forced no-float paths both rendered without errors and recorded **0 draw calls during a one-second offscreen interval** after instant scrolling and settling. The no-float path uses analytic waves and unsigned-byte scene storage. These are local Chromium/M4 checks, not physical-phone performance certification.

The design-taste inspection was executed: `.taste-skill/aquarium-entry/report.json`, with its six screenshots inspected in `inspection-sheet.png`. Result remains **8 FAIL / 7 WARN**, not a clean gate: it flags the existing master-plan collection eyebrow, numbering, hairlines/ivory, variant-link text grouping, image count, typography count and lack of video. Its DOM motion counter does not measure the WebGL sequence, and its capture catches the intentional lift mid-animation. This scoped scene revision preserves the established brand and content; the generic page-style findings are not represented as fixed.

## Limits

This is an authored bottle entry coupled to a small GPU wave heightfield, a ballistic droplet burst and screen-space optical effects. It is not SPH, full volumetric fluid physics or a physically validated buoyancy simulation. The “scaled” appearance is transient caustic light and disturbed water, not a solid crust. Reference and MIT notice are recorded in ASSET_REGISTER.md.


## Final checks

Lint/typecheck/build PASS; unit tests 11/11; asset validation 36 assets. Final production browser suite: 39 passed, 9 existing explicit skips, 0 failures/retries, 26.3s. Report: `docs/aquarium-entry-e2e.json`. Skips are the desktop-only mobile gallery cases and Chromium-specific GPU lifecycle cases on WebKit. The ordinary WebKit routes, accessibility, menu and reduced-motion tests pass.
