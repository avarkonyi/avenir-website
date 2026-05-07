#!/usr/bin/env node

const SITE_URL = "https://www.afm.hu";
const HOST = "www.afm.hu";
const INDEXNOW_KEY = "9a2c0b7e-5f6d-4b15-96a2-8e6d52c7a0f4";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const ENDPOINT =
  process.env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow";

const DEFAULT_URLS = [
  `${SITE_URL}/hu`,
  `${SITE_URL}/en`,
  `${SITE_URL}/de`,
  `${SITE_URL}/zh`,
  `${SITE_URL}/hu/adatvedelem`,
  `${SITE_URL}/hu/aszf`,
  `${SITE_URL}/hu/impresszum`,
  `${SITE_URL}/en/adatvedelem`,
  `${SITE_URL}/en/aszf`,
  `${SITE_URL}/en/impresszum`,
  `${SITE_URL}/de/adatvedelem`,
  `${SITE_URL}/de/aszf`,
  `${SITE_URL}/de/impresszum`,
  `${SITE_URL}/zh/adatvedelem`,
  `${SITE_URL}/zh/aszf`,
  `${SITE_URL}/zh/impresszum`,
];

function getUrlsFromArgs(args) {
  const urlArgs = args.filter((arg) => arg.startsWith("https://"));
  if (urlArgs.length === 0) return DEFAULT_URLS;
  return urlArgs;
}

function uniqueUrls(urls) {
  return [...new Set(urls)].sort((a, b) => a.localeCompare(b));
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const urlList = uniqueUrls(getUrlsFromArgs(args));

  for (const url of urlList) {
    if (!url.startsWith(`${SITE_URL}/`)) {
      throw new Error(`IndexNow URL is outside ${SITE_URL}: ${url}`);
    }
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  if (dryRun) {
    console.log(JSON.stringify({ endpoint: ENDPOINT, payload }, null, 2));
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const body = await response.text();

  console.log(
    `IndexNow response: ${response.status} ${response.statusText || ""}`.trim(),
  );
  if (body) console.log(body);

  if (!response.ok && response.status !== 202) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
