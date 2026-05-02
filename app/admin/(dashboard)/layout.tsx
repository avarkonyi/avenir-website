import { Toaster } from "sonner";
import { auth } from "@/auth";
import { AdminSidebar } from "../_components/AdminSidebar";
import { AdminTopbar } from "../_components/AdminTopbar";

// Layout for authenticated admin pages. Wraps children with the
// sidebar + topbar shell. The (dashboard) route group is invisible
// in URLs — `app/admin/(dashboard)/page.tsx` renders at `/admin`.
//
// The middleware (proxy.ts) already gates /admin/* by auth, so by
// the time this layout runs the request is authenticated. We re-fetch
// session here to populate the topbar (name + email).
//
// The Sonner <Toaster /> mounts here (not in the root admin layout) so
// the login page stays clean. richColors maps success/error/warning to
// the brand-adjacent green/red Sonner palette out of the box.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopbar user={session?.user ?? undefined} />
        <main style={{ flex: 1, padding: "32px" }}>{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
