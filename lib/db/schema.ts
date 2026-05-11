import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  date,
  check,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ────────────────────────────────────────────────────────────────────────────
// 1. NEWS — admin-managed articles. Locale-aware via wide columns (4 locales
//    × 3 content fields + 1 publish flag = 16 i18n columns). Slug is
//    locale-independent: /hu/hirek/SLUG, /en/news/SLUG, /de/news/SLUG and
//    /zh/news/SLUG all open the same article with locale-specific content.
//
//    Locale optionality (Iter 3A): only HU title/lead/body remain NOT NULL.
//    EN/DE/ZH variants are nullable so the admin form can save partial
//    translations (HU article, EN copy pending, etc.) without forcing
//    placeholder text into the DB. The public renderer falls back to HU
//    when a locale-specific column is null.
//
//    Soft delete: `deleted_at` (Iter 3A) — set on admin "Törlés", filters
//    out of the inbox views; row stays in the table for recovery.
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
    titleEn: text("title_en"),
    titleDe: text("title_de"),
    titleZh: text("title_zh"),

    leadHu: text("lead_hu").notNull(),
    leadEn: text("lead_en"),
    leadDe: text("lead_de"),
    leadZh: text("lead_zh"),

    bodyHu: text("body_hu").notNull(),
    bodyEn: text("body_en"),
    bodyDe: text("body_de"),
    bodyZh: text("body_zh"),

    publishedHu: boolean("published_hu").notNull().default(false),
    publishedEn: boolean("published_en").notNull().default(false),
    publishedDe: boolean("published_de").notNull().default(false),
    publishedZh: boolean("published_zh").notNull().default(false),

    date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
    imageUrl: text("image_url"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
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
//    notification is best-effort. The `service` column stores a service id
//    string (not FK) since services live in translations, not in DB.
//
//    State is DERIVED from timestamp presence (Iter 3B; A2 — no enum):
//      archived_at IS NOT NULL  → 'archived'  (highest precedence)
//      replied_at  IS NOT NULL  → 'replied'
//      read_at     IS NOT NULL  → 'read'
//      else                     → 'new'
//
//    Columns:
//      - `read_at`     — NULL = unread; set on first detail-view mount
//                        via the auto-mark-as-read client component.
//      - `archived_at` — NULL = active; renamed from `deleted_at` in 0006.
//                        Iter 2's "soft delete" was always semantically
//                        an archive (recoverable, never destructive); the
//                        rename brings the schema name in line with intent.
//      - `replied_at`, `reply_subject`, `reply_body` — populated by the
//                        admin reply action (Iter 3B). The reply body and
//                        subject are stored verbatim for audit trail; the
//                        actual email delivery is via Resend SDK and is
//                        not transactional with this DB write.
//
//    Indexes:
//      - `idx_messages_unread` — partial: unread + active, newest first.
//      - `idx_messages_inbox`  — partial: all active, newest first
//        (admin /messages list query — added 2026-05).
//      Both filter `archived_at IS NULL` so archived rows don't appear
//      in the default inbox views.
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
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    repliedAt: timestamp("replied_at", { withTimezone: true }),
    replySubject: text("reply_subject"),
    replyBody: text("reply_body"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_messages_unread")
      .on(sql`${table.createdAt} DESC`)
      .where(sql`${table.readAt} IS NULL AND ${table.archivedAt} IS NULL`),
    index("idx_messages_inbox")
      .on(sql`${table.createdAt} DESC`)
      .where(sql`${table.archivedAt} IS NULL`),
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

    // Listing controls. `active` is the soft-hide flag; `is_published`
    // is the explicit public eligibility flag. Public certification
    // renderers filter on both. Existing rows defaulted to false when
    // the column was added and must be promoted in admin before publish.
    active: boolean("active").notNull().default(true),
    isPublished: boolean("is_published").notNull().default(false),
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

// ────────────────────────────────────────────────────────────────────────────
// 6. SERVICES — admin-managed service catalog with 2-level hierarchy.
//    Self-referencing: parent_id NULL = top-level service ("Soft FM"),
//    parent_id NOT NULL = sub-service ("Office cleaning" under Soft FM).
//    The 2-level cap is enforced at the application layer (server action
//    validates the chosen parent has parent_id IS NULL); the DB itself
//    allows arbitrary nesting since self-references can't be depth-limited
//    in CHECK constraints.
//
//    Source-of-truth: this table backs every public-site service render
//    (Services.tsx grid, Footer quick-links, Contact dropdown, JSON-LD
//    ItemList) via lib/db/queries/services.ts. The legacy `t.services`
//    array in lib/i18n/* survives only as input data for
//    scripts/seed-services.ts; it is no longer read at runtime.
//
//    Soft-delete cascade: `is_active = false` is the soft-delete flag.
//    DB onDelete: "restrict" only blocks hard DELETE; the cascade rule
//    (parent with active children cannot be inactivated) is enforced in
//    the inactivateService server action (Commit 4 of this iteration).
//
//    Locale model: HU required (notNull); EN/DE/ZH nullable. The public
//    renderer is expected to fall back to HU when a locale variant is
//    null — same convention as news.
//
//    JSONB highlights arrays: NOT NULL with default '[]'::jsonb so the
//    TS type stays `string[]` (no nullish guards in queries). Up to 6
//    items per locale enforced in the server action validation, not in
//    the DB.
//
//    Indexes:
//      - slug UNIQUE auto-generates a B-tree index — no explicit
//        idx_services_slug.
//      - idx_services_parent_id covers admin "fetch children of parent X"
//        queries.
//      - idx_services_public is a partial composite covering the public
//        site's most frequent query: WHERE is_published AND is_active,
//        ordered by sort_order ascending. Filtered to the active+
//        published subset for a smaller, more cache-friendly index.
// ────────────────────────────────────────────────────────────────────────────
export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),

    // Self-reference. The explicit `AnyPgColumn` return type breaks
    // TS's circular inference on `services.id` — without it the
    // compiler can either hang or emit unrelated cryptic errors.
    parentId: integer("parent_id").references(
      (): AnyPgColumn => services.id,
      { onDelete: "restrict" },
    ),

    slug: text("slug").notNull().unique(),
    icon: text("icon"),
    imageUrl: text("image_url"),

    nameHu: text("name_hu").notNull(),
    nameEn: text("name_en"),
    nameDe: text("name_de"),
    nameZh: text("name_zh"),

    shortDescHu: text("short_desc_hu"),
    shortDescEn: text("short_desc_en"),
    shortDescDe: text("short_desc_de"),
    shortDescZh: text("short_desc_zh"),

    longDescHu: text("long_desc_hu"),
    longDescEn: text("long_desc_en"),
    longDescDe: text("long_desc_de"),
    longDescZh: text("long_desc_zh"),

    highlightsHu: jsonb("highlights_hu").$type<string[]>().notNull().default([]),
    highlightsEn: jsonb("highlights_en").$type<string[]>().notNull().default([]),
    highlightsDe: jsonb("highlights_de").$type<string[]>().notNull().default([]),
    highlightsZh: jsonb("highlights_zh").$type<string[]>().notNull().default([]),

    // Service-detail-page fields (P5 Phase 1). All locale-aware text
    // columns are nullable; HU is the only locale guarded by the publish
    // gate (see assertCanPublishDetail in _actions.ts). Compound jsonb
    // columns keep `[]` defaults to avoid nullish guards in renderers.
    seoTitleHu: text("seo_title_hu"),
    seoTitleEn: text("seo_title_en"),
    seoTitleDe: text("seo_title_de"),
    seoTitleZh: text("seo_title_zh"),

    seoDescriptionHu: text("seo_description_hu"),
    seoDescriptionEn: text("seo_description_en"),
    seoDescriptionDe: text("seo_description_de"),
    seoDescriptionZh: text("seo_description_zh"),

    valuePropositionHu: text("value_proposition_hu"),
    valuePropositionEn: text("value_proposition_en"),
    valuePropositionDe: text("value_proposition_de"),
    valuePropositionZh: text("value_proposition_zh"),

    useCasesHu: jsonb("use_cases_hu").$type<string[]>().notNull().default([]),
    useCasesEn: jsonb("use_cases_en").$type<string[]>().notNull().default([]),
    useCasesDe: jsonb("use_cases_de").$type<string[]>().notNull().default([]),
    useCasesZh: jsonb("use_cases_zh").$type<string[]>().notNull().default([]),

    includedItemsHu: jsonb("included_items_hu").$type<string[]>().notNull().default([]),
    includedItemsEn: jsonb("included_items_en").$type<string[]>().notNull().default([]),
    includedItemsDe: jsonb("included_items_de").$type<string[]>().notNull().default([]),
    includedItemsZh: jsonb("included_items_zh").$type<string[]>().notNull().default([]),

    processStepsHu: jsonb("process_steps_hu").$type<{ title: string; body: string }[]>().notNull().default([]),
    processStepsEn: jsonb("process_steps_en").$type<{ title: string; body: string }[]>().notNull().default([]),
    processStepsDe: jsonb("process_steps_de").$type<{ title: string; body: string }[]>().notNull().default([]),
    processStepsZh: jsonb("process_steps_zh").$type<{ title: string; body: string }[]>().notNull().default([]),

    trustItemsHu: jsonb("trust_items_hu").$type<{ title: string; body: string }[]>().notNull().default([]),
    trustItemsEn: jsonb("trust_items_en").$type<{ title: string; body: string }[]>().notNull().default([]),
    trustItemsDe: jsonb("trust_items_de").$type<{ title: string; body: string }[]>().notNull().default([]),
    trustItemsZh: jsonb("trust_items_zh").$type<{ title: string; body: string }[]>().notNull().default([]),

    faqHu: jsonb("faq_hu").$type<{ q: string; a: string }[]>().notNull().default([]),
    faqEn: jsonb("faq_en").$type<{ q: string; a: string }[]>().notNull().default([]),
    faqDe: jsonb("faq_de").$type<{ q: string; a: string }[]>().notNull().default([]),
    faqZh: jsonb("faq_zh").$type<{ q: string; a: string }[]>().notNull().default([]),

    // Locale-independent — slugs are shared across locales. Empty array
    // = no related links.
    relatedServiceSlugs: jsonb("related_service_slugs").$type<string[]>().notNull().default([]),

    sortOrder: integer("sort_order").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_services_parent_id").on(table.parentId),
    index("idx_services_public")
      .on(table.parentId, table.sortOrder, table.id)
      .where(sql`${table.isPublished} = true AND ${table.isActive} = true`),
  ],
);

// Parent ↔ children self-join via Drizzle relations API. Enables:
//   db.query.services.findMany({
//     where: isNull(services.parentId),
//     with: { children: true }
//   })
// `lib/db/index.ts` already passes the full schema to `drizzle({ schema })`,
// so this relation is auto-registered with the query builder.
export const servicesRelations = relations(services, ({ one, many }) => ({
  parent: one(services, {
    fields: [services.parentId],
    references: [services.id],
    relationName: "parent_child",
  }),
  children: many(services, {
    relationName: "parent_child",
  }),
}));

// ────────────────────────────────────────────────────────────────────────────
// 7. PARTNERS — admin-managed partner / client / logo entities. Single
//    locale (company names typically don't translate); locale-aware
//    partner copy is out of scope for Iter 5. Distinct from
//    `client_references`, which is a 4-locale industry-category taxonomy
//    seeded from i18n; partners are concrete entities with logo asset +
//    optional website link.
//
//    Slug: auto-derived from `name` on create with collision-suffix
//    (slug, slug-2, slug-3, …). NOT editable post-create — slug is an
//    internal stable identifier in Iter 5, not a public URL. If Phase 5
//    introduces public partner pages, the migration will either add an
//    editable `publicSlug` column (keeping `slug` stable) or introduce
//    slug editing intentionally with the right validation surface.
//
//    Publish guard (application-layer, server actions): rejects
//    `is_published = true` when `logo_url IS NULL` OR `name` (trimmed)
//    is empty. NOT enforced as DB CHECK — admin error messaging is
//    cleaner from the server action layer (matches the services
//    parent-publish rule precedent).
//
//    Default state on create: is_active=true, is_published=false. New
//    partners save as drafts even with no logo; publish requires a
//    deliberate later toggle once logo + name are present.
//
//    Public logo strip: homepage rendering is proof-gated. A partner logo
//    can appear only when the row is active, published, has a logo asset,
//    is explicitly opted into the logo strip, and public logo usage approval
//    has been recorded. Partner rows are not public relationship/schema claims.
//
//    Index: `idx_partners_active_sort` partial composite on
//    `(is_active, sort_order)` filtered to `is_active = true` —
//    mirrors the active+sort pattern from client_references and
//    certifications. `idx_partners_logo_strip_public` supports the
//    proof-gated homepage logo-strip query.
// ────────────────────────────────────────────────────────────────────────────
export const partners = pgTable(
  "partners",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    isActive: boolean("is_active").notNull().default(true),
    isPublished: boolean("is_published").notNull().default(false),
    showInLogoStrip: boolean("show_in_logo_strip").notNull().default(false),
    logoUsageApprovedAt: timestamp("logo_usage_approved_at", {
      withTimezone: true,
    }),
    logoUsageApprovedBy: text("logo_usage_approved_by"),
    logoUsageScope: text("logo_usage_scope"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_partners_active_sort")
      .on(table.isActive, table.sortOrder)
      .where(sql`${table.isActive} = true`),
    index("idx_partners_logo_strip_public")
      .on(table.sortOrder, table.name)
      .where(
        sql`${table.isActive} = true AND ${table.isPublished} = true AND ${table.showInLogoStrip} = true AND ${table.logoUrl} IS NOT NULL AND ${table.logoUsageApprovedAt} IS NOT NULL`,
      ),
    index("idx_partners_logo_strip_full_proof")
      .on(table.sortOrder, table.name)
      .where(
        sql`${table.isActive} = true AND ${table.isPublished} = true AND ${table.showInLogoStrip} = true AND nullif(trim(${table.logoUrl}), '') IS NOT NULL AND ${table.logoUsageApprovedAt} IS NOT NULL AND nullif(trim(${table.logoUsageApprovedBy}), '') IS NOT NULL AND nullif(trim(${table.logoUsageScope}), '') IS NOT NULL`,
      ),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// 8. SITE SETTINGS — admin-managed company/contact settings foundation.
//    Single-row typed table (id=1 enforced by CHECK) rather than key/value:
//    these fields are legal/contact facts with stable validation needs.
//
//    Iter 7 scope is admin-only. Public renderers still read SEO_DATA /
//    hardcoded values until a separate public cutover commit decides how to
//    bridge runtime settings into Footer, Contact, metadata and JSON-LD.
// ─────────────────────────────────────────────────────────────────────────────
export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),

    legalName: text("legal_name").notNull(),
    legalNameShort: text("legal_name_short").notNull(),
    alternateName: text("alternate_name").notNull(),
    registrationId: text("registration_id").notNull(),
    taxId: text("tax_id").notNull(),
    vatId: text("vat_id").notNull(),

    addressStreet: text("address_street").notNull(),
    addressPostalCode: varchar("address_postal_code", { length: 20 }).notNull(),
    addressLocality: text("address_locality").notNull(),
    addressCountry: varchar("address_country", { length: 2 }).notNull().default("HU"),
    addressShort: text("address_short").notNull(),
    mapsUrl: text("maps_url").notNull(),

    phone: text("phone").notNull(),
    phoneDisplay: text("phone_display").notNull(),
    phoneTel: text("phone_tel").notNull(),
    email: text("email").notNull(),
    emailHref: text("email_href").notNull(),
    officeHoursHu: text("office_hours_hu"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("site_settings_singleton_id", sql`${table.id} = 1`),
  ],
);
