// Demonstration content: the one place that decides where it appears.
//
// Sample events (data/demo/events.ts) and sample Journal articles
// (data/demo/journal.ts) let the layouts be reviewed before real content
// exists. Every sample record is labelled in the interface as sample content,
// is never indexed, and is kept apart from the verified data.
//
// PUBLIC_DESIGN_REVIEW is the switch for the public design-review phase:
//   true  — the sample events and Journal articles are shown on every build,
//           including the production website.
//   false — production builds show only real, published content. `next dev`
//           still shows the samples, so layouts can be reviewed locally.
// To remove all demonstration content from the live site, set it to false and
// deploy. Nothing else needs to change.
export const PUBLIC_DESIGN_REVIEW = true;

const development = process.env.NODE_ENV !== "production";
// A private preview can still opt in to every sample, including the sample
// architect biographies, with NEXT_PUBLIC_SHOW_DEMO_CONTENT=true.
const previewOverride = process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT === "true";

export const demoContent = {
  events: PUBLIC_DESIGN_REVIEW || development || previewOverride,
  journal: PUBLIC_DESIGN_REVIEW || development || previewOverride,
  // Not part of the public review: placeholder biographies stay local.
  architectBios: development || previewOverride,
} as const;

// The admin prototype is a design foundation with no backend, storage or
// authentication. A normal production build returns 404 for it. Set in
// next.config.ts and inlined as a constant.
export const adminPrototypeEnabled = process.env.BAM_ENABLE_ADMIN_PROTOTYPE === "true";
