import { Toaster } from "sonner";
import { redirect } from "next/navigation";
import {
  isAdminUnauthorizedError,
  requireAdmin,
} from "@/lib/admin/require-admin";
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
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (isAdminUnauthorizedError(error)) {
      redirect("/admin/login");
    }
    throw error;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopbar user={{ name: admin.name, email: admin.email }} />
        <main style={{ flex: 1, padding: "32px" }}>{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
