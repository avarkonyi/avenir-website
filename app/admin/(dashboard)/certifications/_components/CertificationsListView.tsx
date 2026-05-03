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
  reorderCertifications,
  toggleCertificationActive,
  toggleCertificationPublished,
} from "../_actions";
import { DeleteCertificationButton } from "./DeleteCertificationButton";

// Slim row shape passed from the server page. Drops timestamps + the
// long localized text fields (description/scope) the list never
// renders. Keeps the server→client payload minimal.
export type CertificationsListRow = {
  id: number;
  name: string;
  slug: string;
  fullNameHu: string;
  issuer: string;
  expiresDate: string | null;
  hasPdf: boolean;
  isActive: boolean;
  isPublished: boolean;
};

type Props = {
  rows: CertificationsListRow[];
  totalCount: number;
  reorderEnabled: boolean;
  // IDs of active rows in current sort order — the SortableContext
  // items array. Only meaningful when reorderEnabled.
  activeOrderedIds: number[];
};

// Reorder display rows by orderedIds (only the active set; inactive
// rows keep their original relative position at the end).
function applyOptimisticOrder(
  rows: CertificationsListRow[],
  orderedIds: number[],
): CertificationsListRow[] {
  const byId = new Map<number, CertificationsListRow>();
  for (const row of rows) byId.set(row.id, row);

  const out: CertificationsListRow[] = [];
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

export function CertificationsListView({
  rows,
  totalCount,
  reorderEnabled,
  activeOrderedIds: initialOrderedIds,
}: Props) {
  const router = useRouter();
  const [orderedIds, setOrderedIds] = useState<number[]>(initialOrderedIds);
  const [pending, startTransition] = useTransition();

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
      const result = await reorderCertifications(nextOrder);
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
        ? "Még nincsenek tanúsítványok a rendszerben."
        : "Nincs a szűrésnek megfelelő tanúsítvány.";
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
        <p style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>📜</p>
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
            <Th>Kiállító</Th>
            <Th>Lejárat</Th>
            <Th>PDF</Th>
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
// ref-like and complains about reading transform/transition/
// isDragging during render. Same dnd-kit pattern as
// PartnersListView / PositionsListView; suppress just for this case.
/* eslint-disable react-hooks/refs */
function SortableRow({
  row,
  showHandleColumn,
  pendingGlobal,
}: {
  row: CertificationsListRow;
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
  row: CertificationsListRow;
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
  row: CertificationsListRow;
  pendingGlobal: boolean;
}) {
  return (
    <>
      <Td>
        <strong style={{ color: "#0B1E3E", fontWeight: 700 }}>
          {row.name}
        </strong>
        <div
          style={{
            marginTop: 2,
            color: "#64748B",
            fontSize: 12,
          }}
        >
          {row.fullNameHu}
        </div>
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
        <span style={{ color: "#475569" }}>{row.issuer}</span>
      </Td>
      <Td>
        {row.expiresDate ? (
          <span style={{ color: "#475569", fontSize: 13 }}>
            {row.expiresDate}
          </span>
        ) : (
          <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
        )}
      </Td>
      <Td>
        {row.hasPdf ? (
          <span
            style={{
              color: "#15803D",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 0.4,
            }}
          >
            ✓
          </span>
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
// publish guard (name + fullNameHu + descriptionHu + pdfUrl all
// required), surfacing the standard toast on missing prerequisites.
function PublishToggleBadge({
  row,
  pendingGlobal,
}: {
  row: CertificationsListRow;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleClick() {
    if (disabled) return;
    const next = !row.isPublished;
    startTransition(async () => {
      const result = await toggleCertificationPublished(row.id, next);
      if (result.ok) {
        toast.success(
          next ? "Tanúsítvány publikálva." : "Publikálás visszavonva.",
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
  row: CertificationsListRow;
  pendingGlobal: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const disabled = pending || pendingGlobal;

  function handleClick() {
    if (disabled) return;
    const next = !row.isActive;
    startTransition(async () => {
      const result = await toggleCertificationActive(row.id, next);
      if (result.ok) {
        toast.success(
          next ? "Tanúsítvány aktiválva." : "Tanúsítvány inaktiválva.",
        );
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
  row: CertificationsListRow;
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
        href={`/admin/certifications/${row.id}/edit`}
        style={{
          color: "#0B1E3E",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Szerkesztés
      </Link>
      <DeleteCertificationButton
        certificationId={row.id}
        certificationName={row.name}
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
