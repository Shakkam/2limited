---
name: webdesigner-3d-photo-scatter
description: 'Build or tune the CSS-only pseudo-3D "surround photo wall" effect used on the Music page (components/PhotoScatter.jsx, FeaturedTrack.jsx). Use for any request to add, extend, or debug a mouse/touch-reactive scattered photo background, a 3D-looking image carousel, or a tube/dome/sphere-of-photos hero effect built without WebGL.'
argument-hint: 'Describe the photo effect behavior to add or fix'
user-invocable: true
---

# 3D Photo Scatter (CSS-only pseudo-carousel)

`components/PhotoScatter.jsx` fakes a 3D room of photos around the viewer
using only `perspective` + `translate3d` + `rotateY`/`rotateX` — no Three.js,
no WebGL, no extra dependency. This was built through many rounds of visual
trial and error against a real WebGL reference (a Three.js `SphereGallery`);
read this before touching the effect again so the same bugs aren't re-found
the hard way.

## What it actually models

Photos sit on a **concave dome curving in front of the viewer**, not a full
360° room:
- `az` (azimuth, left/right, degrees) spans roughly ±100°.
- Straight-ahead (`az≈0`) is the **farthest** point (like the far wall of a
  room); the sides sit level with the viewer. This curvature — not the
  panel's own rotation — is what reads as "inside a room" instead of
  "outside a barrel". Get the sign of `z` backwards and it inverts that
  reading; this was the single hardest bug to place — see "z depth sign"
  below.
- The horizontal axis has the full "sphere" treatment (rotation, trapezoid,
  growth). The **vertical axis is deliberately just a plain linear pan** —
  mirroring the same rotate/skew/grow math onto vertical movement was tried
  and rejected; real reference photos stay close to flat when they move
  up/down, just gently rotated in-plane.

## Load-bearing implementation details (don't regress these)

1. **`overflow-hidden` + `transform-style: preserve-3d` don't mix.** An
   element with `overflow` other than `visible` forces its own
   `transform-style` to `flat`, which breaks real depth-sorting between
   sibling photos (the geometrically-closer one stops reliably painting on
   top). Split into two nested divs: an outer one that only clips
   (`overflow-hidden`, no 3D), and an inner one that only holds the 3D
   context (`perspective` + `preserve-3d`, no overflow).

1b. **…and `overflow: hidden` doesn't actually *clip* 3D descendants
   either.** The flip side of the same browser behavior: in Chrome, an
   ancestor's `overflow: hidden` does **not** reliably clip
   `preserve-3d`-transformed descendants. The photos genuinely escaped the
   section, painted over the footer below it, and **inflated the document's
   scroll height** — which presented as a phantom vertical scrollbar that no
   amount of `overflow-x: hidden` or section-height tuning could fix. The
   fix is `clip-path: inset(0)` on the clipping box (on both the section and
   the photo layer here): a hard clip that 3D content can't escape. **Symptom
   to recognize:** content visibly rendering past a container's boundary
   (e.g. over the footer) plus unexplained page scroll.

2. **`sin()`/`cos()` reverse past 90°.** A photo's screen position is driven
   by `sin(effectiveAngle)`. Once the combined angle (a row's own angle plus
   the mouse-driven rotation) exceeds ~90°, `sin` peaks and starts
   *decreasing* — the photo visibly "changes its mind" and drifts back
   toward center instead of continuing to exit the frame. Fix: clamp the
   angle fed to `sin`/`cos` at a safe point (`POSITION_CLAMP_DEG`, currently
   75°) and linearly extrapolate past it using the curve's own slope there
   (see `projectAngle()`), so motion keeps going in the same direction
   instead of curving back.

3. **Cap each photo's own `rotateY`/`rotateX` well below 90°.** Position can
   swing across the whole dome, but if the panel's *own* rotation also
   tracks that angle 1:1, wide-angle photos turn edge-on and effectively
   disappear (and can flash their CSS "backface" as a blank card).
   `MAX_INDIVIDUAL_SKEW` (60° horizontal) / `MAX_VERTICAL_SKEW` (12°,
   deliberately much smaller — see above) keep every photo always
   substantially facing the viewer.

4. **Clamp `translateZ` (the `z` value) well under the `perspective`
   value.** Extreme row angle + extreme mouse rotation can otherwise push a
   photo's depth past the camera plane (`z` approaching or exceeding
   `perspective`, currently 1600), which renders as huge/broken and can
   inflate the page's own layout size. `z` is hard-clamped
   (`clamp(z, -1400, 1200)`).

5. **Photos grow at the edges, they don't shrink.** A real 3D camera
   (wide-ish FOV) makes peripheral images *larger*, not smaller —
   measured off the WebGL reference at roughly **×2.1 width** and **×1.3–1.5
   height** from center to edge. Model this as growth added on top of the
   position math (`EDGE_GROWTH_X` / `EDGE_GROWTH_Y`, separate `scaleX` /
   `scaleY` — not a single uniform `scale`, since width grows much faster
   than height), not as the natural shrink `rotateY` alone would produce.
   Don't stack an *additional* separate shrink factor on top of the
   trapezoid's own foreshortening — that was tried and just made photos
   collapse too small.

6. **Depth-sort order is DOM/paint order unless `preserve-3d` is real (see
   #1).** If two photos ever overlap in the wrong order, this is the first
   thing to check, not the individual `z` math.

6b. **Spacing compensation must account for the edge growth (#5), on both
   axes.** Rows sit ~300px apart but an edge photo grows to ~380px tall, so
   without compensation neighbouring rows visibly overlap. Each photo is
   nudged away from center proportionally to how much it grew:
   `SPACING_COMPENSATION_Y` is **1.0** (full compensation — exactly cancels
   the growth, since a photo that grows by `(scaleY-1)*BASE_H` gains half of
   that on each side), while `SPACING_COMPENSATION_X` at 0.4 is enough
   horizontally because the columns are further apart. If overlap reappears,
   check row spacing against `BASE_H × max scaleY` before touching anything
   else.

7. **This is a deliberate approximation, not a WebGL clone.** The
   inspiration sites (e.g. a Codrops "3D image tube" build, or a
   `ThreeSphereGallery`/`ThreeCameraPerspective`-based portfolio) use a real
   Three.js/`react-three-fiber` camera that can sit *inside* the geometry.
   CSS's `perspective` camera is always external to the transformed scene —
   a true "camera inside a full 360° ring" is not reproducible this way.
   Set that expectation up front rather than re-discovering it through
   several rounds of "why does it still look like the outside of a barrel".

## Responsive & exact-fit behavior

- **Narrow-screen tightening**: `frameWidth` (measured live via
  `ResizeObserver` in `FeaturedTrack.jsx`, not assumed) drives `spreadScale`,
  which scales the horizontal radius and the row spacing down together below
  ~1200px — the layout is tuned for a wide desktop hero and looks too sparse
  untouched on mobile. Keep the clamp floor high enough (currently 0.8) —
  much lower reads as visibly cramped, not just "tighter".
- **Exact edge margin**: rather than guessing a pixel or `vh` margin, the
  vertical pan range is *solved algebraically* from the section's real,
  live-measured height (`frameHeight`) so that at the mouse extreme, a
  reference photo's edge lands exactly `VERTICAL_MARGIN` px from the
  section's true boundary — see the formula in `PhotoScatter.jsx` around
  `verticalPanRange`. Don't replace this with a fixed padding/inset; that
  was tried twice and either did nothing (padding an element that doesn't
  clip) or clipped/cut photos at the wrong, non-adaptive distance.
- **Whole-page fit**: when a page must show header + this effect + footer
  in exactly one viewport with no scroll (as on `/music`), don't guess a
  `vh` split. Measure `window.innerHeight` minus the *actual* rendered
  footer height (`document.querySelector('footer')`, since the footer's own
  height changes on mobile) in a small client component, size a flex
  container to that, and give the photo section `flex-1` / `h-full` instead
  of any `min-h-[Xvh]` guess. See `app/music/MusicClient.jsx` +
  `app/music/page.js` (metadata must stay in a server `page.js`; the
  measuring logic lives in the client child).

## Debugging: check the shared layout *before* tuning the effect

Two of the longest-running bugs in this build (a permanent scrollbar and a
dead black band above the footer) had **nothing to do with the effect** —
they came from `components/PageTransition.jsx`, the wrapper that every page
goes through, which carried `min-h-screen`. Combined with the `<Footer />`
rendered after it in `app/layout.js`, every page was structurally
`100vh + footerHeight` tall: a permanent scrollbar exactly as tall as the
footer, and, on a page sized to fit the viewport, a forced empty band inside
the wrapper. The fix was the standard sticky-footer pattern: `body` as
`min-h-screen flex flex-col`, page wrapper as `flex-1`.

**Rule of thumb:** if the symptom is "the page is slightly too tall" or
"there's dead space I can't account for", read `app/layout.js` and the page
wrapper components *first*. Repeatedly adjusting section heights, margins,
paddings or row math from inside the page cannot fix a floor imposed one
level up — and each such attempt looks like a regression to the user.

## Touch support

Mirror every mouse handler with a touch equivalent driven by the same
normalized-coordinate helper (`e.touches[0].clientX/clientY` instead of
`e.clientX/clientY`), reset on `touchend`/`touchcancel` the same as
`mouseleave`. Don't special-case touch with different math — reuse the exact
same position→transform pipeline.

## Procedure for new requests against this effect

1. Read `components/PhotoScatter.jsx` and `components/FeaturedTrack.jsx`
   fully before changing constants — nearly every tunable interacts with at
   least one other (radius vs. row spacing vs. photo size vs. overlap;
   growth vs. spacing compensation; pan range vs. measured frame height).
2. If the request references "how the reference site does it", ask for (or
   take) a screenshot comparison — **specific pixel measurements
   (width/height at center vs. at the edge) beat visual guessing** and were
   what actually converged this effect after many rounds of adjustment.
3. Change one constant/behavior at a time, rebuild (`npm run build`), and
   describe precisely what should be visible before asking for another
   screenshot.
4. Prefer adjusting the existing formulas (position, skew, growth, margin)
   over adding new competing mechanisms (e.g. a second shrink factor, a
   fixed clip inset) — this effect broke more often from stacked, redundant
   adjustments than from any single wrong number.

## Output

Summarize which constants or formulas changed, why (tie back to one of the
gotchas above if relevant), and what the user should check for on the next
screenshot.
