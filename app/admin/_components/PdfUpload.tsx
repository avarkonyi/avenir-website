"use client";

import { useState } from "react";

// Generic PDF upload control for admin forms (Certifications, …).
// Sibling to ImageUpload — same controlled-prop contract, same error
// surface, but POSTs to /api/admin/upload-pdf and validates a single
// MIME (application/pdf) with a larger 10 MB cap.
//
// Fully CONTROLLED — `value` is the canonical URL state, owned by
// the parent form. The component never holds its own URL; it only
// manages transient UI state (uploading flag + last error).

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_LABEL_MB = 10;

type UploadResponse =
  | { ok: true; url: string }
  | { ok: false; error: string };

type Props = {
  value: string | null;
  folder: "certifications";
  onChange: (url: string | null) => void;
  label?: string;
};

export function PdfUpload({ value, folder, onChange, label }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset the input so the same file can be re-selected after a
    // failed upload (the browser otherwise suppresses the change
    // event for the same selection).
    e.currentTarget.value = "";
    if (!file) return;

    setError(null);

    if (file.type !== "application/pdf") {
      setError("Csak PDF formátum engedélyezett.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`A fájl mérete maximum ${MAX_LABEL_MB} MB lehet.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload-pdf", {
        method: "POST",
        body: formData,
      });

      let payload: UploadResponse;
      try {
        payload = (await res.json()) as UploadResponse;
      } catch {
        setError("A szerver válaszát nem sikerült feldolgozni.");
        return;
      }

      if (!res.ok || payload.ok !== true) {
        setError(
          payload.ok === false
            ? payload.error
            : `A feltöltés sikertelen (HTTP ${res.status}).`,
        );
        return;
      }

      onChange(payload.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hálózati hiba.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    setError(null);
    onChange(null);
  }

  const hasFile = value !== null && value.length > 0;
  const labelText = label ?? "PDF feltöltése";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {hasFile && (
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            padding: 12,
            border: "1px solid #E2E8F0",
            borderRadius: 4,
            background: "#F8FAFC",
          }}
        >
          <span
            aria-hidden
            style={{
              fontSize: 20,
              color: "#D1172E",
              fontWeight: 700,
              fontFamily: "var(--font-head)",
            }}
          >
            PDF
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
              flex: 1,
              minWidth: 0,
            }}
          >
            <a
              href={value as string}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#0B1E3E",
                fontWeight: 600,
                textDecoration: "underline",
                wordBreak: "break-all",
              }}
            >
              Megnyitás új ablakban
            </a>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              style={{
                background: "transparent",
                color: "#D1172E",
                border: "1px solid rgba(209,23,46,0.4)",
                padding: "5px 12px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                cursor: isUploading ? "wait" : "pointer",
                fontFamily: "inherit",
                alignSelf: "flex-start",
              }}
            >
              Eltávolítás
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px",
          border: "1px dashed #CBD5E1",
          borderRadius: 4,
          background: "#F8FAFC",
          color: "#475569",
          fontSize: 13,
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          aria-label={hasFile ? `${labelText} (csere)` : labelText}
        />
        <span style={{ color: isUploading ? "#0B1E3E" : "#94A3B8" }}>
          {isUploading
            ? "Feltöltés folyamatban…"
            : hasFile
              ? `Másik PDF feltöltéséhez válassz fájlt (max. ${MAX_LABEL_MB} MB).`
              : `Maximum ${MAX_LABEL_MB} MB. Csak PDF.`}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: "rgba(209,23,46,0.08)",
            border: "1px solid rgba(209,23,46,0.3)",
            borderRadius: 4,
            padding: "8px 12px",
            color: "#B91C1C",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
