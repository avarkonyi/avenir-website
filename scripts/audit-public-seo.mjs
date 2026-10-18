import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = new URL(process.argv[2] || 'https://www.afm.hu').origin;
const output = resolve(process.argv[3] || 'docs/audits/2026-10-17/live');
await mkdir(output, { recursive: true });
const decode = (s = '') => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map(m => [m[1].toLowerCase(), decode(m[2])]));
const text = (s = '') => decode(s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const request = async url => {
  const started = performance.now();
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
  const body = await response.text();
  await new Promise(r => setTimeout(r, 250));
  return { status: response.status, headers: Object.fromEntries(response.headers), body, elapsedMs: Math.round(performance.now() - started) };
};
const robots = await request(`${origin}/robots.txt`);
const sitemap = await request(`${origin}/sitemap.xml`);
await writeFile(`${output}/robots.txt`, robots.body);
await writeFile(`${output}/sitemap.xml`, sitemap.body);
await writeFile(`${output}/transport.json`, JSON.stringify({ checkedAt: new Date().toISOString(), origin, robots: { ...robots, body: undefined }, sitemap: { ...sitemap, body: undefined } }, null, 2));
const sitemapUrls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
const sitemapPaths = new Set(sitemapUrls.map(url => new URL(url).pathname));
const queue = [...new Set(['/', '/hu', '/en', '/de', '/zh', '/ko', '/fr', ...sitemapUrls.map(url => new URL(url).pathname), '/hu/does-not-exist-seo-audit', '/hu/szolgaltatasok/does-not-exist-seo-audit', '/fr/szolgaltatasok/objektumorzes', '/admin/login', '/hu/admin'])];
const seen = new Set();
const inventory = [];
const edges = [];
while (queue.length && seen.size < 120) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  try {
    const { status, headers, body, elapsedMs } = await request(origin + path);
    if (status === 429) throw new Error('Rate limit reached; audit stops without retry');
    const metas = [...body.matchAll(/<meta\s[^>]*>/gi)].map(m => attrs(m[0]));
    const links = [...body.matchAll(/<link\s[^>]*>/gi)].map(m => attrs(m[0]));
    const anchors = [...body.matchAll(/<a\s[^>]*>/gi)].map(m => attrs(m[0]).href).filter(Boolean);
    for (const href of anchors) {
      const url = new URL(href, origin + path);
      if (url.origin !== origin || !/^\/(hu|en|de|zh|ko|fr)(\/|$)/.test(url.pathname)) continue;
      edges.push({ from: path, to: url.pathname, hash: url.hash });
      if (!seen.has(url.pathname)) queue.push(url.pathname);
    }
    const jsonLd = [...body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(m => { try { return JSON.parse(m[1]); } catch { return { invalid: true }; } });
    const main = body.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
    inventory.push({ url: origin + path, path, locale: path.split('/')[1], type: path.includes('/szolgaltatasok/') ? 'service' : path.includes('/hirek/') ? 'article' : /^\/(hu|en|de|zh|ko|fr)$/.test(path) ? 'home' : 'other', status, redirect: headers.location || null, xRobotsTag: headers['x-robots-tag'] || null, cache: headers['x-vercel-cache'] || null, elapsedMs, robots: metas.filter(m => m.name === 'robots' || m.name === 'googlebot'), title: text(body.match(/<title>([\s\S]*?)<\/title>/i)?.[1]), description: metas.find(m => m.name === 'description')?.content, lang: attrs(body.match(/<html[^>]*>/i)?.[0] || '').lang, canonical: links.find(l => l.rel === 'canonical')?.href, alternates: links.filter(l => l.rel === 'alternate' && l.hreflang), h1: [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => text(m[1])), sitemap: sitemapPaths.has(path), mainText: text(main), jsonLd });
    console.log(`${status} ${path}`);
  } catch (error) { inventory.push({ path, error: error.message }); if (error.message.startsWith("Rate limit")) break; }
}
for (const row of inventory) row.incomingLinks = [...new Set(edges.filter(e => e.to === row.path && e.from !== row.path).map(e => e.from))];
await writeFile(`${output}/inventory.json`, JSON.stringify({ checkedAt: new Date().toISOString(), origin, note: 'Ordinary HTTP GET, not verified search-engine bot traffic. First response measured; elapsedMs includes polite 250ms delay and is not Core Web Vitals.', inventory, edges }, null, 2));
const csv = [['URL','language','type','status','redirect','robots','canonical','title','H1','sitemap','incoming'], ...inventory.map(r => [r.url,r.locale,r.type,r.status,r.redirect,[r.xRobotsTag,...(r.robots||[]).map(m=>m.content)].filter(Boolean).join('; '),r.canonical,r.title,(r.h1||[]).join(' | '),r.sitemap,(r.incomingLinks||[]).length])].map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');
await writeFile(`${output}/inventory.csv`, csv);
console.log(`Saved ${inventory.length} URL observations to ${output}`);
