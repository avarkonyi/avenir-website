import type { Metadata } from "next";
import { signIn } from "@/auth";
import { AvenirLogo } from "@/components/AvenirLogo";

export const metadata: Metadata = {
  title: "Bejelentkezés — Avenir Admin",
  robots: { index: false, follow: false },
};

// Sign-in page for the admin tool. Server Component with a server
// action that triggers the M365 OAuth flow. The middleware redirects
// already-logged-in visitors away to /admin, so this only renders for
// unauthenticated users.
//
// `searchParams.error` is populated by NextAuth when the signIn
// callback returns false (allowlist denial) or any other auth failure.
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#F1F5F9",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 10px 40px rgba(11,30,62,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Brand strip */}
        <div
          style={{
            background: "#0B1E3E",
            padding: "32px 32px 28px",
            color: "#fff",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: "#D1172E",
            }}
          />
          <AvenirLogo size={36} />
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginTop: 16,
              marginBottom: 4,
              letterSpacing: 0.3,
            }}
          >
            Avenir Admin
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            Belső felület — csak engedélyezett munkatársak számára
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "32px" }}>
          {error && (
            <div
              role="alert"
              style={{
                background: "rgba(209,23,46,0.06)",
                border: "1px solid rgba(209,23,46,0.25)",
                color: "#9F0E1F",
                padding: "12px 14px",
                borderRadius: 4,
                fontSize: 13,
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              <strong>Hozzáférés megtagadva.</strong> A megadott Microsoft
              fiók nem szerepel az engedélyezett admin-listán. Ha hibát
              jelez, kérjük értesítse a rendszergazdát.
            </div>
          )}

          <p
            style={{
              fontSize: 14,
              color: "#475569",
              marginTop: 0,
              marginBottom: 20,
              lineHeight: 1.55,
            }}
          >
            Jelentkezzen be Microsoft 365 vállalati fiókjával a vezérlőpult
            eléréséhez.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("microsoft-entra-id", { redirectTo: "/admin" });
            }}
          >
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#D1172E",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "14px 20px",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s ease",
              }}
            >
              Bejelentkezés Microsoft fiókkal
            </button>
          </form>

          <p
            style={{
              marginTop: 24,
              fontSize: 11,
              color: "#94A3B8",
              textAlign: "center",
            }}
          >
            Probléma esetén:{" "}
            <a
              href="mailto:info@afm.hu"
              style={{ color: "#0B1E3E", textDecoration: "none" }}
            >
              info@afm.hu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
