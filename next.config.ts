import type { NextConfig } from "next";

// Vercel Live injects a preview-only feedback script on Preview deployments.
// Keep production CSP strict; only the preview environment gets this source.
const isVercelPreview = process.env.VERCEL_ENV === "preview";
const scriptSrc = [
  "script-src 'self' 'unsafe-inline'",
  isVercelPreview ? "https://vercel.live" : null,
]
  .filter(Boolean)
  .join(" ");
const connectSrc = [
  "connect-src 'self'",
  isVercelPreview ? "https://vercel.live" : null,
]
  .filter(Boolean)
  .join(" ");

// Hardened security headers per Codex audit 2026-04-30 (P1-A finding).
// Applied to every route via the headers() async function below.
const securityHeaders = [
  {
    // HSTS — staging mode: 'preload' INTENTIONALLY OMITTED until M365
    // subdomains (autodiscover, sip, lyncdiscover, enterpriseenrollment,
    // enterpriseregistration) are verified to serve HTTPS reliably. Once
    // confirmed, swap to: 'max-age=63072000; includeSubDomains; preload'
    // for the production deploy.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    // Hardened from SAMEORIGIN: the site has no legitimate framing use
    // case. Pairs with CSP frame-ancestors 'none' below for redundancy.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Tightened: payment + usb explicitly disallowed (B2B static site
    // has no use case). Browser feature-policy should fail-closed.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    // CSP — strict default-src 'self' baseline.
    //   'unsafe-inline' on script-src: required for the JSON-LD
    //     <script type="application/ld+json"> tags in components/JsonLd.tsx.
    //     Nonce-based mitigation deferred to a later commit.
    //   'unsafe-inline' on style-src: required for inline-style usage
    //     across components (Hero, Footer, Contact, etc.).
    //   img-src includes data: + blob: for next/image optimization output,
    //     plus *.public.blob.vercel-storage.com for admin-uploaded covers
    //     served from the Vercel Blob CDN (Iter 3D).
    //   font-src 'self': next/font/google self-hosts at build time, no
    //     external font CDN connection needed.
    //   frame-ancestors 'none': matches X-Frame-Options DENY above.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
      "font-src 'self'",
      connectSrc,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    // COOP — process isolation against cross-origin window.opener attacks.
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    // CORP — defends static assets from being embedded by other origins.
    // NOTE: Cross-Origin-Embedder-Policy: require-corp is NOT added —
    // it would break next/image and font loading. COOP+CORP without
    // COEP gives sufficient cross-origin isolation for a B2B site.
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
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
