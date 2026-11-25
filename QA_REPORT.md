# QA report

Testing of branch `redesign/bam-iran-corporate`, 25 November 2026. The production build ran on `next start`; development mode on `next dev`. The browser was Chromium via Playwright, used to render and inspect pages and measure layout. Every result below was observed; nothing was assumed.

## Build and types

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Pass, 0 errors |
| `npm run build` (clean `.next`) | Pass. 79 static pages, including all 58 `/projects/<slug>` pages |
| `npm run lint` | **Not run.** ESLint is not installed or configured in this repository (`next lint` would start an interactive setup). `next build` type-checks |
| Tests | None exist in the repository |
| Installed Next.js | `node_modules` holds **15.2.4** while `package.json` pins 15.5.28. This predates the redesign; run `npm install` to align |

## Routes (production build)

- All 72 sitemap URLs return **200**: 7 section pages, 58 projects, 4 architects, 3 articles.
- `/admin` and `/events/sample-architecture-talk` return **404** in production and 200 in development, as intended.
- Unknown URLs return 404 with the branded not-found page.
- `robots.txt` disallows `/admin`. The admin layout sends `noindex, nofollow`; the sample event pages do too.
- Sample-event data appears in **no** production bundle (`grep` over `.next/static` and `.next/server`: 0 files). This was fixed during QA: the first build bundled it into a shared client chunk without rendering it.

## Content preservation

- `git diff` against `main` is empty for `data/projectContent.ts`, `data/projectLocations.ts`, `data/projectImages.generated.ts`, `scripts/`, `public/projects/`, `public/brand/` and `app/fonts/`.
- `data/projects.ts`: only type changes, Arabic category labels and two helper functions; no record changed.
- All 549 image paths referenced from `data/` exist under `public/`.
- Official text was extracted by script, not retyped (see `CONTENT_INVENTORY.md`).

## Functional checks (Playwright)

| # | Check | Result |
|---|---|---|
| 1 | Archive loads at `/projects` | Pass |
| 2 | Every project route works | Pass (58/58) |
| 3 | Archive category filter | Pass (Medical: 10 rows) |
| 4 | Visual and Index views; view remembered after reload | Pass (58 cards / 58 rows; Index persisted) |
| 5 | Project photographs | Pass (all references resolve) |
| 6 | Project exterior slider | Pass (BAM Jamshidieh: 5 slides; indicator 3 activates slide 3) |
| 7 | Interior gallery | Pass (BAM Jamshidieh: 8 images) |
| 8 | Google Maps link | Pass (approved link unchanged) |
| 9 | Homepage links | Pass |
| 10 | Architect cards → profiles; project Architect fact → profile | Pass (Bamland → Adib, Yousefi; Jamshidieh → Daliri) |
| 11 | Architect profile lists credited projects | Pass |
| 12 | Event cards → detail (development data) | Pass |
| 13 | Upcoming/past logic | Pass (2027 events "Upcoming"; Jun/Sep 2026 "Past", against 25 Nov 2026) |
| 14 | Journal links | Pass |
| 15 | Language switching EN/FA/AR; `lang`/`dir` on `<html>` | Pass |
| 16 | Light/dark switching | Pass |
| 17 | Theme follows system on first visit; choice persists | Pass (dark system → dark; toggle → light kept after reload) |
| 18 | Language persists | Pass |
| 19 | Header on desktop and mobile | Pass (after a fix, below) |
| 20 | Mobile drawer: open, focus moves in, Tab trapped, Escape closes, focus returns, scroll lock released | Pass |
| 21 | No horizontal overflow | Pass: 14 widths (320–3840) × 8 routes × FA and EN = 224 checks, 0 overflow |
| 22 | No broken images | Pass |
| 23 | Console errors | None across 42 page loads (3 languages × 2 themes × 7 routes) in development, and none in production. No hydration warnings |
| 24 | Hero autoplay (7s), next/previous, pause on hover | Pass |
| 25 | Selected Projects filter in all categories | Pass (Medical: Nikan Clinic, Sepid Hospital, Nikan Hospital; International: 311, B77, X11; …) |
| 26 | Before/after: drag, keyboard, RTL | Pass (drag 30 → 80; Home = 0; ArrowRight +5 in LTR, −5 in RTL; earlier image on the start side) |
| 27 | `prefers-reduced-motion` | Pass: no autoplay |

## Contrast (computed)

| Pair | Ratio |
|---|---|
| Secondary text `#575756` on white / plaster | 7.23 / 6.46 |
| Orange text `#b5430c` on white / plaster | 5.57 / 4.97 |
| Dark secondary `#a5a5a2` on ink | 6.84 |
| Dark orange text `#f07a3e` on ink / on `#262625` | 6.08 / 5.45 |
| Footer labels `#8f8f8c` on ink | 5.21 |
| Brand orange `#ea5b16` on white | 3.5 (used for rules and indicators only, never small text) |

## Visual review

Inspected as screenshots: the homepage in English (light, 1440), Persian (light, 1440 and 390), Arabic (dark, 1440), Persian (dark, 1024), English at 768, 320 and 3840; the archive, the Bamland project page, the Daliri profile, Contact, a journal article, Events (production empty state, and development with sample data), and the mobile drawer.

Problems found and fixed during review:

1. The 97%-opaque sticky header let text show through → solid.
2. Header tools sat next to the logo below 1240px (a selector-specificity bug) → aligned to the end edge in both directions.
3. The head office photograph appeared in both Selected Projects and About → curation changed.
4. A Persian article on the English site had its text block flush-left under a right-aligned headline → aligned right.
5. The tablet layout hid the third architect → replaced with a snap rail showing all three.
6. Arabic mixed Arabic-Indic and Western digits → Western throughout.
7. The first journal image was the LCP without `priority` → added.
8. Sample-event data was bundled in production → removed at build time.

## Known limitations

- **English About text:** the official award years are wrong and are shown as published (see `CONTENT_INVENTORY.md` §3).
- **Low-resolution sources:** the before/after "before" image (539 px) and the journal covers (~600 px) look soft at large sizes.
- **Partial Arabic:** Arabic is interface-only. Content shows the Persian original with a note. The Arabic company name is unapproved, so the Persian name is used.
- **Metadata language:** language is a client-side preference (the existing architecture), so server metadata and URLs are English. Search engines index the English rendering. Per-language URLs (`/fa/...`) would be a separate, larger change.
- **Image optimisation:** this uses Next.js's built-in optimiser (it needs `next start` or a platform like Vercel). A static export would need a different image loader.
- **Hero preload warning:** in production, a returning Persian visitor may see a "preloaded but not used" console warning for the hero image while the boot script hides the page before hydration. It is harmless.
- **Not covered:** real touch devices (only emulated pointer input), screen readers, and Lighthouse/Core Web Vitals.

## Refinement round — results

The development server (sample events) and a clean production build were both checked with Playwright in Chromium; the screenshots were inspected.

| Check | Result |
|---|---|
| `tsc --noEmit` | Pass |
| `npm run build` (clean) | Pass, 79 pages |
| Lint | Not configured (unchanged) |
| Production routes / image references | 72/72 return 200; 549 references plus the 4 new activity images resolve |
| Sample data in production bundles | 0 files |
| Protected data (`projectContent`, `projectLocations`, generated images, scripts, media, logo, fonts) | Unchanged vs `main` |
| Homepage order | hero, projects, activities, about, architects, events, journal; no before/after |
| Production homepage | Events hidden (no published events); before/after absent |
| Activities | 6 items; one open at a time; all can close; visual switches (photo or drawing); collapsed links not focusable; links `/projects?category=healthcare` and the Hidden Treasure article |
| Selected Projects mosaic at 1440 | Large card 644 × 700; small cards 311 × 304; wide card 644 × 353, ending level with the large card. Mirrors in FA |
| Event tabs | All → 4, Past → 2, Upcoming → 2 (sample data, against 25 Nov 2026); arrow keys LTR and RTL; Home/End |
| Archive columns | 4 at 1440/1280/1200; 2 at 1199/1024/768; 1 at 767/390 (Visual View); Index View intact (Medical: 10 rows) |
| Events archive columns | Same as archive |
| `?category=healthcare` | Opens on Medical with 10 projects |
| Horizontal overflow | None: 12 widths (320–3840) × 3 routes × FA/EN/AR |
| Console errors / hydration warnings | None |

Found and fixed during review:

1. The event date range wrapped with an orphaned separator dot.
2. Archive titles were too large at four columns.
3. Grid breakpoints failed at exactly 1199 and 767px: the CSS pipeline compiles `<` range syntax to `max-width: 1199px`, which misses under fractional device-pixel ratios. Now `1199.98px` / `767.98px`.
4. Two activity photographs repeated images already shown in Selected Projects; they were replaced.

## Homepage drag carousels — results

Development server plus a clean production build; Playwright/Chromium, screenshots inspected.

- **Desktop (1440):** four equal cards (644 × 433) in 2 × 2. "All" holds 54 projects in 27 columns.
- **Mouse drag:** snaps one column (0 → 667px) without navigating. Next/previous step one column. A plain click opens the project; an event click opens the event.
- **RTL (FA):** dragging right reveals the next column (scrollLeft −667); the arrows are mirrored.
- **Touch** (mobile context with `hasTouch`, raw CDP touch events): a horizontal swipe moves one card (0 → 317px); a vertical swipe over the carousel scrolls the page (683 → 1095) without moving it; a tap opens the card.
- **Filters/tabs:** a change resets the position. Medical shows 10, International 4. Event tabs: Past 2, Upcoming 2 (sample data). With 4 or fewer cards the arrows are hidden.
- **Widths:** 768, 820, 1024 and 3840 show four cards (338–756px wide, inside the container); below 768, one card per swipe with a glimpse of the next.
- **Archives:** unchanged. Projects 4/2/1 columns at 4:3; Events 4/2/1 at 3:2 with the original `sizes`; no carousel markup; Index View 58 rows.
- **Overflow / console:** no overflow across 12 widths × FA/EN/AR; no console errors or hydration warnings.
- **Build:** `tsc`, `npm run build`, 72/72 routes, 0 demo files in production bundles.

## Journal, architects and global contact — results

Development server plus a clean production build; Playwright/Chromium, screenshots inspected (FA/EN/AR, light/dark, 390/768/1280/1440).

- **Journal FA at 1440:** image at the right (x 1097–1368, 271 × 169, 16:10), text to its left, "category · date" in one line, arrow at the end. EN mirrors the layout, and Persian-only headlines align with their metadata. Mobile shows the image above the text.
- **Directory:** 3 / 2 / 1 columns at 1280 / 768 / 390. Vector placeholders (monogram for ERGA). Counts: Daliri 9, Adib 1, Yousefi 1, ERGA 1, from `projectCredits`. No "Selected work".
- **Profile at 1440:** portrait at x 847 (right), text at x 57 (left) in both FA and EN. Studio details kept. Contact icons `tel:+982122395087` and `mailto:` link the verified studio email. BAM Projects show real photographs.
- **Floating toolbar:** present on all 12 public routes (each 200) in EN, FA and AR, 12px from the right edge, absent on `/admin`, hidden at the footer, a horizontal row on 844 × 390 landscape. It shows Instagram and Phone; LinkedIn is hidden (URL not supplied).
- **Overflow:** none across 7 widths × 3 languages on the architect pages, nor on the homepage across 12 widths × 3 languages.
- **Console:** no errors or hydration warnings on a fresh dev server.
- **Production:** `tsc` and build pass; 72/72 routes; 0 sample-event or sample-bio files in the bundles; profiles render the placeholder and no sample label.

Found during QA: a long-running dev server began answering every `[slug]` route with 404 after repeated hot reloads. A restart cleared it, and the production build serves all routes, so it was dev-server state, not code. Also fixed: the profile back link ran into its label; the floating toolbar overlapped content edge controls at 1440 (it now sits in the gutter at 12px / 44px); the mobile portrait filled the first screen (now centred, max 280–340px).
