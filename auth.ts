import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// Hard-coded admin allowlist. Phase 2 Iteration 1: only 2 users
// (managing director + DPO). Future iterations may move this to a
// DB table once a user-management UI exists; for now, a code-side
// list is sufficient and audit-safe (every admin entry visible in
// git history).
//
// To grant a new admin: add the email here and redeploy.
// Emails are compared case-insensitively (lowercased on both sides).
const ALLOWED_ADMIN_EMAILS = [
  "varkonyi@afm.hu",
  "fanni.csegeny@afm.hu",
  "peter.vagi@afm.hu",
] as const;

function redactEmailForLog(email: string): string {
  const [local = "", domain = "unknown"] = email.toLowerCase().split("@");
  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 2);
  return `${visible}***@${domain}`;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // NextAuth v5 strict host-check. On Vercel this is auto-true via
  // VERCEL=1 env detection; for non-Vercel deploys (or local prod
  // builds) we have to opt in. Our deploy targets Vercel + custom
  // domain (staging.afm.hu, www.afm.hu), both behind trusted infra,
  // so trusting the Host header is safe.
  trustHost: true,
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
  callbacks: {
    // Gatekeeper. M365 OAuth proves the email is owned by the user;
    // this callback enforces the allowlist on top. A non-allowlisted
    // login completes with the IdP but is rejected here, redirecting
    // back to the signIn page with an error param.
    async signIn({ user }) {
      if (!user.email) return false;
      const allowed = ALLOWED_ADMIN_EMAILS.includes(
        user.email.toLowerCase() as (typeof ALLOWED_ADMIN_EMAILS)[number],
      );
      if (!allowed) {
        console.warn(
          `[auth] Denied admin sign-in: ${redactEmailForLog(user.email)} not in allowlist`,
        );
      }
      return allowed;
    },
    // Pass-through session shape. Iteration 2+ may attach role/scope
    // fields here based on the email or an external store.
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});
