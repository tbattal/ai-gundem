/**
 * On-demand revalidation tetikleyici.
 *
 * Kullanım:
 *   npx tsx scripts/revalidate.ts                    # all: true (tüm ana yüzeyler)
 *   npx tsx scripts/revalidate.ts --paths=/,/arsiv   # belirli yollar
 *   npx tsx scripts/revalidate.ts --all-slugs        # / + tüm /haber/<slug> + tüm /kategori/<kategori>
 *   npx tsx scripts/revalidate.ts --dry-run          # çağrıyı atma, sadece body'yi yazdır
 *
 * Gerektirir: REVALIDATE_SECRET ve NEXT_PUBLIC_SITE_URL (veya SITE_URL) env.
 *   Site URL belirtilmezse varsayılan: https://ai-gundem.netlify.app
 */
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });
loadEnv();

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const useAll = args.has('--all');
const useAllSlugs = args.has('--all-slugs');
const explicitPaths = [...args]
  .filter((a) => a.startsWith('--paths='))
  .map((a) => a.slice('--paths='.length).split(','))
  .flat()
  .filter(Boolean);

const secret = process.env.REVALIDATE_SECRET;
const siteUrl =
  process.env.SITE_URL
  ?? process.env.NEXT_PUBLIC_SITE_URL
  ?? 'https://ai-gundem.netlify.app';

if (!secret) {
  console.error('❌ REVALIDATE_SECRET gerekli (.env.local\'e ekle)');
  process.exit(1);
}

interface SupaHaberRow { slug: string; kategori: string }

async function getAllRows(): Promise<SupaHaberRow[]> {
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli');
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('haberler')
    .select('slug, kategori');
  if (error) throw new Error(error.message);
  return (data ?? []) as SupaHaberRow[];
}

const KATEGORI_SLUG = {
  'buyuk-dil-modelleri': 'buyuk-dil-modelleri',
  'arastirma': 'arastirma',
  'araclar': 'araclar',
  'robotik': 'robotik',
  'politika-etik': 'politika-etik',
  'is-dunyasi': 'is-dunyasi',
  'acik-kaynak': 'acik-kaynak',
} as const;

async function main() {
  let body: Record<string, unknown> = {};

  if (useAll) {
    body = { all: true };
  } else if (useAllSlugs) {
    const rows = await getAllRows();
    const slugs = rows.map((r) => `/haber/${r.slug}`);
    const kategoriler = [...new Set(rows.map((r) => r.kategori))]
      .map((k) => `/kategori/${KATEGORI_SLUG[k as keyof typeof KATEGORI_SLUG] ?? k}`);
    body = { paths: ['/', '/arsiv', ...slugs, ...kategoriler] };
  } else if (explicitPaths.length > 0) {
    body = { paths: explicitPaths };
  } else {
    body = { all: true };
  }

  const url = `${siteUrl.replace(/\/$/, '')}/api/revalidate?secret=${encodeURIComponent(secret!)}`;

  console.log(`🎯 Site: ${siteUrl}`);
  console.log(`📦 Body: ${JSON.stringify(body, null, 2)}`);

  if (dryRun) {
    console.log(`\n(dry-run, çağrı atlanmadı)`);
    console.log(`Gerçek çağrı: POST ${url}`);
    return;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log(`\n↩️  HTTP ${res.status}`);
  console.log(text);
  if (!res.ok) process.exit(1);
}

main().catch((e) => {
  console.error('💥 Hata:', e);
  process.exit(1);
});
