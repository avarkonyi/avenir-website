// Tiny relative-time formatter for the inbox table. HU labels because
// the admin tool is HU-only by design. Falls back to absolute date for
// timestamps older than a week — relative phrasing past that is fuzzy
// without adding noise. Pure function, safe in Server Components.

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeHu(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < MINUTE) return "épp most";
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return `${m} perce`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `${h} órája`;
  }
  if (diff < 7 * DAY) {
    const d = Math.floor(diff / DAY);
    return `${d} napja`;
  }
  // Older: absolute
  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatAbsoluteHu(date: Date): string {
  return date.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a Date as "2026.05.02. 09:14" — no spaces around the dots,
 * zero-padded hour. Used on the message detail view's metadata card
 * for the Beérkezés timestamp.
 *
 * Exists separately from formatAbsoluteHu because Intl.DateTimeFormat
 * for hu-HU emits "2026. 05. 02. 9:14" (interior spaces, hour without
 * leading zero), which doesn't match the admin tool's chosen visual
 * style. Manual zero-padding gives a stable column-aligned look across
 * the metadata grid.
 */
export function formatTimestampHu(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}. ${hh}:${min}`;
}
