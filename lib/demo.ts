// Build-time switches, set in next.config.ts and inlined as constants.
//
// Demonstration content (sample events) helps review layouts before real
// content exists. It is included in `next dev`, and in a production build only
// when NEXT_PUBLIC_SHOW_DEMO_CONTENT=true is set explicitly for a private
// preview. A normal production build does not even bundle it.
export const showDemoContent = process.env.BAM_SHOW_DEMO_CONTENT === "true";

// The admin prototype is a design foundation with no backend, storage or
// authentication. A normal production build returns 404 for it.
export const adminPrototypeEnabled = process.env.BAM_ENABLE_ADMIN_PROTOTYPE === "true";
