"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteService } from "../_actions";

// Permanent hard delete with a confirm modal. Distinct from the
// existing isActive=false inactivation (soft, reversible) — this
// removes the row from the DB.
//
// Modal text branches purely on childrenCount (NOT on parentId or
// "level"). With childrenCount > 0 the cascade warning explains
// the exact child count and uses VÉGLEGESEN copy. Cascade flag is
// set client-side to childrenCount > 0; server still re-checks
// against live DB state and rejects mismatches.
//
// Pending behaviour: while the action is in-flight both buttons in
// the modal disable, and ESC + backdrop click are no-ops. Modal
// stays open on server error so the operator can retry; it closes
// only after a successful delete (then router.refresh re-fetches
// the RSC tree to drop the deleted row from the visible list —
// revalidatePath alone wouldn't do it since the parent client view
// holds local DnD state).

export function DeleteServiceButton({
  serviceId,
  serviceName,
  childrenCount,
  pendingGlobal,
}: {
  serviceId: number;
  serviceName: string;
  childrenCount: number;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;
  const hasChildren = childrenCount > 0;

  function handleClick() {
    if (disabled) return;
    setShowConfirm(true);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteService(serviceId, { cascade: hasChildren });
      if (result.ok) {
        toast.success("Szolgáltatás véglegesen törölve.");
        setShowConfirm(false);
        router.refresh();
      } else {
        toast.error(result.error);
        // Modal stays open for retry.
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title="Végleges törlés"
        style={{
          background: "transparent",
          color: "#D1172E",
          border: "1px solid rgba(209,23,46,0.4)",
          padding: "5px 12px",
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          cursor: disabled ? "wait" : "pointer",
          fontFamily: "inherit",
          opacity: disabled ? 0.7 : 1,
        }}
      >
        Törlés
      </button>

      {showConfirm && (
        <DeleteConfirmDialog
          serviceName={serviceName}
          childrenCount={childrenCount}
          pending={pending}
          onCancel={() => {
            if (!pending) setShowConfirm(false);
          }}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

function DeleteConfirmDialog({
  serviceName,
  childrenCount,
  pending,
  onCancel,
  onConfirm,
}: {
  serviceName: string;
  childrenCount: number;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // ESC-to-close (no-op while pending). Click-outside-to-close is
  // handled by the backdrop's onClick.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, pending]);

  const hasChildren = childrenCount > 0;
  const title = hasChildren
    ? "Szolgáltatás és alszolgáltatások törlése"
    : "Szolgáltatás törlése";
  const confirmLabel = hasChildren ? "Mind törlése" : "Törlés";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-service-confirm-title"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,30,62,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 6,
          maxWidth: 520,
          width: "100%",
          padding: "24px 24px 20px",
          boxShadow: "0 24px 48px rgba(11,30,62,0.25)",
        }}
      >
        <h2
          id="delete-service-confirm-title"
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0B1E3E",
          }}
        >
          {title}
        </h2>

        {hasChildren ? (
          <>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.55,
              }}
            >
              A(z) <strong>„{serviceName}”</strong> szolgáltatásnak{" "}
              <strong>{childrenCount}</strong>{" "}
              alszolgáltatása van. A szülő és minden alszolgáltatása{" "}
              <strong>VÉGLEGESEN</strong> törlődik.
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14,
                color: "#B91C1C",
                lineHeight: 1.55,
                fontWeight: 600,
              }}
            >
              Ez a művelet nem vonható vissza.
            </p>
          </>
        ) : (
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 14,
              color: "#475569",
              lineHeight: 1.55,
            }}
          >
            Biztosan véglegesen törölni szeretné a(z){" "}
            <strong>„{serviceName}”</strong> szolgáltatást?{" "}
            <span style={{ color: "#B91C1C", fontWeight: 600 }}>
              Ez a művelet nem vonható vissza.
            </span>
          </p>
        )}

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            style={{
              background: "#fff",
              color: "#0B1E3E",
              border: "1px solid #CBD5E1",
              padding: "10px 18px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: pending ? "wait" : "pointer",
              fontFamily: "inherit",
            }}
          >
            Mégsem
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            style={{
              background: "#D1172E",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              cursor: pending ? "wait" : "pointer",
              fontFamily: "inherit",
              opacity: pending ? 0.7 : 1,
            }}
          >
            {pending ? "Törlés folyamatban…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
