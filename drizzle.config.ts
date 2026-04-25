import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load .env.local for local drizzle-kit invocations. In Vercel CI builds,
// env vars are already injected into process.env, so this call is a no-op
// (no .env.local file there). DATABASE_URL_UNPOOLED is preferred for
// migrations because PgBouncer (the connection pooler) doesn't support DDL
// operations like CREATE TABLE; falls back to DATABASE_URL if unpooled is
// unset.
config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL env var is not set");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
