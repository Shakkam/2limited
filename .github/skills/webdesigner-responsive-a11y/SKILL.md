---
name: webdesigner-responsive-a11y
description: 'Improve responsive behavior and accessibility in the 2-LIMITED website. Use for mobile layout bugs, overlapping text, clipped media, keyboard navigation, focus states, semantic HTML, alt text, contrast, or reduced-motion issues.'
argument-hint: 'Describe the responsive or accessibility problem and the affected route'
user-invocable: true
---

# Responsive and Accessible Frontend

Use this skill when a visual change must hold up on narrow screens, wide screens, keyboard input, and reduced-motion settings.

## Procedure

1. Identify the owning route and component, then inspect its current layout constraints and interactive states.
2. Check the smallest practical viewport first, then a wide viewport. Look specifically for overflow, overlap, unstable dimensions, and controls that become unreachable.
3. Preserve semantic structure: headings in order, landmarks, buttons for actions, links for navigation, and labels for form controls.
4. Add or repair visible focus states, useful image alt text, sufficient contrast, and `prefers-reduced-motion` behavior where relevant.
5. Prefer CSS constraints, responsive grid/flex rules, and stable aspect ratios over JavaScript viewport guesses.
6. Validate the touched route with a build or focused browser check when available.

## Acceptance checks

- No text or controls overlap at mobile or desktop widths.
- Long labels wrap or resize without shifting fixed-format controls.
- Every interactive element is keyboard reachable and visibly focused.
- Decorative images are not announced; meaningful images have useful alt text.
- Animations reduce or stop when the user requests reduced motion.

## Output

Report the affected breakpoint or interaction, the fix, and the validation performed. Call out any browser-only check that remains.