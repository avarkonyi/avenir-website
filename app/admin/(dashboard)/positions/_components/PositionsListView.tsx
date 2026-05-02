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
import { reorderPositions, togglePositionActive } from "../_actions";
import { DeletePositionButton } from "./DeletePositionButton";

// Slim row shape passed from the server page. Drops timestamps and
// the per-locale fields the list never displays — keeps the
// server→client payload minimal and avoids Date serialization
// quirks across the boundary.
export type PositionsListRow = {
  id: number;
  titleHu: string;
  locationHu: string;
  typeHu: string;
  active: boolean;
};

type Props = {
  rows: PositionsListRow[];
  totalCount: number;
  reorderEnabled: boolean;
  // IDs of active rows in current sort order — the SortableContext
  // items array. Only meaningful when reorderEnabled.
  activeOrderedIds: number[];
};

// Reorder display rows by orderedIds (only the active set; inactive
// rows keep their original relative position at the end).
function applyOptimisticOrder(
  rows: PositionsListRow[],
  orderedIds: number[],
): PositionsListRow[] {
  const byId = new Map<number, PositionsListRow>();
  for (const row of rows) byId.set(row.id, row);

  const out: PositionsListRow[] = [];
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

export function PositionsListView({
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
  // sync as ServicesListView; React 19's strict lint flags any
  // setState-in-effect, so we suppress just for this case.
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
      const result = await reorderPositions(nextOrder);
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
        ? "Még nincsenek pozíciók a rendszerben."
        : "Nincs a szűrésnek megfelelő pozíció.";
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
        <p style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>💼</p>
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
            <Th>Név</Th>
            <Th>Helyszín</Th>
            <Th>Típus</Th>
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
                const isDraggable = reorderEnabled && row.active;
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
// — but the lint can't tell for third-party hooks. dnd-kit's official
// examples use this exact pattern. Same suppression as ServicesListView.
/* eslint-disable react-hooks/refs */
function SortableRow({
  row,
  showHandleColumn,
  pendingGlobal,
}: {
  row: PositionsListRow;
  showHandleColumn: boolean;
  pendingGlobal: boolean;
}) {
  const sortable = useSortable({ id: row.id });
  const style: React.CSSProperties = {
    borderTop: "1px solid #E2E8F0",
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.4 : row.active ? 1 : 0.55,
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
  row: PositionsListRow;
  showHandleColumn: boolean;
  pendingGlobal: boolean;
}) {
  return (
    <tr
      style={{
        borderTop: "1px solid #E2E8F0",
        opacity: row.active ? 1 : 0.55,
      }}
    >
      {showHandleColumn && (
        // Empty cell keeps column alignment when reorder is enabled
        // but this particular row isn't draggable (inactive).
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
  row: PositionsListRow;
  pendingGlobal: boolean;
}) {
  return (
    <>
      <Td>
        <strong style={{ color: "#0B1E3E", fontWeight: 700 }}>
          {row.titleHu}
        </strong>
      </Td>
      <Td>
        <span style={{ color: "#475569" }}>{row.locationHu}</span>
      </Td>
      <Td>
        <span style={{ color: "#475569" }}>{row.typeHu}</span>
      </Td>
      <Td>
        <ActiveToggleBadge row={row} pendingGlobal={pendingGlobal} />
      </Td>
      <Td>
        <RowActions row={row} pendingGlobal={pendingGlobal} />
      </Td>
    </>
  );
}

// Clickable status pill — one-click flips Aktív ⇄ Inaktív.
// Mirrors Services' PublishToggleBadge: server-truth display (no
// optimistic flip), router.refresh on success so the row leaves /
// enters any active filter view automatically.
function ActiveToggleBadge({
  row,
  pendingGlobal,
}: {
  row: PositionsListRow;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleClick() {
    if (disabled) return;
    const next = !row.active;
    startTransition(async () => {
      const result = await togglePositionActive(row.id, next);
      if (result.ok) {
        toast.success(next ? "Pozíció aktiválva." : "Pozíció inaktiválva.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const color = row.active ? "#15803D" : "#94A3B8";
  const label = row.active ? "Aktív" : "Inaktív";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title="Kattintás az állapot váltásához"
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
  row: PositionsListRow;
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
        href={`/admin/positions/${row.id}/edit`}
        style={{
          color: "#0B1E3E",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Szerkesztés
      </Link>
      <DeletePositionButton
        positionId={row.id}
        positionName={row.titleHu}
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
