/**
 * Mevcut haberlerdeki bozuk Unsplash Source URL'lerini Picsum'a çevirir.
 *
 * Picsum: https://picsum.photos/seed/{slug}/1280/720
 *   - Slug'ı seed olarak kullanır → aynı haber hep aynı görseli gösterir (tutarlı)
 *   - Ücretsiz, CDN'li, hotlink'e açık, 1280x720 JPEG döner
 *   - Next.js Image ile uyumlu (next.config.js'te remotePatterns: ['**'] açık)
 *
 * Kullanım:  npx tsx scripts/fix-gorsel-picsum.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const picsumFor = (slug: string) => `https://picsum.photos/seed/${slug}/1280/720`;

async function main() {
  const { data, error } = await supabase
    .from('haberler')
    .select('id, slug, gorsel')
    .order('yayin_tarihi', { ascending: false });

  if (error) {
    console.error('❌ Liste alınamadı:', error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log('ℹ️  haberler tablosu boş, güncellenecek bir şey yok.');
    return;
  }

  const updates: { id: string; slug: string; oldUrl: string; newUrl: string }[] = [];

  for (const row of data) {
    const newUrl = picsumFor(row.slug);
    if (row.gorsel !== newUrl) {
      updates.push({ id: row.id, slug: row.slug, oldUrl: row.gorsel, newUrl });
    }
  }

  console.log(`📊 Toplam satır: ${data.length}`);
  console.log(`🔄 Güncellenecek: ${updates.length} (zaten doğru olan: ${data.length - updates.length})`);

  if (updates.length === 0) {
    console.log('✅ Tüm görseller zaten Picsum. Çıkılıyor.');
    return;
  }

  const BATCH = 10;
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map((u) =>
        supabase
          .from('haberler')
          .update({ gorsel: u.newUrl })
          .eq('id', u.id)
          .then((r) => {
            if (r.error) throw new Error(r.error.message);
            return u;
          }),
      ),
    );
    for (const r of results) {
      if (r.status === 'fulfilled') {
        ok++;
        console.log(`   ✓ ${r.value.slug}`);
      } else {
        fail++;
        console.error(`   ✗ ${(r as PromiseRejectedResult).reason}`);
      }
    }
  }

  console.log(`\n✅ Güncellendi: ${ok}`);
  if (fail > 0) console.log(`❌ Başarısız: ${fail}`);
}

main().catch((e) => {
  console.error('💥 Beklenmeyen hata:', e);
  process.exit(1);
});
