import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  date,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ────────────────────────────────────────────────────────────────────────────
// 1. NEWS — admin-managed articles. Locale-aware via wide columns (4 locales
//    × 3 content fields + 1 publish flag = 16 i18n columns). Slug is
//    locale-independent: /hu/hirek/SLUG, /en/news/SLUG, /de/news/SLUG and
//    /zh/news/SLUG all open the same article with locale-specific content.
//
//    Indexes:
//      - 4 partial indexes (one per locale) on `published_*` filtered to
//        `= true` — supports the per-locale "show only published" query
//        common to all public-facing news lists.
//      - `idx_news_date_desc` for feed-style ORDER BY date DESC.
// ────────────────────────────────────────────────────────────────────────────
export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),

    titleHu: text("title_hu").notNull(),
    titleEn: text("title_en").notNull(),
    titleDe: text("title_de").notNull(),
    titleZh: text("title_zh").notNull(),

    leadHu: text("lead_hu").notNull(),
    leadEn: text("lead_en").notNull(),
    leadDe: text("lead_de").notNull(),
    leadZh: text("lead_zh").notNull(),

    bodyHu: text("body_hu").notNull(),
    bodyEn: text("body_en").notNull(),
    bodyDe: text("body_de").notNull(),
    bodyZh: text("body_zh").notNull(),

    publishedHu: boolean("published_hu").notNull().default(false),
    publishedEn: boolean("published_en").notNull().default(false),
    publishedDe: boolean("published_de").notNull().default(false),
    publishedZh: boolean("published_zh").notNull().default(false),

    date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
    imageUrl: text("image_url"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_news_published_hu")
      .on(table.publishedHu)
      .where(sql`${table.publishedHu} = true`),
    index("idx_news_published_en")
      .on(table.publishedEn)
      .where(sql`${table.publishedEn} = true`),
    index("idx_news_published_de")
      .on(table.publishedDe)
      .where(sql`${table.publishedDe} = true`),
    index("idx_news_published_zh")
      .on(table.publishedZh)
      .where(sql`${table.publishedZh} = true`),
    index("idx_news_date_desc").on(sql`${table.date} DESC`),
  ],
);

// ────────────────────────────────────────────────────────────────────────────
// 2. POSITIONS — career listings. Wide-column-per-locale pattern (matching
//    news, client_references, certifications): title_<lang>, location_<lang>,
//    type_<lang>. Resolves audit P0-3 (positions appeared HU-only on EN/DE/ZH
//    pages). Locale-independent fields (apply_email, active, sort_order) stay
//    as scalar columns.
//
//    Migration history:
//      0000_initial_schema — original HU-only columns (title, location, type)
//      0003_localize_positions — rename + add _en/_de/_zh (this commit)
//
//    Index: `idx_positions_active_sort` — partial composite covering the
//    public Career list query (active rows only, ordered by sort_order).
// ────────────────────────────────────────────────────────────────────────────
export const positions = pgTable(
  "positions",
  {
    id: serial("id").primaryKey(),

    titleHu: text("title_hu").notNull(),
    titleEn: text("title_en").notNull(),
    titleDe: text("title_de").notNull(),
    titleZh: text("title_zh").notNull(),

    locationHu: text("location_hu").notNull(),
    locationEn: text("location_en").notNull(),
    locationDe: text("location_de").notNull(),
    locationZh: text("location_zh").notNull(),

    typeHu: text("type_hu").notNull(),
    typeEn: text("type_en").notNull(),
    typeDe: text("type_de").notNull(),
    typeZh: text("type_zh").notNull(),

    applyEmail: text("apply_email").notNull().default("info@afm.hu"),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_positions_active_sort")
      .on(table.active, table.sortOrder)
      .where(sql`${table.active} = true`),
  ],
);

// ────────────────────────────────────────────────────────────────────────────
// 3. MESSAGES — contact form submissions. DB is primary storage; the Resend
//    notification (wired in a later prompt) is best-effort. The `service`
//    column stores a service id string (not FK) since services live in
//    translations, not in DB. `readAt` is nullable: NULL = unread, datetime
//    = the moment admin marked the message as read.
//
//    Index: `idx_messages_unread` — partial covering the admin "show me
//    unread, newest first" inbox view.
// ────────────────────────────────────────────────────────────────────────────
export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    company: text("company"),
    email: text("email").notNull(),
    phone: text("phone"),
    service: varchar("service", { length: 50 }),
    message: text("message"),
    locale: varchar("locale", { length: 5 }).notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_messages_unread")
      .on(sql`${table.createdAt} DESC`)
      .where(sql`${table.readAt} IS NULL`),
  ],
);

// ────────────────────────────────────────────────────────────────────────────
// 4. CLIENT REFERENCES — initially seeded with the 4 industry categories
//    currently in t.refs. Later admin can add named partner entries with
//    logos under each category. SQL table is `client_references` to avoid
//    the SQL reserved word `references`. All slugs are ASCII-only,
//    transliterated from the HU label, lowercase, hyphen-separated.
//
//    Index: `idx_references_active_sort` — partial composite for the
//    public-facing References section (active rows only, by sort_order).
// ────────────────────────────────────────────────────────────────────────────
export const clientReferences = pgTable(
  "client_references",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    labelHu: text("label_hu").notNull(),
    labelEn: text("label_en").notNull(),
    labelDe: text("label_de").notNull(),
    labelZh: text("label_zh").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
  },
  (table) => [
    index("idx_references_active_sort")
      .on(table.active, table.sortOrder)
      .where(sql`${table.active} = true`),
  ],
);

// ────────────────────────────────────────────────────────────────────────────
// 5. CERTIFICATIONS — official accreditations (ISO 9001, ISO 27001, etc.).
//    Schema is rich on purpose: every field maps to either a Schema.org
//    EducationalOccupationalCredential property, a microdata itemProp on the
//    component, or a B2B credibility signal (issuer + accreditation chain).
//    Certificate dates are stored as `date` (calendar, no time/TZ); a cert
//    is "valid on day X" rather than "valid at moment X".
//
//    Wide-column-per-locale pattern matches news: full_name_<lang>,
//    description_<lang>, scope_<lang>. The locale-independent fields
//    (cert number, dates, accreditation) appear once.
//
//    Indexes:
//      - `idx_certifications_active_sort` — partial composite for the
//        public-facing Certifications section query.
// ────────────────────────────────────────────────────────────────────────────
export const certifications = pgTable(
  "certifications",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),

    // Locale-independent labels and identifiers
    name: varchar("name", { length: 100 }).notNull(),
    standardCode: varchar("standard_code", { length: 100 }),
    certificateNumber: varchar("certificate_number", { length: 100 }),

    // Localized full names, descriptions, scope
    fullNameHu: text("full_name_hu").notNull(),
    fullNameEn: text("full_name_en").notNull(),
    fullNameDe: text("full_name_de").notNull(),
    fullNameZh: text("full_name_zh").notNull(),

    descriptionHu: text("description_hu"),
    descriptionEn: text("description_en"),
    descriptionDe: text("description_de"),
    descriptionZh: text("description_zh"),

    scopeHu: text("scope_hu"),
    scopeEn: text("scope_en"),
    scopeDe: text("scope_de"),
    scopeZh: text("scope_zh"),

    // Issuer and accreditation chain
    issuer: text("issuer").notNull(),
    issuerUrl: text("issuer_url"),
    accreditationBody: varchar("accreditation_body", { length: 50 }),
    accreditationNumber: varchar("accreditation_number", { length: 50 }),
    iafMlaMember: boolean("iaf_mla_member").notNull().default(false),
    verifyUrl: text("verify_url"),

    // Validity window (calendar dates, no time/TZ)
    issuedDate: date("issued_date"),
    expiresDate: date("expires_date"),

    // Schema.org credentialCategory mapping
    credentialCategory: text("credential_category"),

    // Asset URLs (nullable — admin uploads later)
    logoUrl: text("logo_url"),
    pdfUrl: text("pdf_url"),

    // Listing controls
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_certifications_active_sort")
      .on(table.active, table.sortOrder)
      .where(sql`${table.active} = true`),
  ],
);
