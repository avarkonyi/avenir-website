import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
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
  const isLoggedIn = !!req.auth;

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

  if (pathname.startsWith("/admin")) return adminProxy(req, event);

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return withNoindexHeader(req, NextResponse.next());

  if (pathname === "/") {
    return withNoindexHeader(
      req,
      NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}`, req.url)),
    );
  }

  return withNoindexHeader(req, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
