// Generic PDF upload endpoint for admin forms (Certifications, future
// modules). Mirrors upload-image's structure: UUID filename, MIME-
// derived extension, public Vercel Blob URL on success. PDFs need
// different validation (single MIME, larger max size) so they live in
// a dedicated route rather than overloading upload-image.
//
// Auth: middleware (proxy.ts) gates /api/admin/* by session, but route
// handlers are also reachable via direct POST, so we check the session
// inline as defense in depth and respond with 401 JSON instead of a
// redirect (which a fetch() caller cannot follow).
//
// Folder whitelist: only accepts known subtrees ("certifications").
// Adding a new module to the whitelist is a one-line change.

import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ALLOWED_FOLDERS = new Set(["certifications"]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Nincs jogosultság." },
      { status: 401 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Hibás kérés." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const folderRaw = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Nincs feltöltendő fájl." },
      { status: 400 },
    );
  }

  const folder = typeof folderRaw === "string" ? folderRaw : "";
  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json(
      { ok: false, error: "Érvénytelen mappa." },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { ok: false, error: "Üres fájl." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "A fájl mérete maximum 10 MB lehet." },
      { status: 413 },
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { ok: false, error: "Csak PDF fájl tölthető fel." },
      { status: 415 },
    );
  }

  // Filename is derived entirely from validated MIME — never from the
  // user-supplied file.name. Prevents double-extension attacks
  // (foo.pdf.exe), inconsistent extensions, and Unicode shenanigans.
  const pathname = `${folder}/${crypto.randomUUID()}.pdf`;

  try {
    const blob = await put(pathname, file, { access: "public" });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    // Most likely failure mode: missing BLOB_READ_WRITE_TOKEN env or a
    // Blob store not provisioned in the Vercel project. Surface a
    // generic operator-facing message; the underlying error is logged
    // server-side for debugging.
    console.error("[upload-pdf] Vercel Blob put() failed:", err);
    return NextResponse.json(
      { ok: false, error: "Vercel Blob konfigurációs hiba." },
      { status: 500 },
    );
  }
}
