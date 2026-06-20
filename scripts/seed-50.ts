/**
 * Webtekno CSV → 50 haber seç → şema uyumu test et → eskileri sil → yenileri ekle.
 *
 * Akış:
 *   1) CSV'den 50 satır seç (tarih sırası, en yeni 50)
 *   2) Şemaya map et (kategori, etiket, manşet ataması seed-webtekno.ts ile aynı)
 *   3) 1 satır test insert + delete (şema uyumu doğrula)
 *   4) Tüm eski haberleri sil
 *   5) 50 satırı toplu insert et
 *   6) Doğrula
 *
 * Kullanım:  npm run db:seed:50
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';

loadEnv({ path: '.env.local' });
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const CSV_PATH = 'C:/Users/user/Desktop/claudesignweb/webtekno_yapay_zeka.csv';
const KAYNAK_AD = 'Webtekno';
const KAYNAK_URL = 'https://www.webtekno.com';
const HEDEF_SAYI = 50;
const KAYNAK_LOGO = 'https://www.webtekno.com/assets/img/logo.svg';

type Kategori =
  | 'buyuk-dil-modelleri' | 'arastirma' | 'araclar' | 'robotik'
  | 'politika-etik' | 'is-dunyasi' | 'acik-kaynak';

function parseCsv(text: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const headers: string[] = [];
  let i = 0, field = '', row: string[] = [], inQuotes = false;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') {
        if (headers.length === 0) headers.push(...row);
        else {
          const obj: Record<string, string> = {};
          for (let k = 0; k < headers.length; k++) obj[headers[k]] = row[k] ?? '';
          rows.push(obj);
        }
      }
      row = []; i++; continue;
    }
    field += c; i++;
  }
  return rows;
}

function slugifyTr(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseAuthor(raw: string): { yazar: string | null } {
  if (!raw) return { yazar: null };
  const slash = raw.indexOf('/');
  if (slash < 0) return { yazar: raw.trim() };
  const left = raw.slice(0, slash).trim();
  const right = raw.slice(slash + 1).trim();
  if (/^\d{2}\.\d{2}\.\d{4}/.test(right)) return { yazar: left };
  return { yazar: left };
}

function estimateOkumaSuresi(content: string, description: string): number {
  const text = (content || description || '').replace(/\s+/g, ' ').trim();
  if (!text) return 3;
  return Math.max(2, Math.min(15, Math.round(text.split(' ').length / 180)));
}

function tespitKategori(baslik: string, icerik: string): Kategori {
  const t = (baslik + ' ' + icerik).toLowerCase();
  if (/claude|chatgpt|gpt-[0-9]|gpt-?[0-9]\.?[0-9]|gemini|gemma|deepseek|llama|mai serisi|yeni model/.test(t)) {
    return 'buyuk-dil-modelleri';
  }
  if (/robot|cosmos|isaac|insansı|humanoid/.test(t)) {
    return 'robotik';
  }
  if (/sızıntı|guvenlik|güvenlik|mahkeme|dma|yasak|düzenleme|avrupa|etik|veri ihlali|lockdown|uyarı/.test(t)) {
    return 'politika-etik';
  }
  if (/araştırma|alphafold|protein|matematik|bilim|keşif/.test(t)) {
    return 'arastirma';
  }
  if (/açık kaynak|open source|apache 2\.0/.test(t)) {
    return 'acik-kaynak';
  }
  if (/apple|google|microsoft|nvidia|yatırım|şirket|sponsor|ceo|scout|pics|spark|omni|universal cart|android halo|apple intelligence|siri|gemma 4|cosmos 3|gpu|veri merkezi|dünya kupası|anket|ajans|sponsorluk|messi/.test(t)) {
    return 'is-dunyasi';
  }
  return 'araclar';
}

function htmlTemizle(text: string): string {
  return text.replace(/&[a-z#0-9]+;/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function icerikHazirla(text: string): string {
  if (!text) return '';
  const temiz = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!temiz) return '';
  return paragraflaraBol(temiz);
}

function paragraflaraBol(text: string, hedefUzunluk = 400): string {
  const cumleler = text.split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜa-zşığüöç])/);
  const paragraflar: string[] = [];
  let tampon = '';
  for (const cumle of cumleler) {
    const t = cumle.trim();
    if (!t) continue;
    const aday = tampon ? tampon + ' ' + t : t;
    if (tampon && aday.length > hedefUzunluk) {
      paragraflar.push(tampon);
      tampon = t;
    } else {
      tampon = aday;
    }
  }
  if (tampon) paragraflar.push(tampon);
  return paragraflar.map((p) => `<p>${p}</p>`).join('\n');
}

function gorselGecerli(url: string): boolean {
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) return false;
  return true;
}

async function main() {
  console.log('▶ CSV okunuyor...');
  const text = await readFile(CSV_PATH, 'utf8');
  const rowsAll = parseCsv(text);
  console.log(`  ${rowsAll.length} satır bulundu.`);

  const gecerli = rowsAll.filter((r) => gorselGecerli(r.image || ''));
  console.log(`  ${gecerli.length} satır geçerli görsele sahip.`);

  gecerli.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const secilen = gecerli.slice(0, HEDEF_SAYI);
  console.log(`  ${secilen.length} satır seçildi (en yeni).`);

  const mapped = secilen.map((r) => {
    const { yazar } = parseAuthor(r.author || '');
    const baslik = htmlTemizle(r.title || '');
    const ozet = htmlTemizle(r.description || '');
    const icerik = icerikHazirla(r.content || '');
    return {
      slug: slugifyTr(baslik) + '-' + r.id,
      baslik,
      ozet,
      icerik: icerik || null,
      gorsel: r.image,
      kaynak_ad: KAYNAK_AD,
      kaynak_url: KAYNAK_URL,
      kaynak_logo: KAYNAK_LOGO,
      yazar: yazar || null,
      kategori: tespitKategori(baslik, icerik),
      etiketler: [] as string[],
      yayin_tarihi: r.date || new Date().toISOString(),
      okuma_suresi: estimateOkumaSuresi(r.content || '', r.description || ''),
      orijinal_url: r.url,
      one_cikan: false,
    };
  });

  const mansetIdleri = new Set(mapped.slice(0, 3).map((m) => m.slug));
  mapped.forEach((m) => { m.one_cikan = mansetIdleri.has(m.slug); });

  const dagilim = new Map<string, number>();
  mapped.forEach((m) => dagilim.set(m.kategori, (dagilim.get(m.kategori) || 0) + 1));
  console.log('\n📊 Kategori dağılımı:');
  [...dagilim.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${v}× ${k}`));

  console.log('\n🗑️  1) Mevcut haberler siliniyor...');
  const { count: delCount, error: delErr } = await supabase
    .from('haberler')
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) {
    console.error(`  ❌ Silme hatası: ${delErr.message}`);
    process.exit(1);
  }
  console.log(`  ✅ ${delCount ?? '?'} satır silindi.`);

  console.log('\n🧪 2) Şema uyumu test ediliyor (1 satır insert+delete)...');
  const testRow = mapped[0];
  const { data: ins, error: insErr } = await supabase
    .from('haberler')
    .insert(testRow)
    .select('id, slug, kategori, gorsel')
    .single();
  if (insErr) {
    console.error(`  ❌ Test insert başarısız: ${insErr.message}`);
    console.error('  Kod:', insErr.code, 'Detay:', insErr.details);
    process.exit(1);
  }
  console.log(`  ✅ Test insert OK: ${ins.slug} (${ins.kategori})`);
  const { error: delTestErr } = await supabase.from('haberler').delete().eq('id', ins.id);
  if (delTestErr) {
    console.error(`  ❌ Test delete başarısız: ${delTestErr.message}`);
    process.exit(1);
  }
  console.log('  ✅ Test delete OK (geri alındı)');

  console.log('\n📥 3) 50 yeni haber ekleniyor...');
  let inserted = 0, failed = 0;
  const failures: string[] = [];
  for (const row of mapped) {
    const { error } = await supabase.from('haberler').insert(row);
    if (error) {
      console.error(`  ❌ ${row.slug}: ${error.message}`);
      failures.push(row.slug);
      failed++;
    } else {
      inserted++;
    }
  }
  console.log(`\n📊 Sonuç: ${inserted} eklendi, ${failed} hata.`);
  if (failures.length) console.log('  Hatalı:', failures.join(', '));

  console.log('\n🔍 4) Doğrulama...');
  const { count } = await supabase.from('haberler').select('*', { count: 'exact', head: true });
  console.log(`  Veritabanındaki toplam haber: ${count}`);
  const { data: manset } = await supabase.from('haberler').select('baslik').eq('one_cikan', true);
  console.log(`  Manşet haberler (${manset?.length ?? 0}):`);
  manset?.forEach((m) => console.log(`    - ${m.baslik}`));

  const { data: ornekler } = await supabase
    .from('haberler')
    .select('baslik, gorsel, kategori, etiketler, okuma_suresi, yazar')
    .order('yayin_tarihi', { ascending: false })
    .limit(3);
  console.log('\n  Örnek 3 satır:');
  ornekler?.forEach((o) => {
    console.log(`    • ${o.baslik}`);
    console.log(`      kategori=${o.kategori}, okuma=${o.okuma_suresi}dk, yazar=${o.yazar ?? '-'}`);
    console.log(`      gorsel=${o.gorsel.slice(0, 80)}...`);
  });
}

main().catch((err) => { console.error('❌ Hata:', err); process.exit(1); });
