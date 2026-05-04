"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, siteSettings } from "@/lib/db";
import { SEO_DATA } from "@/lib/seo-data";

export type SiteSettingsPayload = {
  legalName: string;
  legalNameShort: string;
  alternateName: string;
  registrationId: string;
  taxId: string;
  vatId: string;
  addressStreet: string;
  addressPostalCode: string;
  addressLocality: string;
  addressCountry: string;
  addressShort: string;
  mapsUrl: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  officeHoursHu: string;
};

export type SiteSettingsResult =
  | { ok: true }
  | { ok: false; error: string };

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapsUrlFromAddress(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function defaultSettings(): SiteSettingsPayload {
  return {
    legalName: SEO_DATA.legalName,
    legalNameShort: SEO_DATA.legalNameShort,
    alternateName: SEO_DATA.alternateName,
    registrationId: SEO_DATA.registrationId,
    taxId: SEO_DATA.taxID,
    vatId: SEO_DATA.vatID,
    addressStreet: SEO_DATA.address.streetAddress,
    addressPostalCode: SEO_DATA.address.postalCode,
    addressLocality: SEO_DATA.address.addressLocality,
    addressCountry: SEO_DATA.address.addressCountry,
    addressShort: SEO_DATA.addressShort,
    mapsUrl: mapsUrlFromAddress(SEO_DATA.addressShort),
    phone: SEO_DATA.contact.phone,
    phoneDisplay: SEO_DATA.contact.phoneDisplay,
    email: SEO_DATA.contact.email,
    officeHoursHu: "",
  };
}

export async function loadSiteSettings(): Promise<SiteSettingsPayload> {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);

  if (!row) return defaultSettings();

  return {
    legalName: row.legalName,
    legalNameShort: row.legalNameShort,
    alternateName: row.alternateName,
    registrationId: row.registrationId,
    taxId: row.taxId,
    vatId: row.vatId,
    addressStreet: row.addressStreet,
    addressPostalCode: row.addressPostalCode,
    addressLocality: row.addressLocality,
    addressCountry: row.addressCountry,
    addressShort: row.addressShort,
    mapsUrl: row.mapsUrl,
    phone: row.phone,
    phoneDisplay: row.phoneDisplay,
    email: row.email,
    officeHoursHu: row.officeHoursHu ?? "",
  };
}

function requireText(value: string, label: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${label} kötelező.`);
  }
  return trimmed;
}

function normalizePhoneTel(phone: string): string {
  const compact = phone.replace(/[()\s-]/g, "");
  return compact.startsWith("+") ? `tel:${compact}` : `tel:+${compact}`;
}

function normalize(payload: SiteSettingsPayload) {
  const email = requireText(payload.email, "Az email cím");
  if (!EMAIL_RE.test(email)) {
    throw new Error("Érvénytelen email cím.");
  }

  const mapsUrl = requireText(payload.mapsUrl, "A Google Maps URL");
  let parsedMapsUrl: URL;
  try {
    parsedMapsUrl = new URL(mapsUrl);
  } catch {
    throw new Error("Érvénytelen Google Maps URL. Teljes https:// URL szükséges.");
  }
  if (parsedMapsUrl.protocol !== "https:") {
    throw new Error("A Google Maps URL-nek HTTPS protokollt kell használnia.");
  }

  const addressCountry = requireText(payload.addressCountry, "Az országkód")
    .toUpperCase();
  if (!/^[A-Z]{2}$/.test(addressCountry)) {
    throw new Error("Az országkód kétbetűs ISO kód legyen, pl. HU.");
  }

  const phone = requireText(payload.phone, "A telefonszám");

  return {
    legalName: requireText(payload.legalName, "A hivatalos cégnév"),
    legalNameShort: requireText(payload.legalNameShort, "A rövid cégnév"),
    alternateName: requireText(payload.alternateName, "Az alternatív cégnév"),
    registrationId: requireText(payload.registrationId, "A cégjegyzékszám"),
    taxId: requireText(payload.taxId, "Az adószám"),
    vatId: requireText(payload.vatId, "Az EU VAT azonosító"),
    addressStreet: requireText(payload.addressStreet, "A székhely utca/házszám"),
    addressPostalCode: requireText(payload.addressPostalCode, "Az irányítószám"),
    addressLocality: requireText(payload.addressLocality, "A település"),
    addressCountry,
    addressShort: requireText(payload.addressShort, "A rövid cím"),
    mapsUrl,
    phone,
    phoneDisplay: requireText(payload.phoneDisplay, "A megjelenített telefonszám"),
    phoneTel: normalizePhoneTel(phone),
    email,
    emailHref: `mailto:${email}`,
    officeHoursHu: payload.officeHoursHu.trim() || null,
  };
}

export async function updateSiteSettings(
  payload: SiteSettingsPayload,
): Promise<SiteSettingsResult> {
  await requireAdmin();

  let values: ReturnType<typeof normalize>;
  try {
    values = normalize(payload);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Érvénytelen beállítások.",
    };
  }

  try {
    await db
      .insert(siteSettings)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { ...values, updatedAt: new Date() },
      });
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (err) {
    console.error("updateSiteSettings error:", err);
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "A beállítások mentése sikertelen.",
    };
  }
}
