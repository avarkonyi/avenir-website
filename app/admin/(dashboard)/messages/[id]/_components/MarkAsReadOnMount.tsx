"use client";

import { useEffect } from "react";
import { markAsRead } from "../../_actions";

// Fire-and-forget client effect that auto-marks an unread message as
// read when its detail view mounts. The server action enforces auth
// (requireAdmin) and is idempotent at the DB level (UPDATE … WHERE
// read_at IS NULL), so re-firing after navigating back to a now-read
// message is a no-op.
//
// We deliberately do NOT call router.refresh() after the action
// settles. Refreshing would re-render the detail page and flip the
// status badge from "Új" → "Olvasva" mid-view, which is a visual
// flicker for no informational gain. The decremented sidebar badge +
// updated list-row status are visible the next time the user
// navigates away from this page; that's the intentional UX.
//
// `void` discards the returned promise; `.catch(() => {})` swallows
// rejections so Node 22's strict unhandled-rejection handling never
// trips on this background call.
export function MarkAsReadOnMount({
  messageId,
  isUnread,
}: {
  messageId: number;
  isUnread: boolean;
}) {
  useEffect(() => {
    if (!isUnread) return;
    void markAsRead(messageId).catch(() => {
      // Silent by design — see header comment.
    });
  }, [messageId, isUnread]);

  return null;
}
