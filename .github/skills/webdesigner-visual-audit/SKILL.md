---
name: webdesigner-visual-audit
description: 'Audit the visual direction of the 2-LIMITED Next.js website. Use when reviewing typography, palette, imagery, composition, hierarchy, or visual consistency across pages and shared components.'
argument-hint: 'Name the page, component, or visual concern to audit'
user-invocable: true
---

# 2-LIMITED Visual Audit

Use this skill before a substantial visual redesign or when a page feels generic, inconsistent, or visually weak.

## Procedure

1. Read the target page, its shared components, `app/globals.css`, and the relevant entries in `data/content.json`.
2. Inspect the actual image and video assets used by the page. Do not infer colors, crops, or subject placement from filenames alone.
3. Compare the page with neighboring routes and shared navigation/footer patterns.
4. State one concrete visual hypothesis, such as weak hierarchy, ambiguous focal point, or inconsistent type scale.
5. Propose the smallest set of changes that tests that hypothesis. Separate observations from preferences.
6. If editing is requested, preserve real content and existing architecture; update the owning component or page rather than adding a parallel styling system.

## Checklist

- The band identity and primary content are visible immediately.
- Typography has a deliberate role hierarchy and remains readable over imagery.
- Crops, overlays, and contrast support the content instead of hiding it.
- Shared elements look like one coherent site across desktop and mobile.
- Sections feel editorial and intentional, not like nested generic cards.

## Output

Return findings ordered by impact, followed by the proposed change and any asset or browser check still needed.