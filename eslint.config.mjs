import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference snapshots — not used by the app, kept as historical
    // documentation of original components before the migration.
    "references/**",
    // Drafts folder — markdown working documents, not deploy-build assets
    "drafts/**",
  ]),
]);

export default eslintConfig;
