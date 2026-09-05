---
name: webdesigner-motion-polish
description: 'Polish page transitions and purposeful motion in the 2-LIMITED Next.js site. Use for Framer Motion reveals, parallax, hover states, loading transitions, interaction feedback, and motion performance or reduced-motion review.'
argument-hint: 'Describe the interaction or transition that should feel better'
user-invocable: true
---

# Motion and Interaction Polish

Use this skill after the static composition is sound and the requested improvement concerns movement, feedback, or perceived quality.

## Procedure

1. Read the existing motion components before adding a new animation. Reuse `AnimatedTitle`, `FadeUp`, `PageTransition`, `HeroParallax`, or nearby patterns when appropriate.
2. Define the user purpose of the motion: orientation, hierarchy, continuity, feedback, or atmosphere.
3. Keep one clear focal motion per moment. Avoid adding simultaneous reveals that compete with the page content.
4. Use Framer Motion and CSS already present in the project; do not add a motion library for a small effect.
5. Ensure the initial render remains usable if animation is disabled, interrupted, or delayed.
6. Respect reduced motion and avoid expensive continuous effects on mobile or large image surfaces.
7. Validate the route after the change and check that navigation, focus, and content remain available during transitions.

## Quality bar

- Motion explains a change or reinforces hierarchy.
- No layout shift is introduced by entering or exiting elements.
- Hover-only feedback has a touch-friendly equivalent.
- Reduced-motion users receive the same information and controls.
- The effect remains performant on mobile-sized viewports.

## Output

Summarize the interaction purpose, implementation surface, reduced-motion behavior, and validation result.