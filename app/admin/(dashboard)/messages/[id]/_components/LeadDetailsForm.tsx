"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateLeadDetails } from "../../_actions";
import { LEAD_STATUS_OPTIONS } from "@/lib/messages-lead";

type LeadFormState = {
  leadStatus: string;
  leadOwnerName: string;
  leadNextActionAt: string;
  leadNextActionNote: string;
  leadEstimatedValue: string;
  leadSiteType: string;
  leadProposalUrl: string;
  leadContractUrl: string;
  internalNotes: string;
};

export function LeadDetailsForm({
  messageId,
  initialValues,
}: {
  messageId: number;
  initialValues: LeadFormState;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(initialValues);

  function setField<K extends keyof LeadFormState>(
    key: K,
    value: LeadFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    startTransition(async () => {
      const result = await updateLeadDetails(messageId, form);
      if (result.ok) {
        toast.success("Lead adatok mentve.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <label style={{ display: "block" }}>
          <span style={labelStyle}>Lead statusz</span>
          <select
            value={form.leadStatus}
            onChange={(e) => setField("leadStatus", e.target.value)}
            disabled={pending}
            style={inputStyle()}
          >
            {LEAD_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "block" }}>
          <span style={labelStyle}>Felelos</span>
          <input
            type="text"
            value={form.leadOwnerName}
            onChange={(e) => setField("leadOwnerName", e.target.value)}
            disabled={pending}
            maxLength={120}
            placeholder="pl. Varkonyi Andras"
            style={inputStyle()}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={labelStyle}>Kovetkezo teendo ideje</span>
          <input
            type="datetime-local"
            value={form.leadNextActionAt}
            onChange={(e) => setField("leadNextActionAt", e.target.value)}
            disabled={pending}
            style={inputStyle()}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={labelStyle}>Becsult ertek (HUF)</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.leadEstimatedValue}
            onChange={(e) => setField("leadEstimatedValue", e.target.value)}
            disabled={pending}
            placeholder="pl. 2500000"
            style={inputStyle()}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={labelStyle}>Helyszintipus</span>
          <input
            type="text"
            value={form.leadSiteType}
            onChange={(e) => setField("leadSiteType", e.target.value)}
            disabled={pending}
            maxLength={80}
            placeholder="pl. logisztikai kozpont"
            style={inputStyle()}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={labelStyle}>Ajanlat link</span>
          <input
            type="url"
            value={form.leadProposalUrl}
            onChange={(e) => setField("leadProposalUrl", e.target.value)}
            disabled={pending}
            placeholder="https://..."
            style={inputStyle()}
          />
        </label>

        <label style={{ display: "block" }}>
          <span style={labelStyle}>Szerzodes link</span>
          <input
            type="url"
            value={form.leadContractUrl}
            onChange={(e) => setField("leadContractUrl", e.target.value)}
            disabled={pending}
            placeholder="https://..."
            style={inputStyle()}
          />
        </label>
      </div>

      <label style={{ display: "block" }}>
        <span style={labelStyle}>Kovetkezo teendo</span>
        <textarea
          value={form.leadNextActionNote}
          onChange={(e) => setField("leadNextActionNote", e.target.value)}
          disabled={pending}
          maxLength={2000}
          rows={3}
          placeholder="Mi a kovetkezo konkret lepes?"
          style={{
            ...inputStyle(),
            resize: "vertical",
            lineHeight: 1.55,
            fontFamily: "inherit",
          }}
        />
      </label>

      <label style={{ display: "block" }}>
        <span style={labelStyle}>Belso jegyzet</span>
        <textarea
          value={form.internalNotes}
          onChange={(e) => setField("internalNotes", e.target.value)}
          disabled={pending}
          maxLength={20_000}
          rows={5}
          placeholder="Belsos megjegyzesek, egyeztetesek, ajanlati hatter."
          style={{
            ...inputStyle(),
            resize: "vertical",
            lineHeight: 1.55,
            fontFamily: "inherit",
          }}
        />
      </label>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            background: "#0B1E3E",
            color: "#fff",
            border: "none",
            padding: "10px 22px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            cursor: pending ? "wait" : "pointer",
            opacity: pending ? 0.7 : 1,
            fontFamily: "inherit",
          }}
        >
          {pending ? "Mentes..." : "Lead adatok mentese"}
        </button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 6,
};

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #CBD5E1",
    borderRadius: 4,
    outline: "none",
    background: "#fff",
    color: "#0B1E3E",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
}
