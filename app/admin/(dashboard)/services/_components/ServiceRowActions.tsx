"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleServiceActive } from "../_actions";

// Per-row action cell on the services table. Two controls:
//   - Szerkesztés link → /admin/services/[id]/edit (Commit 3 builds it;
//     until then this 404s, which is acceptable per the spec).
//   - Aktiválás / Inaktiválás button — fires toggleServiceActive,
//     surfaces server-side cascade-rule errors via toast (e.g. "Aktív
//     al-szolgáltatások (3 db) miatt nem inaktiválható.").
//
// Toggle is one-click (no confirm) — reversible operation, low risk.
// router.refresh on success so the row's opacity + button label
// update in place without a full nav.

export function ServiceRowActions({
  serviceId,
  isActive,
}: {
  serviceId: number;
  isActive: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    if (pending) return;
    startTransition(async () => {
      const result = await toggleServiceActive(serviceId, !isActive);
      if (result.ok) {
        toast.success(isActive ? "Inaktiválva." : "Aktiválva.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Link
        href={`/admin/services/${serviceId}/edit`}
        style={{
          color: "#0B1E3E",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Szerkesztés
      </Link>
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        style={{
          background: "transparent",
          color: isActive ? "#D1172E" : "#15803D",
          border: `1px solid ${isActive ? "rgba(209,23,46,0.4)" : "rgba(21,128,61,0.4)"}`,
          padding: "5px 12px",
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          cursor: pending ? "wait" : "pointer",
          fontFamily: "inherit",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending
          ? isActive
            ? "Inaktiválás…"
            : "Aktiválás…"
          : isActive
            ? "Inaktiválás"
            : "Aktiválás"}
      </button>
    </div>
  );
}
