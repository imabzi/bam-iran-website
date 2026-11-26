# CMS integration notes

The repository has **no backend, database, storage or authentication**. Content lives in TypeScript files under `data/` and is compiled into a static site. This phase adds data structures ready for a CMS and a clearly isolated admin **UI prototype**. It adds no CMS.

## What exists now

| Piece | Where | Status |
|---|---|---|
| Typed content models | `data/projects.ts`, `data/architects.ts`, `data/events.ts`, `data/journal.ts`, `data/company.ts` | Production |
| Normalised relationships | `projectCredits` (architect ↔ project, with role and source); `BamEvent.projectCodes` / `architectIds` / `speakers[].architectId`; `Article.relatedProjectCodes` | Production |
| Publication states | `BamEvent.publication` and `Article.status`: `draft`, `scheduled` (+ `publishAt`), `published`, `archived` | Modelled; only `published` (and due `scheduled` events) render |
| Event timing | `eventTiming()` computes upcoming, ongoing or past from `startsAt`/`endsAt` in the visitor's browser, separately from publication state | Production |
| Demo content separation | `data/demo/events.ts`, `data/demo/journal.ts`, `data/demo/architectBios.ts`, gated by `demoContent` in `lib/demo.ts` | Sample events and Journal articles public while `PUBLIC_DESIGN_REVIEW` is on; architect bios development only |
| Admin UI prototype | `/admin` (`app/admin/`, `components/admin/AdminPrototype.tsx`) | Development only; `noindex`; disallowed in `robots.txt`; returns 404 in a normal production build |

The prototype has three screens: Event Manager, Architect Manager (with project credits and roles) and Media Library (local preview, ordering, alt text, cover choice). Each form shows the record it would produce, using the same field names as the TypeScript types. **Nothing is saved or uploaded, and there is no login.** It must not be exposed as an editing tool.

Flags (set only for private previews):

- `NEXT_PUBLIC_SHOW_DEMO_CONTENT=true`: include every sample, including architect biographies, in a production build. (The public design-review switch is `PUBLIC_DESIGN_REVIEW` in `lib/demo.ts`.)
- `NEXT_PUBLIC_ENABLE_ADMIN_PROTOTYPE=true`: serve `/admin` in a production build. Even then it saves nothing.

## What production CMS functionality still needs

1. **A content store.** Either a headless CMS (Sanity, Strapi, Payload, Directus or similar) or a database with an API. The models in `data/*.ts` map one-to-one to collections: `projects`, `architects`, `projectCredits`, `events`, `articles`, `media`.
2. **Authentication and roles.** A real identity provider with roles such as Editor (draft and edit), Publisher (publish and unpublish) and Admin. The admin must sit behind it, server-side, never as a client-side check.
3. **Media storage.** Object storage plus image processing: original upload, generated sizes, focal point (this maps to the `position` values already in `data/home.ts` and `data/architects.ts`), and per-language alt text. Video should link to a streaming host rather than being uploaded raw.
4. **Publishing workflow.** Draft → preview → publish/unpublish → scheduled publish. Scheduled items need a job or webhook that triggers a rebuild or revalidation at `publishAt`. Preview needs Next.js Draft Mode with authenticated preview URLs.
5. **Rebuild or revalidation.** The site is statically generated. A publish should trigger `revalidatePath` / `revalidateTag` (or a redeploy) for the affected routes: `/`, the listing page and the item's page.
6. **Validation that preserves verified data.**
   - Project facts and Google Maps links stay read-only, or change only through a reviewed workflow. The current rules in `README.md` and `PROJECT_RESEARCH_REPORT.md` (no unverified facts, approved map links used exactly as supplied) must carry over.
   - An architect credit requires a `source`.
   - A registration button appears only when `registrationUrl` is a real, working URL.
   - Demo records can never be published (`demo: true` blocks publishing).
7. **Localisation.** Fields stay per-language (`fa`, `en`, `ar`). The Arabic fallback rule (show the verified Persian original, marked `lang="fa"`) lives in `resolveText()` in `lib/i18n.ts` and should stay in the frontend.
8. **Audit trail.** Who changed what and when, especially for project facts and published content.

## Suggested migration path

1. Choose the CMS and model the collections from the existing types.
2. Write a one-off import script from `data/*.ts` into the CMS. The project images and `scripts/` importer can remain the source of truth for photography until media management moves over.
3. Swap the `data/*.ts` exports for fetch functions returning the same types. Components need no changes.
4. Replace `/admin` with the CMS's own editing interface (preferred), or rebuild it against the authenticated API.
