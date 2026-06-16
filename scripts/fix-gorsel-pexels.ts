/**
 * Her haber için Pexels'ten alakalı, gerçek bir stok fotoğraf çeker.
 *
 * Akış:
 *   1. haberler tablosundaki tüm satırları çek
 *   2. başlıktan Türkçe anahtar kelimeleri tespit et → KEYWORD_MAP ile İngilizce karşılık
 *   3. eşleşme yoksa kategori varsayılanına düş (CATEGORY_KEYWORD)
 *   4. Pexels API'de arat, ilk sonucun src.landscape URL'ini 1280x720'e resize et
 *   5. haberler.gorsel alanını güncelle
 *
 * Pexels free tier: 200 req/saat, 20 000 req/ay — 50 haber ~50 request.
 *
 * Kullanım:  npx tsx scripts/fix-gorsel-pexels.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
loadEnv();

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!PEXELS_KEY) {
  console.error('❌ PEXELS_API_KEY gerekli (.env.local\'e ekle)');
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// Türkçe → İngilizce anahtar kelime eşlemesi. Başlıkta geçen ilk eşleşme kullanılır.
const KEYWORD_MAP: Array<{ tr: string; en: string }> = [
  // Modeller
  { tr: 'gpt-5', en: 'artificial intelligence' },
  { tr: 'gpt-4', en: 'artificial intelligence' },
  { tr: 'gpt', en: 'artificial intelligence' },
  { tr: 'claude', en: 'artificial intelligence' },
  { tr: 'gemini', en: 'artificial intelligence' },
  { tr: 'grok', en: 'artificial intelligence' },
  { tr: 'llama', en: 'artificial intelligence' },
  { tr: 'mistral', en: 'artificial intelligence' },
  { tr: 'qwen', en: 'artificial intelligence' },
  { tr: 'deepseek', en: 'artificial intelligence' },
  { tr: 'phi-4', en: 'microchip' },
  { tr: 'dil modeli', en: 'language model' },
  { tr: 'yapay zekâ', en: 'artificial intelligence' },
  { tr: 'yapay zeka', en: 'artificial intelligence' },
  { tr: 'düşünen model', en: 'artificial intelligence' },
  // Şirketler
  { tr: 'openai', en: 'artificial intelligence' },
  { tr: 'anthropic', en: 'artificial intelligence' },
  { tr: 'nvidia', en: 'graphics card' },
  { tr: 'alibaba', en: 'technology' },
  { tr: 'apple', en: 'smartphone' },
  { tr: 'google', en: 'artificial intelligence' },
  { tr: 'meta', en: 'social media' },
  { tr: 'microsoft', en: 'technology' },
  { tr: 'amazon', en: 'logistics' },
  { tr: 'tesla', en: 'electric car' },
  { tr: 'samsung', en: 'smartphone' },
  { tr: 'huawei', en: 'smartphone' },
  // Robotik
  { tr: 'optimus', en: 'humanoid robot' },
  { tr: 'atlas', en: 'humanoid robot' },
  { tr: 'boston dynamics', en: 'humanoid robot' },
  { tr: 'figure', en: 'humanoid robot' },
  { tr: 'unitree', en: 'humanoid robot' },
  { tr: 'digit', en: 'humanoid robot' },
  { tr: 'insansı robot', en: 'humanoid robot' },
  { tr: 'ev tipi robot', en: 'home robot' },
  { tr: 'robot', en: 'humanoid robot' },
  // Bilim
  { tr: 'antibiyotik', en: 'laboratory' },
  { tr: 'ilaç', en: 'medicine' },
  { tr: 'tıp', en: 'medical' },
  { tr: 'galaksi', en: 'galaxy' },
  { tr: 'cern', en: 'physics laboratory' },
  { tr: 'fizik', en: 'physics' },
  { tr: 'matematik', en: 'mathematics' },
  { tr: 'olimpiyat', en: 'medal' },
  { tr: 'kristal', en: 'crystal' },
  { tr: 'moleküler', en: 'molecular structure' },
  { tr: 'hava tahmini', en: 'weather forecast' },
  { tr: 'hava', en: 'weather' },
  // İş / finans
  { tr: 'startup', en: 'startup office' },
  { tr: 'yatırım', en: 'finance' },
  { tr: 'fon', en: 'finance' },
  { tr: 'hisse', en: 'stock market' },
  { tr: 'şirket', en: 'business meeting' },
  { tr: 'değerleme', en: 'business meeting' },
  { tr: 'satın alma', en: 'business meeting' },
  // Politika / etik
  { tr: 'yasak', en: 'law' },
  { tr: 'yasa', en: 'legislation' },
  { tr: 'dava', en: 'courtroom' },
  { tr: 'telif', en: 'copyright' },
  { tr: 'etik', en: 'ethics' },
  { tr: 'seçim', en: 'election' },
  { tr: 'dezenformasyon', en: 'fake news' },
  { tr: 'deepfake', en: 'fake news' },
  { tr: 'dolandırıcılık', en: 'security' },
  // Araçlar
  { tr: 'cursor', en: 'programming code' },
  { tr: 'copilot', en: 'programming code' },
  { tr: 'notion', en: 'workspace' },
  { tr: 'adobe', en: 'creative software' },
  { tr: 'firefly', en: 'digital art' },
  { tr: 'video', en: 'video editing' },
  { tr: 'ses üretimi', en: 'podcast microphone' },
  { tr: 'ses', en: 'podcast microphone' },
  { tr: 'perplexity', en: 'search engine' },
  { tr: 'görsel üretim', en: 'digital art' },
  { tr: 'vaka', en: 'business meeting' },
  // Açık kaynak
  { tr: 'hugging face', en: 'developer community' },
  { tr: 'pytorch', en: 'programming code' },
  { tr: 'açık kaynak', en: 'developer community' },
  // Eğitim
  { tr: 'doktora', en: 'research' },
  { tr: 'uzman', en: 'research' },
  { tr: 'uzmanlık', en: 'research' },
  { tr: 'eğitim', en: 'education' },
];

const CATEGORY_KEYWORD: Record<string, string> = {
  'buyuk-dil-modelleri': 'artificial intelligence',
  'arastirma': 'scientific research',
  'araclar': 'technology',
  'robotik': 'humanoid robot',
  'politika-etik': 'legislation',
  'is-dunyasi': 'business meeting',
  'acik-kaynak': 'programming code',
};

const turkceLower = (s: string) =>
  s
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g');

function keywordFor(baslik: string, kategori: string): string {
  const lower = turkceLower(baslik);
  for (const { tr, en } of KEYWORD_MAP) {
    if (lower.includes(tr)) return en;
  }
  return CATEGORY_KEYWORD[kategori] ?? 'technology';
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
}

async function searchPexels(query: string, count = 10): Promise<PexelsPhoto[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&size=medium`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY! } });
  if (!res.ok) {
    console.error(`   ⚠️  Pexels HTTP ${res.status} (query: "${query}")`);
    return [];
  }
  const json = (await res.json()) as PexelsSearchResponse;
  return json.photos ?? [];
}

// Pexels URL'ini temizleyip tam 1280x720 boyutlandırma parametreleri ekler.
// src.landscape'in mevcut ?w=1200&h=627 parametrelerini siler, sonra yenilerini ekler.
function resizePexels(photoUrl: string): string {
  const [base, query = ''] = photoUrl.split('?');
  const cleaned = query
    .split('&')
    .filter((p) => !/^(w|h|fit|crop|auto|cs)=/i.test(p))
    .join('&');
  const params = ['auto=compress', 'cs=tinysrgb', 'w=1280', 'h=720', 'fit=crop'];
  const sep = cleaned ? '&' : '';
  return `${base}?${params.join('&')}${sep}${cleaned}`;
}

// Slug'tan deterministik bir index üret → aynı haber hep aynı fotoğrafı seçer,
// ama farklı haberler aynı sonuç kümesinden farklı fotoğraflar alır.
function pickIndex(slug: string, length: number): number {
  if (length <= 1) return 0;
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h % length;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const { data, error } = await supabase
    .from('haberler')
    .select('id, slug, baslik, kategori, gorsel')
    .order('yayin_tarihi', { ascending: false });

  if (error) {
    console.error('❌ Liste alınamadı:', error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log('ℹ️  haberler tablosu boş.');
    return;
  }

  console.log(`📊 Toplam satır: ${data.length}\n`);

  let ok = 0;
  let fail = 0;
  let skipped = 0;

  for (const row of data) {
    const keyword = keywordFor(row.baslik, row.kategori);
    const photos = await searchPexels(keyword, 10);

    if (photos.length === 0) {
      console.log(`   ✗ ${row.slug}  (keyword: "${keyword}" — sonuç yok)`);
      fail++;
      await sleep(250);
      continue;
    }

    // Slug-hash ile deterministik seçim: aynı haber hep aynı fotoğrafı alır,
    // farklı haberler aynı sonuç kümesinden farklı fotoğraflar alır.
    const idx = pickIndex(row.slug, photos.length);
    const photo = photos[idx];

    const newUrl = resizePexels(photo.src.landscape);
    const credit = photo.photographer;

    const { error: updateError } = await supabase
      .from('haberler')
      .update({ gorsel: newUrl })
      .eq('id', row.id);

    if (updateError) {
      console.error(`   ✗ ${row.slug}  DB hata: ${updateError.message}`);
      fail++;
    } else {
      console.log(`   ✓ ${row.slug}  → "${keyword}" [${idx + 1}/${photos.length}] (📸 ${credit})`);
      ok++;
    }

    // Pexels rate limit'e saygı: ~150ms aralık
    await sleep(250);
  }

  console.log(`\n✅ Güncellendi: ${ok}`);
  console.log(`❌ Başarısız: ${fail}`);
  if (skipped > 0) console.log(`⏭️  Atlandı: ${skipped}`);
}

main().catch((e) => {
  console.error('💥 Beklenmeyen hata:', e);
  process.exit(1);
});
