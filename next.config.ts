import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Build-time switch, inlined as a constant so a production build drops the
  // admin prototype entirely. Demonstration content is configured in lib/demo.ts.
  env: {
    // The year of the build, for "years since founding" (data/statistics.ts).
    BAM_BUILD_YEAR: String(new Date().getFullYear()),
    BAM_ENABLE_ADMIN_PROTOTYPE: String(!production || process.env.NEXT_PUBLIC_ENABLE_ADMIN_PROTOTYPE === "true"),
  },
};

export default nextConfig;
