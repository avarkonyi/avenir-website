"use client";

import { useState, useTransition } from "react";
import { deleteNews } from "../_actions";

// Two-stage confirm-on-click delete (mirrors the messages module).
// First click arms; second click within 5s invokes the server action;
// if the user doesn't follow up, we auto-disarm. The server action
// redirects to /admin/news on success, so this component unmounts.

export function DeleteButton({ newsId }: { newsId: number }) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 5000);
      return;
    }
    startTransition(async () => {
      try {
        await deleteNews(newsId);
      } catch (err) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          alert(err.message);
        }
      }
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
        ? "Törlés folyamatban…"
        : armed
          ? "Biztos? Még kattints"
          : "Törlés"}
    </button>
  );
}
