import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { ALLOWED_ADMIN_EMAILS, auth } from "@/auth";
import { hasAllowedAdminSession } from "@/lib/admin/session-policy";
import { LOCALES as SUPPORTED_LOCALES } from "@/lib/locales";
import { lowercaseAsciiPath } from "@/lib/url-case";

const LOCALES: readonly string[] = SUPPORTED_LOCALES;
const DEFAULT_LOCALE = "hu";
const NOINDEX_HEADER = "noindex, nofollow";
const LEGACY_GONE_PATHS = ["/cgi-sys", "/mall", "/tw"] as const;

function adminPathWithoutLocale(pathname: string): string | null {
  const parts = pathname.split("/");
  const localeSegment = parts[1]?.toLowerCase();
  const routeSegment = parts[2]?.toLowerCase();

  if (!localeSegment || !LOCALES.includes(localeSegment)) return null;
  if (routeSegment !== "admin") return null;

  const adminParts = parts.slice(2);
  adminParts[0] = "admin";
  return `/${adminParts.join("/")}`;
}

function shouldNoindex(req: NextRequest): boolean {
  const host = req.headers.get("host")?.toLowerCase() ?? "";
  return (
    process.env.VERCEL_ENV !== "production" ||
    host === "staging.afm.hu" ||
    host.endsWith(".vercel.app")
  );
}

function withNoindexHeader(
  req: NextRequest,
  response: NextResponse,
): NextResponse {
  if (shouldNoindex(req)) {
    response.headers.set("X-Robots-Tag", NOINDEX_HEADER);
  }
  return response;
}

type AuthenticatedNextRequest = NextRequest & { auth?: unknown };

const adminProxy = auth(function adminProxy(
  req: AuthenticatedNextRequest,
  event: NextFetchEvent,
) {
  void event;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoggedIn = hasAllowedAdminSession(req.auth, ALLOWED_ADMIN_EMAILS);

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

  return withNoindexHeader(req, NextResponse.next());
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (
    LEGACY_GONE_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    const response = new NextResponse(null, { status: 410 });
    response.headers.set("X-Robots-Tag", NOINDEX_HEADER);
    return response;
  }

  if (pathname.startsWith("/admin")) return adminProxy(req, event);

  const adminPath = adminPathWithoutLocale(pathname);
  if (adminPath) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = adminPath;
    return withNoindexHeader(req, NextResponse.redirect(redirectUrl, 308));
  }

  // Public locale paths and CMS slugs are lowercase ASCII, so any uppercase
  // letter in a locale-prefixed path is a duplicate URL: 308 to the lowercase
  // path (query kept). Percent-escapes are left untouched.
  const localeSegment = pathname.split("/")[1];
  const normalizedLocale = localeSegment?.toLowerCase();
  const lowercasePath = lowercaseAsciiPath(pathname);
  if (
    localeSegment &&
    lowercasePath !== pathname &&
    LOCALES.includes(normalizedLocale)
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = lowercasePath;
    return withNoindexHeader(req, NextResponse.redirect(redirectUrl, 308));
  }

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return withNoindexHeader(req, NextResponse.next());

  if (pathname === "/") {
    // Keep the query string (UTM parameters, ?service= contact prefill).
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/${DEFAULT_LOCALE}`;
    return withNoindexHeader(req, NextResponse.redirect(redirectUrl, 308));
  }

  return withNoindexHeader(req, NextResponse.next());
}

export const config = {
  matcher: [
    "/cgi-sys/:path*",
    "/mall",
    "/mall/:path*",
    "/tw/:path*",
    "/((?!_next|api|.*\\..*).*)",
  ],
};
