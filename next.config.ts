import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Build-time switches, inlined as constants so a production build drops the
  // demo module and the admin prototype entirely. See lib/demo.ts.
  env: {
    BAM_SHOW_DEMO_CONTENT: String(!production || process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT === "true"),
    BAM_ENABLE_ADMIN_PROTOTYPE: String(!production || process.env.NEXT_PUBLIC_ENABLE_ADMIN_PROTOTYPE === "true"),
  },
};

export default nextConfig;
