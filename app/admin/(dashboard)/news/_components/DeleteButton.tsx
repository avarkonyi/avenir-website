"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteNews } from "../_actions";

// Two-stage confirm-on-click delete (mirrors the messages module).
// First click arms; second click within 5s invokes the server action.
// On success we toast + push the user to the list (the action no longer
// redirects — see _actions.ts for the rationale).

export function DeleteButton({ newsId }: { newsId: number }) {
  const router = useRouter();
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
        const result = await deleteNews(newsId);
        if (result.ok) {
          toast.success(result.message);
          router.push("/admin/news");
        } else {
          toast.error(result.error);
          setArmed(false);
        }
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Váratlan hiba történt. Próbáld újra.",
        );
        setArmed(false);
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
