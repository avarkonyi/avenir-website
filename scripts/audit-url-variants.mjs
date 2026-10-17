import { writeFile } from 'node:fs/promises';
const urls = ['http://afm.hu/', 'https://afm.hu/', 'http://www.afm.hu/', 'https://www.afm.hu/', 'https://www.afm.hu/hu/', 'https://www.afm.hu/HU', 'https://www.afm.hu/hu?utm_source=seo-audit', 'https://www.afm.hu/cgi-sys/defaultwebpage.cgi', 'https://www.afm.hu/mall', 'https://www.afm.hu/tw', 'https://www.afm.hu/hu/szolgaltatasok/security'];
const observations = [];
for (const original of urls) {
  const chain = [];
  let url = original;
  try {
    for (let i = 0; i < 6; i++) {
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      const body = await response.text();
      const location = response.headers.get('location');
      chain.push({ url, status: response.status, location, canonical: body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] ?? null, xRobotsTag: response.headers.get('x-robots-tag') });
      await new Promise(r => setTimeout(r, 300));
      if (!location || response.status < 300 || response.status > 399) break;
      url = new URL(location, url).href;
    }
    observations.push({ original, chain });
  } catch (error) { observations.push({ original, chain, error: error.message }); }
}
await writeFile('docs/audits/2026-10-17/live/url-variants.json', JSON.stringify({ checkedAt: new Date().toISOString(), observations }, null, 2));
console.log(JSON.stringify(observations, null, 2));
