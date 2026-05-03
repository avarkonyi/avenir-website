"use client";

import { useState } from "react";

// Generic image upload control for admin forms (News, Services, …).
// Fully CONTROLLED — `value` is the canonical URL state, owned by the
// parent form. The component never holds its own URL; it only manages
// transient UI state (uploading flag + last error). This prevents
// state desync when the parent resets after submit / route change.
//
// Allowed: JPEG, PNG, WebP, max 5 MB. Client-side validation runs
// before the POST so obvious rejects don't burn a network round-trip;
// the server re-validates everything anyway.

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"] as const;
const ACCEPT_ATTR = ALLOWED_MIMES.join(",");
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_LABEL_MB = 5;

type UploadResponse =
  | { ok: true; url: string }
  | { ok: false; error: string };

type Props = {
  value: string | null;
  folder: "news" | "services" | "partners";
  onChange: (url: string | null) => void;
  label?: string;
};

export function ImageUpload({ value, folder, onChange, label }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset the input so the same file can be re-selected after a
    // failed upload (the browser otherwise suppresses the change event
    // for the same selection).
    e.currentTarget.value = "";
    if (!file) return;

    setError(null);

    if (
      !(ALLOWED_MIMES as readonly string[]).includes(file.type)
    ) {
      setError("Csak JPEG, PNG vagy WebP formátum engedélyezett.");
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

      const res = await fetch("/api/admin/upload-image", {
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

  const hasImage = value !== null && value.length > 0;
  const labelText = label ?? "Kép feltöltése";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {hasImage && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Vercel Blob URLs are external; using <Image /> would
              require remotePatterns config per blob store host.
              <img> with explicit max dimensions is fine here — admin
              preview only, never on the public-site critical path. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value as string}
            alt=""
            style={{
              width: 200,
              height: "auto",
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 4,
              background: "#F1F5F9",
              border: "1px solid #E2E8F0",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13,
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
          accept={ACCEPT_ATTR}
          onChange={handleFileChange}
          disabled={isUploading}
          aria-label={hasImage ? `${labelText} (csere)` : labelText}
        />
        <span style={{ color: isUploading ? "#0B1E3E" : "#94A3B8" }}>
          {isUploading
            ? "Feltöltés folyamatban…"
            : hasImage
              ? `Másik kép feltöltéséhez válassz fájlt (max. ${MAX_LABEL_MB} MB).`
              : `Maximum ${MAX_LABEL_MB} MB. JPEG, PNG vagy WebP.`}
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
