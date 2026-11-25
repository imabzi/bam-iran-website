# Content inventory

Audit of what the BAM Project Atlas repository contained before the redesign, what was reused, what was added from BAM's official website, and what is still missing. Audit date: 25 November 2026. Branch: `redesign/bam-iran-corporate` (from `main` at `6ca7f3a`; the working tree was clean).

## 1. What already existed (reused, unchanged)

| Content | Where | Status |
|---|---|---|
| 58 project records (codes, English and Persian titles, categories) | `data/projects.ts` | Records unchanged. Only types, Arabic category labels and two helpers were added |
| Slugs, generated from the English titles | `data/projects.ts` (`slugify`) | Unchanged. All 58 `/projects/<slug>` URLs still build and return 200 |
| Verified descriptions and facts (years, areas, floors, units, architects) | `data/projectContent.ts` | Unchanged (byte-identical) |
| Approved addresses and Google Maps links | `data/projectLocations.ts` | Unchanged (byte-identical) |
| Imported photography: cover, card, exterior and interior per project | `data/projectImages.generated.ts`, `public/projects/` | Unchanged. All 549 image references resolve |
| Image importer and its decisions | `scripts/` | Unchanged |
| Approved BAM logo | `public/brand/bam-logo.svg` | Unchanged. `components/BrandLogo.tsx` inlines the same path data so the mark can be ink or reversed |
| Fonts: Lato 400, IRANSansX 400/500 | `app/fonts/` | Unchanged. IRANSansX now also serves Arabic |
| Archive UI: Visual/Index views, category filter, project page with exterior slider, facts, interior gallery, Location button | `components/Project*.tsx`, `CategoryFilter`, `ViewSwitcher` | Reused. Only language handling was extended and links point to `/projects` |
| Research and import reports | `PROJECT_RESEARCH_REPORT.md`, `IMAGE_IMPORT_REPORT.md`, `BAM_Archive_Content_Update_Report_FA.md` | Unchanged |

Route change: the archive used to live at `/`, with `/projects` redirecting to it. The archive now lives at `/projects`, its original intended route, and `/` is the new corporate homepage. Project URLs (`/projects/<slug>`) are unchanged.

## 2. Content added from BAM's official website

The repository had no company description, contact details, news or before/after media. These were copied **verbatim** from bamgroup.ir on 25 November 2026. The text was extracted by script from the page HTML and the WordPress REST API, not retyped.

| Content | Source | Stored in |
|---|---|---|
| Company description, Persian and English (split into paragraphs at sentence boundaries only) | https://bamgroup.ir/گروه-بام/ · https://bamgroup.ir/en/bam-group/ | `data/company.ts` → `company.about` |
| Homepage and footer excerpt | Persian: the footer sentence on every official page. English: the start of the English homepage introduction, stopped with "…" before its broken punctuation | `company.excerpt` |
| Central office address, phones, email; sales office; working hours | https://bamgroup.ir/ارتباط-با-ما/ · https://bamgroup.ir/en/contact-us/ · site header | `data/company.ts` → `contact` |
| Daliri studio contact details | Official contact page | `data/architects.ts` → `farzad-daliri.studio` |
| Instagram link | Site header and footer | `contact.social` |
| Before/after feature: heading "نمایی از رشد یک پروژه", its Persian text, two images | Official Persian homepage | `data/company.ts` → `transformation`, `public/home/before-after/` |
| Three news articles: titles, bodies, dates (15 Feb 2023), categories, cover images | WordPress API `wp-json/wp/v2/posts` | `data/journal.ts`, `public/journal/` |

Deliberately **not** imported:

- "Call us toll free +1 789 2000" and the Facebook, Twitter and YouTube icons: these are WordPress theme placeholders (`#` links), not BAM data.
- The Persian footer number `02122683297-8`, which disagrees with the contact page (`021-22683298`, `021-22683385`). The contact-page numbers are used.
- The "Privacy Policy" link, which has no destination.

## 3. Discrepancies found in the official content (shown as published)

1. **English award years.** The English About text gives years about nine years off the Persian Solar Hijri years. For example, 1389 is rendered "2019" when it is about 2010–11. The English text is shown verbatim on `/about` and **needs correcting by BAM**.
2. **"8nd Floor"** in the English Daliri studio address is shown verbatim.
3. The English homepage introduction contains ". ," and "clustering". The homepage excerpt stops before them; the full text is not used.
4. Article "افتتاح 35 واحد مسکونی…" describes an event of Mehr 1397 but was published 15 February 2023. The published date is kept.

## 4. New content types and their data

| Type | File | Production content | Demo content |
|---|---|---|---|
| Architects | `data/architects.ts` | 4 records, all verified: Farzad Daliri (9 projects), Morteza Adib and Maryam Yousefi (Bamland), ERGA (architectural consultant, National Cancer Center). Each credit repeats a fact already in `projectContent.ts` | None |
| Project credits (architect ↔ project) | `data/architects.ts` → `projectCredits` | 12 credits, each with a recorded source | None |
| Events | `data/events.ts` → `publishedEvents` | **Empty**: no real event has been supplied | `data/demo/events.ts`, 4 sample events, development only |
| Journal | `data/journal.ts` | The 3 official BAM articles (Persian) | None |
| Homepage curation | `data/home.ts` | Hero slides, Selected Projects order, About image (all existing project photographs) | None |

## 5. Missing content (needed from BAM)

| Missing | Effect now | What to supply |
|---|---|---|
| Real events | Events section hidden on the homepage; `/events` shows "No events have been published yet." | Event records and media |
| Architect portraits and biographies | Cards show a photograph of the architect's own BAM project, captioned "Selected work" | Licensed portraits (3:4) and approved biographies |
| Approved Arabic translations of content | Arabic shows the Persian original, marked `lang="fa"`, with a note on project pages and About | Arabic titles, descriptions and company text, if wanted |
| Approved Arabic company name | Arabic uses "گروه توسعه مهندسی بام" | Approved Arabic name |
| English versions of the 3 articles | Shown in Persian with "Published in Persian" | Translations, if wanted |
| High-resolution before/after "before" image | It is 539 × 319 px (the official site's crop) and looks soft when the comparison is wide | The original file, ideally from the same shoot as `MB__7958` |
| Project name for the before/after feature | Not named, because the official site does not name it. The images resemble BAM Address Chalous, but this is unverified | Confirmation |
| Journal cover images | About 600 px wide. Cards never show them larger | Larger originals |
| Farhang display font | Not used: no licensed file in the repository | Licensed web font files, if wanted |
| Dedicated Arabic typeface | IRANSansX is used (it covers Arabic letters, harakat and digits) | A licensed Arabic web font, if wanted |
| Official English site content | `/en/news/` is empty on bamgroup.ir | n/a |
| The other official "About us" sub-pages (core values, companies, vision and mission, engineering, QHSE, 100 quality principles, awards) | Not imported. `/about` shows the main description only | Decide which to bring in; they can be imported verbatim the same way |

## 6. Refinement round (homepage and archives)

**Imported:** the official homepage section "فعالیت ها و پروژه های گروه بام" / "Activities & Projects of Bam Group". Its six titles and descriptions were copied by script, verbatim in Persian and English, from the same official homepage pages (https://bamgroup.ir/ and https://bamgroup.ir/en/). They are stored in `data/activities.ts`.

- Titles are kept exactly as published, e.g. "ساختمان های مسکونی" and "بیمارستان، مراکز بهداشتی و درمانی", without the zero-width non-joiner. The official English typos (". .", "is more It can be felt from any time") are also kept.
- **Arabic:** five generic titles have interface translations. "گنج پنهان" keeps its Persian name. No Arabic description exists, so Arabic shows the Persian original, marked `lang="fa"`. **Missing:** approved Arabic descriptions.
- **Photographs:** existing archive photos of verified BAM projects of each kind — BAM Sepid (residential), BAM Center Yeganeh (office/commercial), Nikan Clinic (health), BAM Equestrian Club (leisure). Mass housing and Hidden Treasure use original line drawings, because no archive project is a verified example of either. (Boostan Hashtgerd's BAM role is unconfirmed; see `PROJECT_RESEARCH_REPORT.md`.)
- **Links:** archive categories through `/projects?category=…`, or, for Hidden Treasure, the journal article the official site files under that category. The six activities are not merged with the archive categories.

**Removed from the homepage:** the before/after feature ("نمایی از رشد یک پروژه"). Its data (`transformation` in `data/company.ts`), images (`public/home/before-after/`) and component (`components/home/BeforeAfter.tsx`) are kept for reuse.

## 7. Journal, architects and global contact round

- **Missing — BAM LinkedIn URL.** bamgroup.ir publishes no LinkedIn link, so `contact.linkedin` in `data/company.ts` is `undefined`, and the LinkedIn icon in the floating toolbar stays hidden. Add the approved URL there; nothing else needs to change.
- **Floating toolbar destinations:** Instagram `https://www.instagram.com/bamgroupiran/` and phone `021-22683298` (central office), both from the official site.
- **Architect biographies:** none are verified. `bioShort` / `bioLong` exist on the architect model and are empty for everyone. The sample texts in `data/demo/architectBios.ts` (development only, labelled "Sample text", excluded from production bundles) fill the layout for review. In production, cards show name and project count, and profiles show no biography.
- **Architect portraits:** none have been supplied. `portrait` takes the architect's own photo later. The vector placeholder is shown until then. `representativeImage` (a project photo) is kept in the data but is no longer used as a portrait.
- **Architect contact:** only Farzad Daliri has verified details (studio phones and email, from the official contact page). His profile icons are built from those. Website, Instagram and LinkedIn fields exist and are empty for everyone.
