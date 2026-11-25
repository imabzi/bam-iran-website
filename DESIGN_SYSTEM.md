# BAM Iran design system

How the redesigned site is styled. All tokens live at the top of `app/globals.css`. Component styles are in `app/styles/site.css` (header, footer, shared), `app/styles/home.css` (homepage and cards), `app/styles/pages.css` (inner pages) and `app/admin/admin.css` (admin prototype only).

## Colour

Brand palette (`--bam-*`), as approved:

| Token | Hex | Use |
|---|---|---|
| `--bam-orange` | `#EA5B16` | Accent rules, active indicators, hero progress, arrow icons. Never large fills |
| `--bam-gray` | `#575756` | Secondary text in light mode |
| `--bam-ink` | `#1D1D1B` | Text (light), background (dark), footer |
| `--bam-graphite` | `#3C3C3B` | Strong secondary text, dark borders |
| `--bam-plaster` | `#F2F2F1` | Alternate section background, text in dark mode |
| `--bam-white` | `#FFFFFF` | Page background (light) |
| `--bam-concrete` | `#DADAD9` | Lines and dividers (light) |
| `--bam-gold` | `#D1AD53` | Reserved. Not used in the UI |

Components never use a brand token directly; they use semantic tokens that the theme redefines:

| Semantic token | Light | Dark | Notes |
|---|---|---|---|
| `--bg` / `--bg-alt` | white / plaster | ink / `#232322` | |
| `--text` / `--text-2` / `--text-3` | ink / graphite / gray | plaster / `#d6d6d3` / `#a5a5a2` | `--text-3`: 7.2:1 light, 6.8:1 dark |
| `--line` / `--line-strong` | concrete / `#b5b5b3` | `#353534` / gray | |
| `--accent` | orange | orange | Graphics only on light (3.5:1) |
| `--accent-text` | `#b5430c` | `#f07a3e` | Orange that passes AA for small text: 5.6:1 / 6.1:1 |
| `--inverse-*` | ink section | `#262625` section with borders | Leading Architects band |
| `--surface-media` | `#e8e8e6` | `#2c2c2b` | Image frames before load |

The archive's original token names (`--paper`, `--ink`, `--ink-soft`, `--muted`, `--line`, `--copper`) remain as aliases, so the archive follows the theme without being rewritten. The previous copper accent now resolves to the BAM orange text token.

## Theme

- `light` | `dark`, stored in `localStorage["bam-theme"]` (`lib/preferences.ts`).
- First visit follows `prefers-color-scheme`.
- The inline boot script sets `<html data-theme>` before first paint, so there is no flash. `components/DocumentPreferences.tsx` keeps it in step afterwards.
- The theme switcher renders both icons, and CSS shows the right one from `data-theme`, so the icon is correct before hydration too.
- Photography is never filtered or dimmed for dark mode. Only the hero has a scrim, for text legibility.

## Typography

| Language | Font | Weights | Notes |
|---|---|---|---|
| English | Lato | 400 | All sizes use 400; hierarchy comes from size, case and colour |
| Persian | IRANSansX | 400, 500 | Headings and labels use 500 |
| Arabic | IRANSansX, then Noto Sans Arabic, Segoe UI, Tahoma | 400, 500 | IRANSansX was checked to contain Arabic letters (ة ي ك ى أ), harakat (U+064B–0652), Arabic-Indic digits, lam-alef ligatures, and GSUB/GPOS tables. A dedicated licensed Arabic face would still be an improvement |

Farhang is not used: no licensed file exists in the repository.

Fluid scale (`clamp()`):

| Token | Range | Used for |
|---|---|---|
| `--fs-display` | 30 → 76px | Hero title |
| `--fs-h1` | 30 → 64px | Page titles |
| `--fs-h2` | 26 → 56px | Section titles |
| `--fs-h3` | 18 → 26px | Card titles |
| `--fs-lead` | 17 → 22px | Lead paragraphs |
| `--fs-body` | 16 → 18px | Body |
| `--fs-meta` / `--fs-label` | 14 / 12px | Metadata / uppercase labels |

Script tokens (set on `:root[lang]`): `--tracking: 0` for Persian and Arabic (letter-spacing breaks joins); `--leading-add`, `--body-leading` (1.6 → 1.9 / 1.95); `--title-scale: .84` so long Persian titles fit; `--label-scale: 1.08`.

## Layout

- `--max: 1680px` content width; `--gutter: clamp(16px, 4vw, 72px)`; `--grid-gap: 16 → 24px`.
- Homepage compositions are 12-column ratios: hero full-bleed; Selected Projects and Events 7/5; About 5/7; before/after 4/8; Architects 3 × 4 columns.
- Above 1680px the content stays centred. Only the hero image is full-bleed, and 4K screens get more margin, not bigger components.
- Section spacing `--section-space: 56 → 144px`; inner pages use `--section-space-tight: 40 → 80px`.
- Header height: 80px desktop, 68px tablet, 64px phone.

Breakpoints: 1240px (navigation collapses into the menu), 1100px (three columns → two), 900px (splits stack, tablet header), 700px (single column, architects rail), 580px (phone header, archive's phone styles), 480px.

## Direction

Everything directional uses logical properties (`inset-inline-*`, `margin-inline-*`, `padding-inline-*`) and the `--flip` token (`1` LTR, `-1` RTL) for icons and movement. Special cases are handled explicitly: the before/after clip side, the hero progress origin, and the active underline origin.

## Components

| Component | File |
|---|---|
| Header (overlay or solid), mobile drawer, language and theme switchers | `components/Header.tsx`, `MobileNavigation.tsx`, `LanguageSwitcher.tsx`, `ThemeSwitcher.tsx` |
| Footer | `components/SiteFooter.tsx` |
| Logo | `components/BrandLogo.tsx` (inline SVG, `currentColor`) |
| Section heading, text link, page intro, demo badge | `components/ui.tsx` |
| Localised text with correct `lang`/`dir` on fallback | `components/Text.tsx` |
| Homepage sections | `components/home/*` |
| Cards | `ArchitectCard`, `EventCard`, `ArticleCard`, `HomeProjectCard` (in `home/FeaturedProjects.tsx`) |
| Inner pages | `components/architects/`, `events/`, `journal/`, `company/` |

## Motion

Hover 220–350ms; image zoom 700ms (`scale(1.03)`); hero crossfade 900ms with a slow settle; 7s autoplay that pauses on hover, keyboard focus and touch. Under `prefers-reduced-motion` there is no autoplay and all transitions and animations are cut to near zero.

## Accessibility

Visible 2px focus ring (`--focus`); skip link; one `h1` per page (visually hidden on the homepage); `aria-current` on navigation; the mobile drawer is a modal dialog with focus trap, Escape and focus return; the before/after handle is a `role="slider"` with arrow, Page and Home/End keys; text that falls back to another language carries its own `lang`/`dir`; tap targets are at least 44px on phones.
