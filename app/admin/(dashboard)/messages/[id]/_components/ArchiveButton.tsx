"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { archiveMessage, unarchiveMessage } from "../../_actions";

// Toggle button on the detail page. Two modes based on the row's
// current archived state:
//   - Not archived → button reads "Archiválás" → opens confirm modal
//   - Archived     → button reads "Visszaállítás" → fires immediately
// Asymmetry mirrors the news publish pattern (c1399eb): the action
// that hides things from the default view gets a guard; the recovery
// action that brings them back is one click.

export function ArchiveButton({
  messageId,
  isArchived,
}: {
  messageId: number;
  isArchived: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleClick() {
    if (pending) return;
    if (isArchived) {
      runUnarchive();
    } else {
      setConfirmOpen(true);
    }
  }

  function runArchive() {
    startTransition(async () => {
      const result = await archiveMessage(messageId);
      if (result.ok) {
        toast.success("Üzenet archiválva.");
        setConfirmOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
        // Modal stays open so the admin can retry without reopening.
      }
    });
  }

  function runUnarchive() {
    startTransition(async () => {
      const result = await unarchiveMessage(messageId);
      if (result.ok) {
        toast.success("Üzenet visszaállítva.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const label = isArchived
    ? pending
      ? "Visszaállítás folyamatban…"
      : "Visszaállítás"
    : pending
      ? "Archiválás folyamatban…"
      : "Archiválás";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        style={{
          background: "transparent",
          color: "#D1172E",
          border: "1px solid rgba(209,23,46,0.4)",
          padding: "10px 18px",
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          cursor: pending ? "wait" : "pointer",
          fontFamily: "inherit",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
      >
        {label}
      </button>

      {confirmOpen && (
        <ArchiveConfirmDialog
          pending={pending}
          onCancel={() => {
            if (!pending) setConfirmOpen(false);
          }}
          onConfirm={runArchive}
        />
      )}
    </>
  );
}

function ArchiveConfirmDialog({
  pending,
  onCancel,
  onConfirm,
}: {
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // ESC-to-close. Click-outside is handled by the backdrop's onClick.
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
      aria-labelledby="archive-confirm-title"
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
          maxWidth: 460,
          width: "100%",
          padding: "24px 24px 20px",
          boxShadow: "0 24px 48px rgba(11,30,62,0.25)",
        }}
      >
        <h2
          id="archive-confirm-title"
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0B1E3E",
          }}
        >
          Üzenet archiválása
        </h2>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "#475569",
            lineHeight: 1.55,
          }}
        >
          Biztosan archiválja az üzenetet? Az archivált üzenetek a
          „Mind” listában nem jelennek meg, de az „Archivált” szűrővel
          bármikor visszanézhetők.
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
            {pending ? "Archiválás…" : "Archiválás"}
          </button>
        </div>
      </div>
    </div>
  );
}
