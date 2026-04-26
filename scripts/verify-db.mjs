// Verify connection + schema by counting rows in each of the 5 tables.
// Run after migration to confirm tables exist; expects 0 rows everywhere
// before seeding, then non-zero after seed-script runs.
//
// Usage: node scripts/verify-db.mjs

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL env var is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const news = (await sql`SELECT COUNT(*)::int AS n FROM news`)[0].n;
const positions = (await sql`SELECT COUNT(*)::int AS n FROM positions`)[0].n;
const messages = (await sql`SELECT COUNT(*)::int AS n FROM messages`)[0].n;
const refs = (await sql`SELECT COUNT(*)::int AS n FROM client_references`)[0].n;
const certs = (await sql`SELECT COUNT(*)::int AS n FROM certifications`)[0].n;

console.log("--- row counts ---");
console.log(`news               ${news} rows`);
console.log(`positions          ${positions} rows`);
console.log(`messages           ${messages} rows`);
console.log(`client_references  ${refs} rows`);
console.log(`certifications     ${certs} rows`);

const indexRows = await sql`
  SELECT tablename, indexname
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename IN ('client_references', 'messages', 'news', 'positions', 'certifications')
    AND indexname LIKE 'idx_%'
  ORDER BY tablename, indexname
`;

const grouped = {};
for (const { tablename, indexname } of indexRows) {
  (grouped[tablename] ??= []).push(indexname);
}

console.log("");
console.log("--- indexes ---");
for (const tbl of ["client_references", "messages", "news", "positions", "certifications"]) {
  const list = grouped[tbl] ?? [];
  console.log(`${tbl}: ${list.join(", ")}`);
}
