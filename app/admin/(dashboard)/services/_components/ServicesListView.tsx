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
  reorderTopLevelServices,
  toggleServiceActive,
  togglePublishStatus,
} from "../_actions";
import { DeleteServiceButton } from "./DeleteServiceButton";

// Slim row shape passed from the server page. Only includes fields the
// list-view actually renders or acts on; full service rows include
// jsonb arrays and timestamps that don't survive the server→client
// boundary cleanly anyway. page.tsx maps the full $inferSelect rows
// down to this shape before passing them across.
export type ServicesListRow = {
  id: number;
  parentId: number | null;
  nameHu: string;
  slug: string;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  isChild: boolean;
  parentName: string | null;
  // Live count of rows whose parent_id equals this row's id (Iter 3E).
  // Drives the cascade-vs-simple branch in DeleteServiceButton's
  // confirm modal text. Populated server-side via a separate
  // grouped-count query in page.tsx.
  childrenCount: number;
};

type Props = {
  rows: ServicesListRow[];
  reorderEnabled: boolean;
  // IDs of active top-level services in current sortOrder, used as
  // SortableContext.items. Only meaningful when reorderEnabled.
  activeTopLevelIds: number[];
};

// Reorder display rows by orderedIds (only affects active top-level
// parents and the children grouped under them). Inactive top-levels,
// orphans, and any rows not present in orderedIds keep their original
// relative position at the end.
function applyOptimisticOrder(
  rows: ServicesListRow[],
  orderedIds: number[],
): ServicesListRow[] {
  const byId = new Map<number, ServicesListRow>();
  for (const row of rows) byId.set(row.id, row);

  const childrenByParent = new Map<number, ServicesListRow[]>();
  for (const row of rows) {
    if (row.isChild && row.parentId !== null) {
      const list = childrenByParent.get(row.parentId) ?? [];
      list.push(row);
      childrenByParent.set(row.parentId, list);
    }
  }

  const out: ServicesListRow[] = [];
  const consumed = new Set<number>();

  for (const id of orderedIds) {
    const parent = byId.get(id);
    if (!parent || consumed.has(parent.id)) continue;
    out.push(parent);
    consumed.add(parent.id);
    for (const child of childrenByParent.get(id) ?? []) {
      out.push(child);
      consumed.add(child.id);
    }
  }

  // Append anything we didn't consume, preserving original order.
  for (const row of rows) {
    if (!consumed.has(row.id)) {
      out.push(row);
      consumed.add(row.id);
    }
  }

  return out;
}

export function ServicesListView({
  rows,
  reorderEnabled,
  activeTopLevelIds: initialOrderedIds,
}: Props) {
  const router = useRouter();
  const [orderedIds, setOrderedIds] = useState<number[]>(initialOrderedIds);
  const [pending, startTransition] = useTransition();

  // Re-sync when the server prop changes (after revalidatePath /
  // router.refresh delivers fresh data). Avoids visual drift when
  // another tab persists a different order. The set-state-in-effect
  // disable matches the established pattern from the locale switcher
  // (Phase 2) — this IS a legitimate prop→state sync, not a cascading
  // render, but React 19's stricter lint flags every such pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedIds(initialOrderedIds);
  }, [initialOrderedIds]);

  const sensors = useSensors(
    // 5px activation distance prevents the sortable from hijacking
    // clicks on the drag handle (which could otherwise fight with
    // the row's other action buttons).
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
      const result = await reorderTopLevelServices(nextOrder);
      if (result.ok) {
        toast.success("Sorrend mentve.");
        // router.refresh() resyncs server state — picks up updatedAt
        // bumps and ensures any concurrent admin's changes land too.
        router.refresh();
      } else {
        toast.error(result.error);
        // Restore canonical state from the server.
        router.refresh();
      }
    });
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
            <Th>Név</Th>
            <Th>Slug</Th>
            <Th>Szülő</Th>
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
                const isDraggable =
                  reorderEnabled &&
                  !row.isChild &&
                  row.isActive &&
                  row.parentId === null;
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
// ref-like and complains about reading `transform`, `transition`,
// `isDragging`, etc. during render. Those are normal state values
// (numbers / booleans / objects), not React refs — but the lint can't
// tell the difference for third-party hooks. dnd-kit's official
// examples follow this exact pattern. Disabling only for this scoped
// component keeps the rule active everywhere else.
/* eslint-disable react-hooks/refs */
function SortableRow({
  row,
  showHandleColumn,
  pendingGlobal,
}: {
  row: ServicesListRow;
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
  row: ServicesListRow;
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
        // Empty cell keeps column alignment when reorder is enabled
        // but this particular row isn't draggable (child / inactive).
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
  row: ServicesListRow;
  pendingGlobal: boolean;
}) {
  return (
    <>
      <Td>
        <span
          style={{
            paddingLeft: row.isChild ? 24 : 0,
            fontWeight: row.isChild ? 400 : 700,
            color: "#0B1E3E",
          }}
        >
          {row.isChild && (
            <span aria-hidden style={{ color: "#94A3B8", marginRight: 6 }}>
              ↳
            </span>
          )}
          {row.nameHu}
        </span>
      </Td>
      <Td>
        <code
          style={{
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: 12,
            color: "#64748B",
            background: "#F1F5F9",
            padding: "2px 6px",
            borderRadius: 3,
          }}
        >
          {row.slug}
        </code>
      </Td>
      <Td>
        <span style={{ color: "#64748B", fontSize: 13 }}>
          {row.parentName ?? "—"}
        </span>
      </Td>
      <Td>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <PublishToggleBadge row={row} pendingGlobal={pendingGlobal} />
          {!row.isActive && <Badge color="#94A3B8" label="Inaktív" />}
          {row.isFeatured && <Badge color="#2563EB" label="Kiemelt" />}
        </div>
      </Td>
      <Td>
        <RowActions row={row} pendingGlobal={pendingGlobal} />
      </Td>
    </>
  );
}

// Clickable status pill — one-click flips Vázlat ⇄ Publikálva. The
// asymmetric parent-active+published rule (child publish requires
// active+published parent) is enforced server-side; this UI surfaces
// the resulting error via toast and leaves the row's badge unchanged.
function PublishToggleBadge({
  row,
  pendingGlobal,
}: {
  row: ServicesListRow;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleClick() {
    if (disabled) return;
    const next = !row.isPublished;
    startTransition(async () => {
      const result = await togglePublishStatus(row.id, next);
      if (result.ok) {
        toast.success(
          next ? "Szolgáltatás publikálva." : "Publikálás visszavonva.",
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

function RowActions({
  row,
  pendingGlobal,
}: {
  row: ServicesListRow;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleToggleActive() {
    if (disabled) return;
    const next = !row.isActive;
    startTransition(async () => {
      const result = await toggleServiceActive(row.id, next);
      if (result.ok) {
        toast.success(next ? "Aktiválva." : "Inaktiválva.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Link
        href={`/admin/services/${row.id}/edit`}
        style={{
          color: "#0B1E3E",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Szerkesztés
      </Link>
      <button
        type="button"
        onClick={handleToggleActive}
        disabled={disabled}
        style={{
          background: "transparent",
          color: row.isActive ? "#D1172E" : "#15803D",
          border: `1px solid ${row.isActive ? "rgba(209,23,46,0.4)" : "rgba(21,128,61,0.4)"}`,
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
        {row.isActive ? "Inaktiválás" : "Aktiválás"}
      </button>
      <DeleteServiceButton
        serviceId={row.id}
        serviceName={row.nameHu}
        childrenCount={row.childrenCount}
        pendingGlobal={disabled}
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

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        background: `${color}1A`,
        color,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
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
