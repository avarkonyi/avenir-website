"use client";

import { useState, useTransition } from "react";
import { archiveMessage } from "../../_actions";

// Confirm-on-click archive button. Two-stage: first click flips the
// label to "Biztos? Még kattints" + arms a 5-second timer to revert
// the armed state if no second click. Second click within the window
// invokes the server action.
//
// Iter 3B Commit 4 will replace this with a proper confirm modal +
// add an unarchive (immediate, no confirm) flow. For Commit 1 we
// preserve the existing UX so the rename is a behaviour-equivalent
// substitution.
//
// Server action `archiveMessage` redirects to /admin/messages, so
// after a successful invocation this component unmounts.
export function ArchiveButton({ messageId }: { messageId: number }) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!armed) {
      setArmed(true);
      // Auto-disarm after 5s
      setTimeout(() => setArmed(false), 5000);
      return;
    }
    startTransition(async () => {
      await archiveMessage(messageId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      style={{
        background: armed ? "#D1172E" : "transparent",
        color: armed ? "#fff" : "#D1172E",
        border: `1px solid ${armed ? "#D1172E" : "rgba(209,23,46,0.4)"}`,
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
      {pending
        ? "Archiválás folyamatban…"
        : armed
          ? "Biztos? Még kattints"
          : "Archiválás"}
    </button>
  );
}
