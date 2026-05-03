"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  reorderPartners,
  togglePartnerActive,
  togglePartnerPublished,
} from "../_actions";
import { DeletePartnerButton } from "./DeletePartnerButton";

// Slim row shape passed from the server page. Drops timestamps to
// avoid Date serialization quirks across the boundary.
export type PartnersListRow = {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  isPublished: boolean;
};

type Props = {
  rows: PartnersListRow[];
  totalCount: number;
  reorderEnabled: boolean;
  // IDs of active rows in current sort order — the SortableContext
  // items array. Only meaningful when reorderEnabled.
  activeOrderedIds: number[];
};

// Reorder display rows by orderedIds (only the active set; inactive
// rows keep their original relative position at the end).
function applyOptimisticOrder(
  rows: PartnersListRow[],
  orderedIds: number[],
): PartnersListRow[] {
  const byId = new Map<number, PartnersListRow>();
  for (const row of rows) byId.set(row.id, row);

  const out: PartnersListRow[] = [];
  const consumed = new Set<number>();
  for (const id of orderedIds) {
    const row = byId.get(id);
    if (!row || consumed.has(row.id)) continue;
    out.push(row);
    consumed.add(row.id);
  }
  for (const row of rows) {
    if (!consumed.has(row.id)) {
      out.push(row);
      consumed.add(row.id);
    }
  }
  return out;
}

export function PartnersListView({
  rows,
  totalCount,
  reorderEnabled,
  activeOrderedIds: initialOrderedIds,
}: Props) {
  const router = useRouter();
  const [orderedIds, setOrderedIds] = useState<number[]>(initialOrderedIds);
  const [pending, startTransition] = useTransition();

  // Re-sync when the server prop changes (after revalidatePath /
  // router.refresh delivers fresh data). Same legitimate prop→state
  // sync as PositionsListView; React 19's strict lint flags any
  // setState-in-effect, so we suppress just for this case.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedIds(initialOrderedIds);
  }, [initialOrderedIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const displayRows = reorderEnabled
    ? applyOptimisticOrder(rows, orderedIds)
    : rows;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(Number(active.id));
    const newIndex = orderedIds.indexOf(Number(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const nextOrder = arrayMove(orderedIds, oldIndex, newIndex);
    setOrderedIds(nextOrder);

    startTransition(async () => {
      const result = await reorderPartners(nextOrder);
      if (result.ok) {
        toast.success("Sorrend mentve.");
        router.refresh();
      } else {
        toast.error(result.error);
        router.refresh();
      }
    });
  }

  if (displayRows.length === 0) {
    const message =
      totalCount === 0
        ? "Még nincsenek partnerek a rendszerben."
        : "Nincs a szűrésnek megfelelő partner.";
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>🤝</p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#0B1E3E",
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          {message}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#F8FAFC" }}>
          <tr>
            {reorderEnabled && <Th>{""}</Th>}
            <Th>Logo</Th>
            <Th>Név</Th>
            <Th>Weboldal</Th>
            <Th>Státusz</Th>
            <Th>Akciók</Th>
          </tr>
        </thead>
        <tbody>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedIds}
              strategy={verticalListSortingStrategy}
            >
              {displayRows.map((row) => {
                const isDraggable = reorderEnabled && row.isActive;
                if (isDraggable) {
                  return (
                    <SortableRow
                      key={row.id}
                      row={row}
                      showHandleColumn={reorderEnabled}
                      pendingGlobal={pending}
                    />
                  );
                }
                return (
                  <PlainRow
                    key={row.id}
                    row={row}
                    showHandleColumn={reorderEnabled}
                    pendingGlobal={pending}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </tbody>
      </table>
    </div>
  );
}

// ── row components ─────────────────────────────────────────────────────

// React 19's `react-hooks/refs` rule treats useSortable's return as
// ref-like and complains about reading transform / transition /
// isDragging during render. Those are plain state values, not refs
// — but the lint can't tell for third-party hooks. dnd-kit's
// official examples use this exact pattern. Same suppression as
// PositionsListView / ServicesListView.
/* eslint-disable react-hooks/refs */
function SortableRow({
  row,
  showHandleColumn,
  pendingGlobal,
}: {
  row: PartnersListRow;
  showHandleColumn: boolean;
  pendingGlobal: boolean;
}) {
  const sortable = useSortable({ id: row.id });
  const style: React.CSSProperties = {
    borderTop: "1px solid #E2E8F0",
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.4 : row.isActive ? 1 : 0.55,
    background: sortable.isDragging ? "#F1F5F9" : "#fff",
  };

  return (
    <tr ref={sortable.setNodeRef} style={style} {...sortable.attributes}>
      {showHandleColumn && (
        <Td>
          <button
            type="button"
            {...sortable.listeners}
            aria-label="Sorrend áthelyezése"
            title="Húzd át a sorrend módosításához"
            style={dragHandleStyle(sortable.isDragging)}
          >
            ⋮⋮
          </button>
        </Td>
      )}
      <RowCells row={row} pendingGlobal={pendingGlobal} />
    </tr>
  );
}
/* eslint-enable react-hooks/refs */

function PlainRow({
  row,
  showHandleColumn,
  pendingGlobal,
}: {
  row: PartnersListRow;
  showHandleColumn: boolean;
  pendingGlobal: boolean;
}) {
  return (
    <tr
      style={{
        borderTop: "1px solid #E2E8F0",
        opacity: row.isActive ? 1 : 0.55,
      }}
    >
      {showHandleColumn && (
        <Td>
          <span aria-hidden style={{ color: "#E2E8F0" }}>
            ·
          </span>
        </Td>
      )}
      <RowCells row={row} pendingGlobal={pendingGlobal} />
    </tr>
  );
}

function RowCells({
  row,
  pendingGlobal,
}: {
  row: PartnersListRow;
  pendingGlobal: boolean;
}) {
  return (
    <>
      <Td>
        {row.logoUrl ? (
          // Vercel Blob URL — admin preview only, <img> with bounded
          // dimensions is fine here. Same convention as ImageUpload.
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={row.logoUrl}
            alt=""
            style={{
              width: 56,
              height: 32,
              objectFit: "contain",
              background: "#F1F5F9",
              borderRadius: 3,
              border: "1px solid #E2E8F0",
            }}
          />
        ) : (
          <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
        )}
      </Td>
      <Td>
        <strong style={{ color: "#0B1E3E", fontWeight: 700 }}>
          {row.name}
        </strong>
        <div
          style={{
            marginTop: 2,
            color: "#94A3B8",
            fontSize: 11,
            fontFamily: "var(--font-geist-mono, monospace)",
          }}
        >
          {row.slug}
        </div>
      </Td>
      <Td>
        {row.websiteUrl ? (
          <a
            href={row.websiteUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#0B1E3E",
              textDecoration: "underline",
              fontSize: 13,
              wordBreak: "break-all",
            }}
          >
            {row.websiteUrl.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
        )}
      </Td>
      <Td>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <PublishToggleBadge row={row} pendingGlobal={pendingGlobal} />
          <ActiveToggleBadge row={row} pendingGlobal={pendingGlobal} />
        </div>
      </Td>
      <Td>
        <RowActions row={row} pendingGlobal={pendingGlobal} />
      </Td>
    </>
  );
}

// Inline pill — flips Vázlat ⇄ Publikálva. Server re-applies the
// publish guard (logo + name required), surfacing
// "Publikáláshoz logo és név kötelező." on missing prerequisites.
function PublishToggleBadge({
  row,
  pendingGlobal,
}: {
  row: PartnersListRow;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleClick() {
    if (disabled) return;
    const next = !row.isPublished;
    startTransition(async () => {
      const result = await togglePartnerPublished(row.id, next);
      if (result.ok) {
        toast.success(
          next ? "Partner publikálva." : "Publikálás visszavonva.",
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const color = row.isPublished ? "#15803D" : "#A16207";
  const label = row.isPublished ? "Publikálva" : "Vázlat";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title="Kattintás a publikálás állapotának váltásához"
      style={{
        background: `${color}1A`,
        color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        whiteSpace: "nowrap",
        border: `1px solid ${color}33`,
        cursor: disabled ? "wait" : "pointer",
        fontFamily: "inherit",
        opacity: disabled ? 0.7 : 1,
        transition: "background 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}

function ActiveToggleBadge({
  row,
  pendingGlobal,
}: {
  row: PartnersListRow;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleClick() {
    if (disabled) return;
    const next = !row.isActive;
    startTransition(async () => {
      const result = await togglePartnerActive(row.id, next);
      if (result.ok) {
        toast.success(next ? "Partner aktiválva." : "Partner inaktiválva.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const color = row.isActive ? "#1E40AF" : "#94A3B8";
  const label = row.isActive ? "Aktív" : "Inaktív";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title="Kattintás az aktív állapot váltásához"
      style={{
        background: `${color}1A`,
        color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        whiteSpace: "nowrap",
        border: `1px solid ${color}33`,
        cursor: disabled ? "wait" : "pointer",
        fontFamily: "inherit",
        opacity: disabled ? 0.7 : 1,
        transition: "background 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}

function RowActions({
  row,
  pendingGlobal,
}: {
  row: PartnersListRow;
  pendingGlobal: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Link
        href={`/admin/partners/${row.id}/edit`}
        style={{
          color: "#0B1E3E",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Szerkesztés
      </Link>
      <DeletePartnerButton
        partnerId={row.id}
        partnerName={row.name}
        pendingGlobal={pendingGlobal}
      />
    </div>
  );
}

// ── presentational helpers ────────────────────────────────────────────

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        fontSize: 11,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        fontWeight: 700,
        color: "#475569",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: "12px 12px", fontSize: 13, verticalAlign: "middle" }}>
      {children}
    </td>
  );
}

function dragHandleStyle(isDragging: boolean): React.CSSProperties {
  return {
    background: "transparent",
    border: "none",
    color: isDragging ? "#0B1E3E" : "#94A3B8",
    cursor: isDragging ? "grabbing" : "grab",
    padding: "4px 8px",
    fontSize: 18,
    lineHeight: 1,
    fontFamily: "inherit",
    fontWeight: 700,
    minWidth: 24,
    minHeight: 24,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none",
    transition: "color 0.15s ease",
  };
}
