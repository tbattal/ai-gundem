/**
 * webtekno_yapay_zeka.csv dosyasını parse edip
 * mevcut şemamıza (haberler tablosu) dönüştürür.
 *
 * CSV sütunları: id, title, url, description, content, author, date, image
 * Bizim şemamız: slug, baslik, ozet, icerik, gorsel, kaynak_ad, kaynak_url,
 *                kaynak_logo, yazar, kategori, etiketler, yayin_tarihi,
 *                okuma_suresi, orijinal_url, one_cikan
 */
import { config as loadEnv } from 'dotenv';
import { readFile } from 'node:fs/promises';

loadEnv({ path: '.env.local' });
loadEnv();

const CSV_PATH = 'C:/Users/user/Desktop/claudesignweb/webtekno_yapay_zeka.csv';

function parseCsv(text: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const headers: string[] = [];
  let i = 0;
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

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
        if (headers.length === 0) {
          headers.push(...row);
        } else {
          const obj: Record<string, string> = {};
          for (let k = 0; k < headers.length; k++) obj[headers[k]] = row[k] ?? '';
          rows.push(obj);
        }
      }
      row = []; i++; continue;
    }
    field += c; i++;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    if (headers.length > 0) {
      const obj: Record<string, string> = {};
      for (let k = 0; k < headers.length; k++) obj[headers[k]] = row[k] ?? '';
      rows.push(obj);
    }
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

function parseAuthor(raw: string): { yazar: string; unvan: string | null } {
  if (!raw) return { yazar: '', unvan: null };
  // "Barış Bulut /Editor"  veya  "Sponsorlu İçerik /22.05.2026 17:07"
  const slash = raw.indexOf('/');
  if (slash < 0) return { yazar: raw.trim(), unvan: null };
  const left = raw.slice(0, slash).trim();
  const right = raw.slice(slash + 1).trim();
  if (/^\d{2}\.\d{2}\.\d{4}/.test(right)) {
    return { yazar: left, unvan: null };
  }
  return { yazar: left, unvan: right };
}

function estimateOkumaSuresi(content: string, description: string): number {
  const text = (content || description || '').replace(/\s+/g, ' ').trim();
  if (!text) return 3;
  const words = text.split(' ').length;
  // Türkçe ortalama okuma hızı: ~200 kelime/dakika
  return Math.max(2, Math.min(15, Math.round(words / 180)));
}

interface Mapped {
  csvId: string;
  csvDate: string;
  baslik: string;
  slug: string;
  orijinal_url: string;
  ozet: string;
  icerik: string;
  gorsel: string;
  yazar: string | null;
  yazar_unvan: string | null;
  yayin_tarihi: string;
  okuma_suresi: number;
  // Eksik alanlar:
  kategori: null;
  etiketler: null;
  one_cikan: null;
  kaynak_logo: null;
}

async function main() {
  const text = await readFile(CSV_PATH, 'utf8');
  const rows = parseCsv(text);
  console.log(`📊 Toplam satır: ${rows.length}\n`);

  // Şemamıza map et
  const mapped: Mapped[] = rows.map((r) => {
    const { yazar, unvan } = parseAuthor(r.author || '');
    return {
      csvId: r.id,
      csvDate: r.date,
      baslik: r.title || '',
      slug: slugifyTr(r.title || ''),
      orijinal_url: r.url || '',
      ozet: r.description || '',
      icerik: r.content || '',
      gorsel: r.image || '',
      yazar: yazar || null,
      yazar_unvan: unvan,
      yayin_tarihi: r.date || '',
      okuma_suresi: estimateOkumaSuresi(r.content || '', r.description || ''),
      kategori: null,
      etiketler: null,
      one_cikan: null,
      kaynak_logo: null,
    };
  });

  // Boş slug kontrolü
  const bosSlug = mapped.filter((m) => !m.slug);
  if (bosSlug.length) {
    console.log('⚠️  Boş slug üreten satırlar:');
    bosSlug.forEach((m) => console.log(`  - id=${m.csvId} başlık="${m.baslik.slice(0, 50)}"`));
  }

  // Tarih kontrolü
  const gecersizTarih = mapped.filter((m) => isNaN(Date.parse(m.yayin_tarihi)));
  if (gecersizTarih.length) {
    console.log('\n⚠️  Geçersiz tarih içeren satırlar:');
    gecersizTarih.forEach((m) => console.log(`  - id=${m.csvId} tarih="${m.yayin_tarihi}"`));
  }

  // Görsel URL kontrolü
  const gorselsiz = mapped.filter((m) => !m.gorsel);
  if (gorselsiz.length) {
    console.log('\n⚠️  Görselsiz satırlar:');
    gorselsiz.forEach((m) => console.log(`  - id=${m.csvId} başlık="${m.baslik.slice(0, 50)}"`));
  }

  // Yazara göre dağılım
  const yazarDagilim = new Map<string, number>();
  mapped.forEach((m) => {
    const key = m.yazar || '(yok)';
    yazarDagilim.set(key, (yazarDagilim.get(key) || 0) + 1);
  });
  console.log('\n👤 Yazar dağılımı:');
  [...yazarDagilim.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  ${v}× ${k}`));

  // İlk 3 örneği göster
  console.log('\n📰 İlk 3 satır (dönüştürülmüş):');
  mapped.slice(0, 3).forEach((m, i) => {
    console.log(`\n--- [${i + 1}] id=${m.csvId} ---`);
    console.log(`  baslik: ${m.baslik}`);
    console.log(`  slug:   ${m.slug}`);
    console.log(`  url:    ${m.orijinal_url}`);
    console.log(`  tarih:  ${m.yayin_tarihi}`);
    console.log(`  yazar:  ${m.yazar}${m.yazar_unvan ? ` (${m.yazar_unvan})` : ''}`);
    console.log(`  gorsel: ${m.gorsel.slice(0, 80)}...`);
    console.log(`  okuma:  ${m.okuma_suresi} dk`);
    console.log(`  ozet (ilk 100): ${m.ozet.slice(0, 100)}...`);
    console.log(`  icerik uzunluk: ${m.icerik.length} karakter`);
  });

  // Özet rapor — EKSİK ALANLAR
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log("  EKSİK ALANLAR (şemamızda olan ama CSV'de olmayan)");
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('CSV sütunları:');
  console.log('  ✓ id, title, url, description, content, author, date, image\n');
  console.log("Şemamızda olup CSV'de OLMAYAN alanlar:");
  console.log("  ✗ slug        → title'dan otomatik üretildi (slugifyTr)");
  console.log('  ✗ kaynak_ad   → sabit: "Webtekno"');
  console.log('  ✗ kaynak_url  → sabit: "https://www.webtekno.com"');
  console.log('  ✗ kaynak_logo → null bırakıldı (logo yok)');
  console.log("  ✗ kategori    → CSV'de YOK → \"?\" (senden değer bekliyorum)");
  console.log("  ✗ etiketler   → CSV'de YOK → \"?\" (senden değer bekliyorum)");
  console.log('  ✗ okuma_suresi→ içerik uzunluğundan otomatik hesaplandı');
  console.log("  ✗ one_cikan   → CSV'de YOK → \"?\" (senden değer bekliyorum)\n");

  // Kategori dağılımı önerisi (içerikten ipucu)
  const kategoriOneriler = new Map<string, number>();
  for (const m of mapped) {
    const baslik = m.baslik.toLowerCase();
    if (/claude|chatgpt|gpt|gemma|gemini|llm|deepseek|model/.test(baslik)) {
      kategoriOneriler.set('buyuk-dil-modelleri', (kategoriOneriler.get('buyuk-dil-modelleri') || 0) + 1);
    } else if (/robot|nvidia|cosmos|isaac/.test(baslik)) {
      kategoriOneriler.set('robotik', (kategoriOneriler.get('robotik') || 0) + 1);
    } else if (/siri|apple|google|android|yatırım|şirket|spotify|microsoft/.test(baslik)) {
      kategoriOneriler.set('is-dunyasi', (kategoriOneriler.get('is-dunyasi') || 0) + 1);
    } else if (/güvenlik|avrupa|dma|düzenleme|yasak|sızıntı|mahkeme|etik/.test(baslik)) {
      kategoriOneriler.set('politika-etik', (kategoriOneriler.get('politika-etik') || 0) + 1);
    } else if (/araştırma|alphafold|matematik|protein|bilim/.test(baslik)) {
      kategoriOneriler.set('arastirma', (kategoriOneriler.get('arastirma') || 0) + 1);
    } else if (/araç|uygulama|prompt|capcut|elevenlabs|scout|pics|spark/.test(baslik)) {
      kategoriOneriler.set('araclar', (kategoriOneriler.get('araclar') || 0) + 1);
    } else if (/açık kaynak|open source|gemma 4/.test(baslik)) {
      kategoriOneriler.set('acik-kaynak', (kategoriOneriler.get('acik-kaynak') || 0) + 1);
    }
  }
  console.log('💡 Başlıktan otomatik tespit edilen kategori dağılımı:');
  [...kategoriOneriler.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  ${v}× ${k}`));
  const tespitEdilemeyen = mapped.length - [...kategoriOneriler.values()].reduce((a, b) => a + b, 0);
  if (tespitEdilemeyen > 0) {
    console.log(`  ${tespitEdilemeyen}× (otomatik tespit edilemedi — elle ataman gerekecek)`);
  }

  // TS dosyası olarak da yazdır
  console.log('\n\n📝 Tüm veriyi seed için bir TS dosyasına yazıyorum...');
  const tsContent = `// Otomatik üretildi: webtekno_yapay_zeka.csv → ai-gundem şeması
// Tarih: ${new Date().toISOString()}
// Toplam: ${mapped.length} satır

import type { Kategori } from './types/haber';

export interface WebteknoRow {
  csvId: string;
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string;
  gorsel: string;
  yazar: string | null;
  yazar_unvan: string | null;
  yayin_tarihi: string;
  okuma_suresi: number;
  orijinal_url: string;
  // AŞAĞIDAKİ ALANLAR KULLANICI TARAFINDAN DOLDURULACAK:
  kategori: Kategori | null;       // ❓ TODO: ata
  etiketler: string[] | null;      // ❓ TODO: ata
  one_cikan: boolean | null;       // ❓ TODO: ata
}

export const KAYNAK_AD = 'Webtekno';
export const KAYNAK_URL = 'https://www.webtekno.com';

export const webteknoData: WebteknoRow[] = ${JSON.stringify(mapped, null, 2)};
`;
  const { writeFile } = await import('node:fs/promises');
  await writeFile('webtekno-mapped.ts', tsContent, 'utf8');
  console.log('✅ webtekno-mapped.ts oluşturuldu (proje kökünde).');
}

main().catch((err) => { console.error('❌ Hata:', err); process.exit(1); });
