# BAM Iran redesign — changelog

Branch `redesign/bam-iran-corporate`, from `main` at `6ca7f3a`. The BAM Project Atlas archive becomes the portfolio section of a corporate site for BAM Engineering Development Group. Nothing has been committed, pushed or deployed.

## Routes

| Route | Before | After |
|---|---|---|
| `/` | Project archive | **New** corporate homepage |
| `/projects` | Redirect to `/` | The archive (unchanged function: Visual/Index, categories) |
| `/projects/<slug>` | Project page | Same URLs and content; shared header and footer; architect links |
| `/architects`, `/architects/<id>` | — | **New** directory and profiles (4 verified) |
| `/events`, `/events/<slug>` | — | **New** listing (Upcoming/Past) and detail. Empty in production |
| `/journal`, `/journal/<slug>` | — | **New** listing and 3 official articles |
| `/about`, `/contact` | — | **New**, with verbatim official content |
| `/admin` | — | **New** UI prototype, development only, `noindex` |
| `/robots.txt`, `/sitemap.xml` | — | **New** (public pages only) |

## Homepage

Sections in the specified order:

1. **Hero:** three existing 2800px photographs (Bamland, BAM Choobineh, BAM Simindokht); crossfade; 7s autoplay with pause; counter, progress, previous/next; swipe.
2. **Selected Projects:** a 7/5 editorial grid with the approved category filter in all three languages.
3. **Before/After:** the official homepage feature, rebuilt as a draggable, keyboard-operable comparison.
4. **About BAM:** a 5/7 split with the verbatim excerpt.
5. **Leading Architects:** a dark band with three verified architects.
6. **Events & Experiences:** shown only when events exist.
7. **BAM Journal:** the official articles.
8. **Footer:** the official contact data.

## Added

- Arabic interface language with RTL; `resolveText()` fallback rules; `lang`/`dir` marking on fallback text.
- Light and dark themes with system default, persistence and no flash.
- Global header: transparent over the hero and solid on scroll; desktop navigation with active state; Contact button; mobile drawer.
- Footer with logo, verbatim excerpt, navigation, contact, Instagram and language switch.
- `data/architects.ts` and `projectCredits`; the project page Architect fact links to profiles.
- `data/events.ts` with publication and timing logic; `data/demo/events.ts` for development only.
- `data/journal.ts`, `data/company.ts`, `data/home.ts`.
- Media copied from bamgroup.ir: `public/home/before-after/`, `public/journal/`.
- Metadata (title template, canonical, Open Graph), `robots.ts`, `sitemap.ts`.
- Documentation: `CONTENT_INVENTORY.md`, `DESIGN_SYSTEM.md`, `CMS_INTEGRATION_NOTES.md`, `QA_REPORT.md`.

## Changed

- `app/globals.css`: new BAM Iran tokens (palette, theme, type scale, layout, motion). Archive tokens kept as aliases; hard-coded archive colours replaced with tokens; copper accent → BAM orange.
- `lib/i18n.ts`: three languages, date/number/time formatting, all new interface strings in EN/FA/AR.
- `lib/preferences.ts`: theme preference; boot script handles `ar` and theme.
- `data/projects.ts`: types allow an optional `ar`; Arabic category labels; `getProjectByCode`, `hasPhotography`. **No record changed.**
- `components/Header.tsx`, `SiteFooter.tsx`, `LanguageSwitcher.tsx`: rewritten for the corporate site.
- `ProjectDetail`, `ProjectInformation`, `ProjectIndexList`, `ProjectVisualGrid`, `CategoryFilter`, `ProjectHeroSlider`: trilingual text, links to `/projects`, architect links.
- `.gitignore`: ignores `/.playwright-mcp/` (local QA screenshots).

## Not changed

`data/projectContent.ts`, `data/projectLocations.ts`, `data/projectImages.generated.ts`, `scripts/`, `public/projects/`, `public/brand/`, `app/fonts/`. Verified byte-identical with `git diff`.

## Removed

- The `/projects` → `/` redirect, since the archive now lives at `/projects`.
- Old header/footer CSS rules (`.top-nav`, `.nav-short`, the one-line footer), replaced by the new header and footer.

## Refinement round

- **Homepage order:** Hero → Selected Projects → **Activities & Projects of BAM** (new) → About → Leading Architects → Events → Journal → Footer. The before/after section was removed from the homepage; its data, images and component are kept.
- **Activities** (`components/home/BamActivities.tsx`, `data/activities.ts`): an "architectural expertise index". A sticky 5-column visual beside a 7-column numbered accordion (01–06), with one item open at a time, a 300ms grid-rows transition, an orange active state, and collapsed panels that are `inert`. On mobile, the photo moves inside the open item.
- **Selected Projects:** four cards in a 12-column mosaic — large (6 columns, two rows) plus two small (3 + 3) over one wide (6). It mirrors in RTL, becomes 2 × 2 on tablets and a single column on phones. Curation in `data/home.ts`; fewer than four results fall back to the earlier layouts.
- **Events (homepage):** All / Past / Upcoming tabs (`components/events/EventTabs.tsx`; WAI-ARIA tablist with arrow keys mirrored in RTL, plus Home/End). Up to four events in a 2 × 2 grid of horizontal cards. A localised empty state appears per tab. The section stays hidden in production until real events exist.
- **Event cards:** a date-led design (large day numeral with month and year); multi-day ranges sit on their own line.
- **Journal (homepage):** the heading beside a typographic list (date, category, title, small thumbnail) instead of a third card grid.
- **Leading Architects (homepage):** original architectural line drawings (`components/ArchitectVectorArtwork.tsx`: curved-facade tower, axonometric frame, arcade) replace the photographs. The directory and profile pages still show the photographs.
- **Archives:** Visual View and the Events archive show 4 / 2 / 1 columns at ≥1200 / 768–1199 / <768px. Index View is unchanged.
- **Archive URLs:** `/projects?category=<id>` opens on that category, and the filter updates the URL.
- **Rhythm:** sections alternate white → plaster (Activities) → white (About) → ink (Architects) → plaster (Events) → white (Journal). Section spacing reduced to 56–120px.
- **New strings:** activity link labels and event tabs, in EN, FA and AR.

## Homepage drag carousels

- New `components/DragCarousel.tsx`: one native horizontal scroller holding columns of two stacked cards, so both rows always move together. It adds mouse dragging (6px threshold; a drag cancels the click; snaps to the nearest column), keeps native touch swiping and vertical page scrolling, has previous/next buttons, and follows the document direction (RTL) and reduced motion. No dependency added.
- **Selected Projects** and **homepage Events** now use it: four equal 16:9 cards (2 × 2) visible from 768px, one card per swipe below that. Projects show every photographed project in the category (curated first); events show every visible event in the tab. A filter or tab change restarts the carousel.
- The four-card mosaic and the 2 × 2 event grid (and their CSS) were removed. `EventCard` keeps its single stacked layout. Its image `sizes` is now a prop, so the Events archive keeps its original value.
- The Projects and Events archive pages are unchanged.

## Journal, architects and global contact

- **Homepage Journal:** heading and "All articles" link on top, an editorial list below across the content width. Each row: image at the start side (right in FA/AR), then category · date, headline, and a circular arrow. The date column is gone. Images are 16:10 at 200–280px; on mobile the image stacks above the text.
- **Architect cards** (`ArchitectCard`): portrait frame, name, short bio, and "BAM Projects: N". No project photos and no "Selected work". The homepage keeps its architectural line drawings in the portrait frame.
- **`ArchitectPortrait` / `ArchitectPortraitPlaceholder`:** a 3:4 frame. It shows a supplied portrait, or else a head-and-shoulders line drawing with construction lines and one orange accent (a monogram for practices such as ERGA). Theme-aware.
- **Architect model:** `bioShort`, `bioLong`, `contact` (phone, email, website, instagram, linkedin), and `portrait` as an image object. Helpers: `architectBio()` (approved text first, then the development-only sample), `bamProjectCount()` (distinct project codes in `projectCredits`), `architectContact()`.
- **Profile page:** text on the left and portrait on the right in every language (an LTR grid; each column keeps the page direction). Kicker, name, role, long bio, studio details (unchanged), contact icons, then BAM Projects with real photographs. On tablets and phones, a smaller centred portrait sits above the text.
- **`ContactLinks`:** circular outlined icons that render only channels with a verified value.
- **`FloatingContact`:** in the root layout. Instagram, LinkedIn and Phone stacked bottom-right (physical, never mirrored). It hides while the footer is visible and is absent on `/admin`. It becomes a horizontal row on short landscape screens. LinkedIn is hidden until configured.
- **Strings:** profile, project count, contact labels, sample-text labels and toolbar labels in EN, FA and AR. The unused "Selected work" strings were removed.
