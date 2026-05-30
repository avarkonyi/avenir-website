#!/usr/bin/env node

const scriptName = process.argv[2] ?? "this production DB script";

console.error(
  [
    `${scriptName} is disabled for production after launch.`,
    "Use Neon branch-level restore or a targeted guarded sync script with dry-run/apply support.",
    "No database connection was opened and no rows were written.",
  ].join("\n"),
);

process.exit(1);
