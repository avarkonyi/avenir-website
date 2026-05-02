import Link from "next/link";

// Server component — no client state. Iter 4 C1 has no search input
// (unlike Services/News/Messages, which need client state for the
// controlled search input). When search lands in C2/C3 this can be
// promoted to a client component if needed; the visual style stays.

export type StatusFilter = "all" | "active" | "inactive";

type Props = {
  current: StatusFilter;
  counts: { all: number; active: number; inactive: number };
};

const PILLS: ReadonlyArray<{
  key: StatusFilter;
  label: string;
  href: string;
}> = [
  { key: "all", label: "Mind", href: "/admin/positions" },
  { key: "active", label: "Aktív", href: "/admin/positions?status=active" },
  {
    key: "inactive",
    label: "Inaktív",
    href: "/admin/positions?status=inactive",
  },
];

export function PositionsFilters({ current, counts }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#64748B",
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          marginRight: 4,
        }}
      >
        Státusz:
      </span>
      {PILLS.map((opt) => {
        const active = current === opt.key;
        return (
          <Link
            key={opt.key}
            href={opt.href}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              background: active ? "#0B1E3E" : "#fff",
              color: active ? "#fff" : "#0B1E3E",
              border: `1px solid ${active ? "#0B1E3E" : "#CBD5E1"}`,
            }}
          >
            {opt.label} ({counts[opt.key]})
          </Link>
        );
      })}
    </div>
  );
}
