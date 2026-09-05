# 2-LIMITED - Handoff for Claude Code

## Project

- Next.js App Router website for the acoustic rock duo 2-LIMITED.
- Repository: `https://github.com/Shakkam/2limited.git`
- Production site: `https://2limited.vercel.app`
- Working branch: `main`

## Current state

The site already contains:

- Home page with hero parallax
- Band page with Cam and Steph member cards
- Music page
- Tour page
- Videos page
- Media page with photo mosaic
- Contact page and Resend API route
- Shared Navbar, Footer, Sidebar, SocialFloat, transitions, and animation components

## Customizations added

Workspace agents are in `.github/agents/`:

- `buildator`
- `shakkam-build`
- `shakkam-cartography`
- `shakkam-po`
- `shakkam-qa`
- `shakkam-revenue`
- `shakkam-ux`
- `shakkam-webdesigner`
- `shakkam-writer`

Workspace skills are in `.github/skills/`:

- `iap-troubleshooting`
- `store-submit`
- `webdesigner-visual-audit`
- `webdesigner-responsive-a11y`
- `webdesigner-motion-polish`

`shakkam-webdesigner` is the specialist for this Next.js website. Its three web design skills cover visual audits, responsive/accessibility work, and motion polish.

## Recent changes already pushed

Commit: `0661ca8 Add webdesigner customization and SVG branding`

The commit includes:

- All agents and skills listed above
- New SVG logo at `public/images/logorond.svg`
- PNG logo and newly added PNG image assets
- `app/layout.js` now uses `/images/logorond.svg` as the favicon
- `components/Navbar.jsx` now uses `/images/logorond.svg`
- `app/api/contact/route.js` now initializes Resend inside `POST` and returns HTTP 503 when `RESEND_API_KEY` is missing, so `next build` works without local secrets
- The added `.pdn` source image asset

## Validation

`npm run build` passes successfully after the Resend fix.

There is only a Browserslist warning about an outdated `caniuse-lite` database.

## Important discrepancy from previous Claude CLI conversation

A previous Claude CLI conversation said that Steph's bio and the Band copy had been integrated in `data/content.json` and pushed as commit `1fd60c4`.

That commit is not present in the current local clone or in `origin/main` when checked. The current `data/content.json` still has:

- Steph role: `Guitar & Vocals`
- Steph bio: empty
- Cam bio: empty
- Generic English Band copy

Steph's source answers are available in the previous conversation and should be turned into polished site copy before the next content commit. Do not invent Cam's biography; ask Camille for his answers or create a short questionnaire first.

Steph's answers, in summary:

- Started piano at 6, drums at 10, guitar at 14
- Early motivating albums included Metallica's Black Album, Iron Maiden's Seventh Son of a Seventh Son, and Queen I & II
- Created his first band, Offensive, in high school at 18
- Also plays bass, sings, and self-produces albums
- Influences include Queen, Metallica, Iron Maiden, Angra, Supertramp, Nightwish, and many others
- In 2-LIMITED: bass, cajon, hi-hat and snare played with his feet, vocals, experience, universe, compositions, and bad jokes
- Describes the duo as a real rock band in an electro-acoustic two-person format, with two musical one-man bands, heterogeneity, laughter, and tears
- Likes creating, perhaps too much, and has strong, possibly utopian faith in people and social relationships

## Pending deployment task

- GitHub push is complete.
- `npx vercel --prod` was started but stopped at the interactive prompt asking to set up and deploy the project.
- If Vercel is connected to the GitHub repository, the push should trigger an automatic deployment.
- Confirm `RESEND_API_KEY` is configured in Vercel project environment variables for the contact form.
- If using Vercel CLI, run `npx vercel --prod` from the project root and answer the setup/linking prompts in the user's terminal.

## Suggested next steps

1. Recover or recreate the polished Steph content in `data/content.json`.
2. Collect Cam's answers before writing his biography.
3. Improve the Band page so the duo story is less empty and more personal.
4. Verify the Vercel deployment and configure `RESEND_API_KEY`.
5. Keep using `shakkam-webdesigner` for visual and frontend work.
