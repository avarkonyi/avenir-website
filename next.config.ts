import type { NextConfig } from "next";

// Standard security headers applied to all routes. CSP is deferred:
// the JSON-LD inline <script> tags + future Vercel Analytics need careful
// policy crafting (script-src 'self' 'unsafe-inline' won't pass strict CSP),
// addressed in a separate post-deploy commit.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
