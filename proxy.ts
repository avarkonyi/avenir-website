import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["hu", "en", "de", "zh"];
const DEFAULT_LOCALE = "hu";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  if (pathname === "/") {
    return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
};
