/**
 * Webtekno CSV → mevcut şemamıza dönüştür ve yükle.
 * 1) Önce haberler tablosunu temizler
 * 2) 52 satırı dönüştürür (kategori, etiket, manşet atar)
 * 3) Toplu insert eder
 *
 * Kullanım:  npm run db:seed:webtekno
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

// ============== CSV Parser ==============
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

// ============== Slugify ==============
function slugifyTr(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ============== Yazar ayrıştır ==============
function parseAuthor(raw: string): { yazar: string | null; unvan: string | null } {
  if (!raw) return { yazar: null, unvan: null };
  const slash = raw.indexOf('/');
  if (slash < 0) return { yazar: raw.trim(), unvan: null };
  const left = raw.slice(0, slash).trim();
  const right = raw.slice(slash + 1).trim();
  if (/^\d{2}\.\d{2}\.\d{4}/.test(right)) return { yazar: left, unvan: null };
  return { yazar: left, unvan: right };
}

// ============== Okuma süresi tahmin ==============
function estimateOkumaSuresi(content: string, description: string): number {
  const text = (content || description || '').replace(/\s+/g, ' ').trim();
  if (!text) return 3;
  return Math.max(2, Math.min(15, Math.round(text.split(' ').length / 180)));
}

// ============== Kategori tespiti ==============
type Kategori = 'buyuk-dil-modelleri' | 'arastirma' | 'araclar' | 'robotik' | 'politika-etik' | 'is-dunyasi' | 'acik-kaynak';

function tespitKategori(baslik: string, icerik: string): Kategori {
  const t = (baslik + ' ' + icerik).toLowerCase();
  if (/claude|chatgpt|gpt-[0-9]|gpt-?[0-9]\.?[0-9]|gemini|gemma|deepseek|llama|mai serisi|model(?!.*arac)|yeni model/.test(t)) {
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

// ============== Elle kategori override ==============
const KATEGORI_OVERRIDE: Record<string, Kategori> = {
  '218208': 'buyuk-dil-modelleri',
  '218232': 'buyuk-dil-modelleri',
  '218226': 'araclar',
  '218256': 'araclar',
  '218163': 'is-dunyasi',
  '218175': 'politika-etik',
  '218166': 'is-dunyasi',
  '218365': 'is-dunyasi',
  '218157': 'is-dunyasi',
};

// ============== Etiket çıkarımı ==============
const BILINEN_URUNLER = [
  'ChatGPT', 'GPT-5', 'GPT-4', 'GPT-3', 'GPT', 'Claude', 'Claude Code', 'Claude Opus',
  'Gemini', 'Gemini 3.5', 'Gemini 3', 'Gemini 2.5', 'Gemini Flash', 'Gemini Pro',
  'Gemma', 'Gemma 4', 'Gemma 2', 'Llama', 'DeepSeek', 'Mistral', 'MAI',
  'Sora', 'Sora 2', 'DALL-E', 'Midjourney', 'Stable Diffusion', 'Perplexity',
  'Copilot', 'GitHub Copilot', 'ElevenLabs', 'Siri', 'Siri AI', 'Scout',
  'Spark', 'Omni', 'Halo', 'Pics', 'CapCut', 'Cosmos', 'Cosmos 3', 'Isaac',
  'GR00T', 'Universal Cart', 'Project Genie', 'Lockdown', 'Gemma 4 12B',
  'DiffusionGemma', 'MAI Serisi', 'OpenClaw', 'Apple Intelligence', 'Starlight',
  'Neural Expressive', 'Comet',
];

const BILINEN_SIRKETLER = [
  'OpenAI', 'Anthropic', 'Google', 'Alphabet', 'Microsoft', 'Apple', 'NVIDIA',
  'Meta', 'Amazon', 'IBM', 'Oracle', 'Tesla', 'xAI', 'Mistral', 'DeepSeek',
  'Perplexity', 'Hugging Face', 'ElevenLabs', 'Stability', 'Midjourney',
  'CapCut', 'ByteDance', 'GitHub', 'Lenovo', 'DeepMind', 'Boston Dynamics',
  'Uber', 'Nvidia', 'Reuters', 'TechCrunch', 'The Verge', 'MIT', 'Wired',
  'VentureBeat', 'Nature', 'Webtekno', 'Galaxy AI',
];

function htmlTemizle(text: string): string {
  return text.replace(/&[a-z#0-9]+;/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function etiketCikar(baslik: string, icerik: string): string[] {
  const t = htmlTemizle(baslik + ' ' + icerik);
  const bulunan = new Set<string>();

  // Ürün isimleri (case-insensitive)
  for (const urun of BILINEN_URUNLER) {
    const re = new RegExp(`\\b${urun.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(t)) {
      bulunan.add(urun.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''));
    }
  }

  // Şirket isimleri
  for (const sirket of BILINEN_SIRKETLER) {
    const re = new RegExp(`\\b${sirket.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(t)) {
      bulunan.add(sirket.toLowerCase());
    }
  }

  // Sık kullanılan konu kelimeleri
  const KONULAR = [
    'yapay-zeka', 'llm', 'robot', 'video', 'görsel', 'ses', 'çeviri', 'kodlama',
    'ajans', 'güvenlik', 'veri-merkezi', 'yatırım', 'arama', 'tarayıcı',
    'uygulama', 'oyun', 'oyun-motoru', 'futbol', 'futbolcu', 'dünya-kupası',
    'sponsorluk', 'fiyat', 'indirim', 'api', 'açık-kaynak', 'yerel-ai',
    'mobil', 'android', 'ios', 'rekabet', 'editör', 'prompt', 'matematik',
    'protein', 'tıp', 'eğitim', 'erişilebilirlik', 'düzenleme', 'reklam',
    'davet', 'dava', 'sponsor', 'müzik', 'oyun', 'verimlilik', 'apple-pay',
  ];
  for (const konu of KONULAR) {
    if (t.toLowerCase().includes(konu.replace(/-/g, ' ')) || t.toLowerCase().includes(konu)) {
      bulunan.add(konu);
    }
  }

  return [...bulunan].slice(0, 8);
}

// ============== Main ==============
async function main() {
  console.log('▶ CSV okunuyor...');
  const text = await readFile(CSV_PATH, 'utf8');
  const rows = parseCsv(text);
  console.log(`  ${rows.length} satır bulundu.`);

  console.log('▶ Dönüştürülüyor...');
  const mapped = rows.map((r) => {
    const { yazar, unvan } = parseAuthor(r.author || '');
    const baslik = htmlTemizle(r.title || '');
    const ozet = htmlTemizle(r.description || '');
    const icerik = htmlTemizle(r.content || '');
    const kategori = KATEGORI_OVERRIDE[r.id] ?? tespitKategori(baslik, icerik);
    const etiketler = etiketCikar(baslik, icerik);
    return {
      slug: slugifyTr(baslik) + '-' + r.id,  // CSV id'yi slug'a ekleyerek çakışmayı önle
      baslik,
      ozet,
      icerik: icerik || null,
      gorsel: r.image || '',
      kaynak_ad: KAYNAK_AD,
      kaynak_url: KAYNAK_URL,
      kaynak_logo: null,
      yazar: yazar || null,
      kategori,
      etiketler,
      yayin_tarihi: r.date || new Date().toISOString(),
      okuma_suresi: estimateOkumaSuresi(r.content || '', r.description || ''),
      orijinal_url: r.url || '',
      one_cikan: false,
    };
  });

  // Manşet seçimi: en yeni 3
  const tarihSiralı = [...mapped].sort((a, b) => b.yayin_tarihi.localeCompare(a.yayin_tarihi));
  const mansetIdleri = new Set(tarihSiralı.slice(0, 3).map((m) => m.slug));
  mapped.forEach((m) => { m.one_cikan = mansetIdleri.has(m.slug); });

  console.log(`  Manşet: ${[...mansetIdleri].join(', ')}`);

  // Kategori dağılımı
  const dagilim = new Map<string, number>();
  mapped.forEach((m) => dagilim.set(m.kategori, (dagilim.get(m.kategori) || 0) + 1));
  console.log('\n📊 Kategori dağılımı:');
  [...dagilim.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${v}× ${k}`));

  console.log('\n🗑️  Mevcut veriler siliniyor...');
  // Supabase JS client TRUNCATE yapamaz; DELETE FROM kullanıyoruz
  const { error: delErr, count: delCount } = await supabase
    .from('haberler')
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // tüm satırları sil
  if (delErr) {
    console.error(`  ❌ Silme hatası: ${delErr.message}`);
    process.exit(1);
  }
  console.log(`  ✅ ${delCount ?? '?'} satır silindi.`);

  console.log('\n📥 Yeni veriler ekleniyor...');
  let inserted = 0;
  let failed = 0;
  for (const row of mapped) {
    const { error } = await supabase.from('haberler').insert(row);
    if (error) {
      console.error(`  ❌ ${row.slug}: ${error.message}`);
      failed++;
    } else {
      inserted++;
    }
  }

  console.log(`\n📊 Sonuç: ${inserted} eklendi, ${failed} hata.`);

  // Doğrulama
  console.log('\n🔍 Doğrulama...');
  const { count } = await supabase.from('haberler').select('*', { count: 'exact', head: true });
  console.log(`  Veritabanındaki toplam haber: ${count}`);
  const { data: manset } = await supabase.from('haberler').select('baslik').eq('one_cikan', true);
  console.log(`  Manşet haberler (${manset?.length ?? 0}):`);
  manset?.forEach((m) => console.log(`    - ${m.baslik}`));
}

main().catch((err) => { console.error('❌ Hata:', err); process.exit(1); });
