"use client";

import { motion } from "framer-motion";

// Photos placed across a horizontal dome curving in front of the viewer, in
// 6 rows of at most 4 (az = azimuth/left-right angle; altPx = fixed row
// height in px, spaced 270px apart — 50% more than before, for real vertical
// travel). The "sphere" effect — rotation, trapezoid, growth — is horizontal
// only. Moving the mouse up/down is a plain linear pan, no curvature.
// sizeScale (0.7-1) varies each photo's size for an organic, non-mechanical
// field.
const BASE_W = 200;
const BASE_H = 250;

const PHOTOS_3D = [
  // Row 1 — top
  { az: -100, altPx: -475, sizeScale: 0.8, tilt: -5 },
  { az: -33, altPx: -475, sizeScale: 1.0, tilt: 4 },
  { az: 33, altPx: -475, sizeScale: 0.85, tilt: -4 },
  { az: 100, altPx: -475, sizeScale: 0.95, tilt: 6 },
  // Row 2 (offset so it doesn't stack under row 1)
  { az: -66, altPx: -285, sizeScale: 0.9, tilt: -3 },
  { az: 0, altPx: -285, sizeScale: 0.75, tilt: 5 },
  { az: 66, altPx: -285, sizeScale: 1.0, tilt: -5 },
  { az: 120, altPx: -285, sizeScale: 0.8, tilt: 4 },
  // Row 3
  { az: -100, altPx: -95, sizeScale: 0.85, tilt: -6 },
  { az: -33, altPx: -95, sizeScale: 1.0, tilt: 3 },
  { az: 33, altPx: -95, sizeScale: 0.8, tilt: -3 },
  { az: 100, altPx: -95, sizeScale: 0.9, tilt: 5 },
  // Row 4
  { az: -66, altPx: 95, sizeScale: 1.0, tilt: -4 },
  { az: 0, altPx: 95, sizeScale: 0.8, tilt: 6 },
  { az: 66, altPx: 95, sizeScale: 0.9, tilt: -6 },
  { az: 120, altPx: 95, sizeScale: 0.85, tilt: 3 },
  // Row 5
  { az: -100, altPx: 285, sizeScale: 0.9, tilt: -3 },
  { az: -33, altPx: 285, sizeScale: 0.8, tilt: 5 },
  { az: 33, altPx: 285, sizeScale: 1.0, tilt: -5 },
  { az: 100, altPx: 285, sizeScale: 0.85, tilt: 4 },
  // Row 6 — bottom
  { az: -60, altPx: 475, sizeScale: 0.85, tilt: -4 },
  { az: 0, altPx: 475, sizeScale: 1.0, tilt: 5 },
  { az: 60, altPx: 475, sizeScale: 0.8, tilt: -5 },
];

const BASE_RADIUS = 820; // horizontal (azimuth) radius
const ROT_Y_RANGE = 90; // deg the whole room turns at full mouse swing (left/right look)
const VERTICAL_MARGIN = 50; // px of guaranteed clearance from the section's real top/bottom edge at full mouse swing
const FALLBACK_PAN_RANGE = 620; // used only before the section's real height has been measured
const INDIVIDUAL_SKEW_FACTOR = 0.85; // how much of the *current* horizontal distance from dead-center becomes this photo's own trapezoid
const MAX_INDIVIDUAL_SKEW = 60; // cap so a photo's own face is never edge-on, however far it swings
const EDGE_GROWTH_X = 1.1; // extra width at the far edge — measured ×2.1 on the reference site
const EDGE_GROWTH_Y = 0.4; // extra height at the far edge — measured ×1.3-1.5 on the reference site
const SPACING_COMPENSATION = 0.4; // push a photo further out as it grows, so growing doesn't eat into the gap to its neighbor
const POSITION_CLAMP_DEG = 75; // beyond this, keep sliding outward in a straight line instead of following sin/cos back toward center

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// sin()/cos() only move a photo further out up to 90° — past that they double
// back toward center, which reads as the photo "wanting to return" instead of
// exiting the frame. Past `clampDeg` (comfortably before 90°) we keep sliding
// it outward in a straight line (using the true curve's own slope there)
// instead of following the curve back down. Returns [position term, depth term].
function projectAngle(effectiveDeg, clampDeg) {
  const clampedDeg = clamp(effectiveDeg, -clampDeg, clampDeg);
  const clampedRad = (clampedDeg * Math.PI) / 180;
  const overshootRad = ((effectiveDeg - clampedDeg) * Math.PI) / 180;
  const sinC = Math.sin(clampedRad);
  const cosC = Math.cos(clampedRad);
  return [sinC + cosC * overshootRad, -cosC + sinC * overshootRad];
}

const ALT_MAX = Math.max(...PHOTOS_3D.map((p) => p.altPx)); // the extreme (top/bottom) row's height
const CENTER_SIZE_SCALE = 1.0; // the extreme rows' own center photo is full-size — used as the reference for the edge calculation

export default function PhotoScatter({ photos = [], mouse = { x: 0, y: 0 }, frameHeight = 0, frameWidth = 0 }) {
  if (photos.length === 0) return null;

  // Tighten the whole spread on narrow (mobile) screens — the layout is
  // tuned for a wide desktop hero, so below ~1200px everything gradually
  // pulls closer together instead of leaving huge gaps.
  const spreadScale = frameWidth ? clamp(frameWidth / 1200, 0.8, 1) : 1;
  const scaledRadius = BASE_RADIUS * spreadScale;
  const scaledAltMax = ALT_MAX * spreadScale;

  // The room's overall turn — this is what makes photos swing across the
  // view as you move the mouse left/right. Vertical is handled separately,
  // below, as a plain pan (no rotation).
  const worldRotationY = -mouse.x * ROT_Y_RANGE;

  // Solve for how far a full mouse swing should pan vertically so that, right
  // at the extreme, the last row's own center photo ends up with exactly
  // VERTICAL_MARGIN of clearance from the section's real edge — not more,
  // not less, on any screen size.
  const halfPhotoHeight = (BASE_H * CENTER_SIZE_SCALE) / 2;
  const verticalPanRange = frameHeight
    ? Math.max(0, 2 * (scaledAltMax + halfPhotoHeight - frameHeight / 2 + VERTICAL_MARGIN))
    : FALLBACK_PAN_RANGE;
  const verticalPan = -mouse.y * verticalPanRange;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* overflow-hidden here (to clip to the section) would otherwise force
          transform-style back to flat on any element it's combined with —
          so the real 3D/depth-sorted layer lives on this separate child. */}
      <div className="absolute inset-0" style={{ perspective: 1600, transformStyle: "preserve-3d" }}>
        {PHOTOS_3D.map((p, i) => {
          const photo = photos[i % photos.length];
          if (!photo) return null;

          // Where this photo currently sits relative to straight-ahead, after
          // the room has turned — dead center (≈0) is whichever photo is
          // currently "in front of you".
          const effectiveAz = p.az + worldRotationY;

          const [xTerm, zTermH] = projectAngle(effectiveAz, POSITION_CLAMP_DEG);
          const x = xTerm * scaledRadius;
          const y = p.altPx * spreadScale + verticalPan;
          // Negative: straight-ahead is the *farthest* point, like the far wall
          // of a room, while the sides sit level with the viewer — this
          // curvature is what reads as "inside a room" rather than "outside a
          // barrel". Horizontal only — vertical movement is a plain pan.
          // Clamped well under `perspective` (1600) — extreme row az (up to
          // 120°) combined with extreme mouse rotation can otherwise push a
          // photo's depth past the camera plane, which renders as broken/huge
          // and can throw off the page's layout size.
          const z = clamp(zTermH * scaledRadius, -1400, 1200);

          // Negated: for a photo sitting to the left, its outer (left) edge
          // should read as closer/bigger, not its inner (right) edge — the
          // previous sign had every photo's trapezoid pointing the wrong way.
          const skewY = clamp(-effectiveAz * INDIVIDUAL_SKEW_FACTOR, -MAX_INDIVIDUAL_SKEW, MAX_INDIVIDUAL_SKEW);

          // Measured off reference screenshots (one photo, center vs. far edge):
          // width goes from 97 to ~205 (×2.1) while height only goes from 113 to
          // ~150 (×1.3-1.5) — growth is mostly horizontal, not a uniform scale.
          // Horizontal distance only, same reason as above.
          const edgeDistance = clamp(Math.abs(effectiveAz) / 90, 0, 1.3);
          const scaleX = (1 + edgeDistance * EDGE_GROWTH_X) * p.sizeScale;
          const scaleY = (1 + edgeDistance * EDGE_GROWTH_Y) * p.sizeScale;

          // Growing outward can eat into the gap to the next photo — nudge it
          // further out proportionally to how much it grew, so neighbors keep
          // their spacing instead of crowding together at the edges.
          const spacingPushX = Math.sign(x) * (scaleX - 1) * (BASE_W / 2) * SPACING_COMPENSATION;

          return (
            <motion.div
              key={i}
              className="absolute rounded-md overflow-hidden shadow-2xl border border-white/10"
              style={{
                top: "50%",
                left: "50%",
                width: BASE_W,
                height: BASE_H,
                marginLeft: -BASE_W / 2,
                marginTop: -BASE_H / 2,
              }}
              animate={{
                x: x + spacingPushX,
                y,
                z,
                rotateY: skewY,
                rotate: p.tilt,
                scaleX,
                scaleY,
              }}
              transition={{ type: "spring", stiffness: 40, damping: 18, mass: 0.8 }}
            >
              <img src={photo.src} alt={photo.alt || ""} className="w-full h-full object-cover" />
              {/* Léger ombrage: a soft vignette so each photo reads as a grounded
                  object rather than a flat sticker. */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 36px 8px rgba(0,0,0,0.4)" }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Light overall dimming only — the text reads via its own shadow, not a black-out vignette */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 pointer-events-none" />
    </div>
  );
}
