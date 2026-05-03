"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePartner } from "../_actions";

// Permanent hard delete with a confirm modal. Mirrors
// DeletePositionButton — flat schema, no cascade branch needed.
//
// Distinct from isActive=false (toggleable, hides from any future
// public render but leaves the row in the DB). Delete is final.
//
// Pending behaviour: while the action is in-flight both modal
// buttons disable, ESC + backdrop click are no-ops. Modal stays
// open on server error so the operator can retry; closes only on
// successful delete (then router.refresh re-fetches the RSC tree
// to drop the row from the visible list).

export function DeletePartnerButton({
  partnerId,
  partnerName,
  pendingGlobal,
}: {
  partnerId: number;
  partnerName: string;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleClick() {
    if (disabled) return;
    setShowConfirm(true);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deletePartner(partnerId);
      if (result.ok) {
        toast.success("Partner véglegesen törölve.");
        setShowConfirm(false);
        router.refresh();
      } else {
        toast.error(result.error);
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
          partnerName={partnerName}
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
  partnerName,
  pending,
  onCancel,
  onConfirm,
}: {
  partnerName: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, pending]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-partner-confirm-title"
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
          id="delete-partner-confirm-title"
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0B1E3E",
          }}
        >
          Partner törlése
        </h2>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "#475569",
            lineHeight: 1.55,
          }}
        >
          Biztosan véglegesen törölni szeretné a(z){" "}
          <strong>„{partnerName}”</strong> partnert?{" "}
          <span style={{ color: "#B91C1C", fontWeight: 600 }}>
            Ez a művelet nem vonható vissza.
          </span>
        </p>

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
            {pending ? "Törlés folyamatban…" : "Törlés"}
          </button>
        </div>
      </div>
    </div>
  );
}
