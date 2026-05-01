import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avenir Admin",
  robots: { index: false, follow: false },
};

// Root layout for the entire /admin/* tree. Provides the <html><body>
// shell only — no sidebar/topbar chrome here. Authenticated dashboard
// pages live in the (dashboard) route group which adds the chrome via
// its own layout. The /admin/login page is OUTSIDE the (dashboard)
// group so it inherits only this minimal shell.
//
// Why a separate shell instead of root: /admin sits outside [locale],
// so the public-site fonts (Geist + Barlow) and JSON-LD are not
// applied here. System fonts are fine for the admin tool.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#F1F5F9",
        }}
      >
        {children}
      </body>
    </html>
  );
}
