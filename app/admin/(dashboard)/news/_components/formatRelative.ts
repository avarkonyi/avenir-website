// Tiny relative-time formatter for the news list. HU labels because the
// admin tool is HU-only by design. Falls back to absolute date for
// timestamps older than a week — relative phrasing past that is fuzzy
// without adding noise. Pure function, safe in Server Components.
//
// Duplicated (intentionally) from app/admin/messages/_components — keeping
// the two modules independent until a shared admin _lib/ folder earns
// its keep (3+ consumers).

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
