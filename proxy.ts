import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

const LOCALES = ["hu", "en", "de", "zh"];
const DEFAULT_LOCALE = "hu";
const NOINDEX_HEADER = "noindex, nofollow";

function shouldNoindex(req: NextRequest): boolean {
  const host = req.headers.get("host")?.toLowerCase() ?? "";
  return (
    process.env.VERCEL_ENV !== "production" ||
    host === "staging.afm.hu" ||
    host.endsWith(".vercel.app")
  );
}

function withNoindexHeader(req: NextRequest, response: NextResponse): NextResponse {
  if (shouldNoindex(req)) {
    response.headers.set("X-Robots-Tag", NOINDEX_HEADER);
  }
  return response;
}

// Single project-root middleware. Two responsibilities:
//
//   1. Locale rewrite: `/` → `/{DEFAULT_LOCALE}`. Locale-prefixed
//      paths pass through unchanged.
//
//   2. Admin auth gate: requests under `/admin/*` (except `/admin/login`)
//      require an authenticated session. Unauth → redirect to login.
//      Already-logged-in users hitting `/admin/login` are redirected to
//      the dashboard.
//
// `auth()` from auth.ts wraps the function so `req.auth` is populated
// from the JWT cookie. `/api/auth/*` routes are excluded by the matcher
// so the NextAuth handlers themselves are never re-entered through here.
export default auth(async function proxy(req: NextRequest & { auth?: unknown }) {
  const { pathname } = req.nextUrl;

  // ── 1. Admin auth gate ────────────────────────────────────────────
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isLoggedIn = !!req.auth;

  if (isAdminRoute) {
    if (!isLoginPage && !isLoggedIn) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      return withNoindexHeader(req, NextResponse.redirect(loginUrl));
    }
    if (isLoginPage && isLoggedIn) {
      return withNoindexHeader(
        req,
        NextResponse.redirect(new URL("/admin", req.nextUrl.origin)),
      );
    }
    // Authenticated /admin/* request — let it through, no rewrite.
    return withNoindexHeader(req, NextResponse.next());
  }

  // ── 2. Locale rewrite (public routes only) ────────────────────────
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return withNoindexHeader(req, NextResponse.next());

  if (pathname === "/") {
    return withNoindexHeader(
      req,
      NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}`, req.url)),
    );
  }

  return withNoindexHeader(req, NextResponse.next());
});

// Matcher rules:
//   - Exclude /_next (Next.js internals), /api (the auth handler must
//     not loop back into this middleware), and any path with a dot
//     (static assets like .ico, .webp, .woff2, .css, .js).
//   - Include /admin/* explicitly (some matchers strip it via the
//     negative lookahead, but we want it covered for the auth gate).
export const config = {
  matcher: [
    "/((?!_next|api|.*\\..*).*)",
  ],
};
