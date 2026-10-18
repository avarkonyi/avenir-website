import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { mkdir, writeFile } from 'node:fs/promises';
config({ path: '.env.local', quiet: true });
const url = new URL(process.env.DATABASE_URL);
if (!url.hostname.startsWith('ep-twilight-sound-al2b7jsb.')) throw new Error('Only the verified staging endpoint is allowed');
const sql = neon(url.toString());
// This audit selects public CMS content only. No contact messages, user data,
// credentials or mutation statements are queried or written to the report.
const [modes, services] = await sql.transaction([
sql`select current_setting('transaction_read_only') as read_only`,
sql`select slug, is_active, is_published, updated_at,
 name_hu, name_en, name_de, name_zh,
 short_desc_hu, short_desc_en, short_desc_de, short_desc_zh,
 seo_title_hu, seo_title_en, seo_title_de, seo_title_zh,
 seo_description_hu, seo_description_en, seo_description_de, seo_description_zh,
 long_desc_hu, long_desc_en, long_desc_de, long_desc_zh,
 value_proposition_hu, value_proposition_en, value_proposition_de, value_proposition_zh
 from services where is_active=true and is_published=true order by sort_order`
], { readOnly: true });
const mode = modes[0];
if (mode.read_only !== 'on') throw new Error('Read-only transaction required');
const fields = ['name','short_desc','seo_title','seo_description','long_desc','value_proposition'];
const report = { checkedAt: new Date().toISOString(), environment: 'staging', readOnly: mode.read_only,
  services: services.map(row => ({ slug: row.slug, updatedAt: row.updated_at,
    locales: Object.fromEntries(['hu','en','de','zh'].map(locale => [locale, {
      missing: fields.filter(field => !row[`${field}_${locale}`]?.trim()),
      name: row[`name_${locale}`],
    }]))
  })) };
await mkdir('docs/audits/2026-10-17', { recursive: true });
await writeFile('docs/audits/2026-10-17/staging-content-coverage.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
