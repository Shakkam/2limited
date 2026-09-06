---
name: webdesigner-i18n-content
description: 'Add or edit bilingual (FR/EN) content and content-driven pages on the 2-LIMITED site: the LanguageProvider/t()/pick() pattern, data/content.json + data/ui.json, the Band page bio timeline (components/BioTimeline.jsx), the member hover-video photos (components/MemberPhoto.jsx), and the date-derived Shows/Concerts page (app/tour). Use for any request to add a language, edit copy, add a show/date, or extend the band bio.'
argument-hint: 'Describe the content or bilingual-page change to make'
user-invocable: true
---

# Bilingual content & content-driven pages

The site has no localized routes (no `/fr/...`, no `next-intl`) — every page
is bilingual by resolving `{ fr, en }` objects at render time. Read this
before touching copy, adding a language, or extending the Band/Shows pages.

## The i18n pattern

- **`components/LanguageProvider.jsx`** is the whole mechanism: a
  `LanguageContext` exposing `{ lang, setLang, t }`, plus the exported
  `pick(value, lang)` helper `t` wraps. `pick` resolves `{fr,en}` → the
  string for `lang` (falling back to the other, then `""`), maps over
  arrays element-wise (so `bio: [{fr,en}, {fr,en}]` just works), and passes
  a plain string through untouched (proper nouns, emails, song titles don't
  need translating — don't wrap them in `{fr,en}` just for consistency).
- **Server renders English** (`DEFAULT_LANG`), then on mount: a stored
  `localStorage["2limited:lang"]` choice wins if present, otherwise
  `navigator.language` decides FR vs EN. This is a deliberate hydration
  tradeoff — reading `navigator`/`localStorage` during render would mismatch
  server/client output, so expect a brief flash of English on first load
  before the effect runs. Don't try to "fix" this by reading them
  synchronously; that reintroduces the hydration bug this design avoided.
- **`data/ui.json`** holds all interface strings (nav labels, section
  eyebrows, button/form text) as `{fr,en}`, namespaced per page
  (`ui.band.title`, `ui.shows.tickets`, …). **`data/content.json`** holds the
  actual band content (bios, member roles, track subtitles, shows) the same
  way. Keep this split: UI chrome in `ui.json`, real content in
  `content.json`.
- **Adding a third language**: extend `SUPPORTED` in `LanguageProvider.jsx`,
  add the new key to every `{fr,en}` object (`pick` already handles more
  keys than 2 — it just needs `value[lang]` to exist), add a language
  button in `Navbar.jsx`'s `LanguageSwitch`, and add an `Intl`/date-format
  locale entry anywhere one exists (see `LOCALES` in `ShowsClient.jsx`).
- **Server/client split is required, not optional**: any page needing
  `export const metadata` must stay a server `page.js`; the actual bilingual
  UI (which needs `useLanguage()`, a client hook) lives in a sibling
  `*Client.jsx` the server page renders. This is why every page in the app
  is split this way — don't collapse it back into one file when editing.

## Editing content

- Band bios, member roles, track subtitles, contact email, shows: all live
  in `data/content.json`. Each translatable field is `{ "fr": "…", "en":
  "…" }` — edit both, never just one, even for a quick typo fix.
  `contact.email` and image/video `src` paths are plain strings on purpose
  (not translatable).
- Interface labels (nav, buttons, empty states, placeholders): `data/ui.json`,
  same `{fr,en}` shape, read through `t(ui.<page>.<key>)` in the matching
  client component.
- Adding a member bio paragraph: append to that member's `bio` array in
  `content.json` as another `{fr,en}` entry — `BandClient.jsx`'s
  `memberEntries()` maps every array entry to one timeline row
  automatically (see below), no other wiring needed.

## Band page: paired two-column bio timeline

`components/BioTimeline.jsx` replaced the old per-member bio-paragraph
cards. It is **not** an alternating single-track timeline — that was tried
first and rejected by the user because it left blank space opposite short
entries. The shipped design is two synchronized columns sharing one central
divider line:

- Cam's paragraphs are **always** the left column, Steph's **always** the
  right — never alternate sides.
- Rows are **paired**, not independent: row 0 is the band's own two blurbs
  (`bandIntro` left, `bandSound` right); every row after that pairs one Cam
  paragraph with one Steph paragraph at the same index. **Every row must
  have content on both sides** — nothing ever sits across from blank space.
  If one member ever has more bio paragraphs than the other, add a filler
  paragraph or restructure pairing rather than shipping a lopsided row.
- `BandClient.jsx`'s `timelineRows` is built by zipping
  `memberEntries(cam)` and `memberEntries(steph)` index-for-index
  (`Math.max` of both lengths, `.filter(Boolean)` to drop the band-row slot
  if bio data is ever missing). Follow this same zip pattern when adding
  more row types — don't reintroduce alternating/mirrored logic.
- Each column animates independently (`whileInView`, right side gets a
  small `delay: 0.1` vs left's `0`) so the reveal doesn't feel mechanically
  simultaneous, but layout-wise they are always a strict `grid-cols-2` pair,
  never a single flowing track.
- The divider (`absolute left-1/2 … bg-gradient-to-b from-transparent
  via-zinc-800 to-transparent`) plus a small dot per row
  (`absolute left-1/2 -translate-x-1/2 -top-1.5 …`) are purely decorative —
  keep them `aria-hidden` and don't let them affect column layout.
- Member entries show a small round `MemberPhoto` avatar + name + role
  above the paragraph; band entries show just an uppercase label
  (`item.heading`) above the paragraph. Don't add numbering (01/02, etc.) —
  the user explicitly rejected numbers next to Cam/Steph in favor of a
  giant outlined initial letter (see `MemberCard.jsx`), which stays scoped
  to the top photo cards, not the timeline.

## Member photo → video on hover

`components/MemberPhoto.jsx` factors out the hover mechanism shared by the
big top-of-page member photos (`MemberCard.jsx`) and the small timeline
avatars (`BioTimeline.jsx`): a static `<img>` swaps opacity with a muted,
looping `<video>` on `mouseenter`/`mouseleave` (video is reset to
`currentTime = 0` and paused on leave, not just hidden, so it always
restarts from the top next hover). The video path convention is fixed:
`/videos/{member.name.toLowerCase()}.webm` — adding a new member means
adding both `/images/{name}.png` (or similar, set as `member.photo`) and
`/videos/{name}.webm`, no code change needed. Reuse this component — via
`className`/`imgClassName`/`videoClassName` props — for any new place a
member photo appears; don't re-implement the hover toggle inline.

## Shows / Concerts page

`app/tour/page.js` (server, holds `metadata`) renders `ShowsClient.jsx`
(client). Shows live in `data/content.json`'s `shows` array — see the
`_showsFormat` doc comment there for the field shapes (`date` is the only
required field, ISO `YYYY-MM-DD`; `time`, `venue`, `note`, `ticketUrl` are
all optional, and `venue`/`note` may be `{fr,en}` if they need translating).

- **Upcoming vs past is derived, not manually maintained**: `ShowsClient`
  compares each `show.date` against start-of-today and buckets/sorts
  accordingly (upcoming ascending, past descending). Adding a new show is
  just appending to the `shows` array — never move an entry between
  sections by hand, and don't add a `status`/`isPast` field; the date does
  all the work.
- Past shows render at `opacity-50` and never show a ticket link even if
  `ticketUrl` is still set.
- Empty state (`ui.shows.none`) is deliberately sized
  `text-base md:text-lg tracking-wide`, not the small
  `text-xs tracking-widest uppercase` used for section eyebrows elsewhere —
  the user explicitly flagged the small version as "écrit petit" (too
  small) for a message that's the only content on the page.
- Dates format per-locale via `Intl.DateTimeFormat` (`LOCALES = { fr:
  "fr-FR", en: "en-GB" }`) — extend `LOCALES` rather than hand-formatting a
  new language's dates.

## Procedure for new requests in this area

1. For a copy/wording change: find the field in `content.json` or
   `ui.json`, edit both `fr` and `en` keys together.
2. For a new bilingual page: copy the server/client split from an existing
   page (`app/tour/page.js` + `ShowsClient.jsx` is the smallest example),
   never put `useLanguage()` in a file that also exports `metadata`.
3. For a Band-page bio change: respect the paired-row invariant (every row
   filled both sides) — if the change would unbalance the two members'
   paragraph counts, say so and ask how to pair the extra entry rather than
   shipping a blank half-row.
4. Rebuild (`npm run build`) after any content or component change here —
   this catches missing `{fr,en}` keys and JSON syntax errors that dev mode
   won't always surface immediately.

## Output

Summarize which files changed (content data vs. component vs. both), confirm
both languages were updated where relevant, and flag anything that still
needs a real browser check (hover-video playback, language auto-detection,
date formatting in the target locale).
