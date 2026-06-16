# `haberler` Tablosu — Yapısal Doküman

> AIGündem'in ana içerik tablosu. Tüm yapay zekâ haberleri burada tutulur, uygulama
> tamamen RLS üzerinden `anon` rolüyle okur, yazma sadece `service_role` ile yapılır.

**Son güncelleme:** 2026-06-16 · Migration: `001_initial_schema.sql`

---

## 1. Amaç

`/`, `/haber/[slug]`, `/kategori/[kategori]`, `/arama`, `/rss.xml` gibi tüm
okuma-yoğunluklu yüzeylerin veri kaynağı. Editöryal seçimle derlenmiş
(manuel eklenen / RSS / scraper), kaynak gösterilen haberler.

---

## 2. Sütunlar

| # | Sütun            | Tip             | NULL?  | Varsayılan                          | Açıklama |
|---|------------------|-----------------|--------|--------------------------------------|----------|
| 1 | `id`             | `uuid`          | NOT NULL | `gen_random_uuid()`                | Birincil anahtar |
| 2 | `slug`           | `text`          | NOT NULL | —                                 | URL-safe benzersiz tanımlayıcı (Türkçe → ASCII slugify) |
| 3 | `baslik`         | `text`          | NOT NULL | —                                 | Haber başlığı |
| 4 | `ozet`           | `text`          | NOT NULL | —                                 | Liste/kart görünümü için kısa özet |
| 5 | `icerik`         | `text`          | NULL    | —                                 | Tam metin (HTML temizlenmiş, opsiyonel) |
| 6 | `gorsel`         | `text`          | NOT NULL | —                                 | HTTPS ile başlayan kapak görseli URL'i |
| 7 | `kaynak_ad`      | `text`          | NOT NULL | —                                 | Yayıncı adı (ör. "Webtekno") |
| 8 | `kaynak_url`     | `text`          | NOT NULL | —                                 | Yayıncı ana sayfa URL'i |
| 9 | `kaynak_logo`    | `text`          | NULL    | —                                 | Yayıncı logo URL'i (opsiyonel) |
| 10| `yazar`          | `text`          | NULL    | —                                 | Yazar adı (bilinmiyorsa `null`) |
| 11| `kategori`       | `text`          | NOT NULL | —                                 | CHECK constraint ile sınırlı (aşağıya bak) |
| 12| `etiketler`      | `text[]`        | NOT NULL | `'{}'`                             | Etiket dizisi (şu an tüm satırlarda boş) |
| 13| `yayin_tarihi`   | `timestamptz`   | NOT NULL | —                                 | Orijinal yayın tarihi (UTC, kaynaktan geldiği gibi) |
| 14| `okuma_suresi`   | `int`           | NOT NULL | `3`                                | CHECK: `> 0`. Dakika cinsinden tahmini okuma süresi |
| 15| `orijinal_url`   | `text`          | NOT NULL | —                                 | Kaynaktaki orijinal haber linki |
| 16| `one_cikan`      | `boolean`       | NOT NULL | `false`                            | Manşet bayrağı (anasayfada üstte gösterilir) |
| 17| `created_at`     | `timestamptz`   | NOT NULL | `now()`                            | DB'ye ilk yazılma zamanı |
| 18| `updated_at`     | `timestamptz`   | NOT NULL | `now()` + trigger                  | `BEFORE UPDATE` trigger'ı ile otomatik güncellenir |

---

## 3. Kısıtlamalar

### Birincil anahtar
```sql
PRIMARY KEY (id)
```

### Benzersizlik
```sql
UNIQUE (slug)
```

### CHECK constraint — `kategori`
Enum yerine esnek CHECK tercih edildi (yeni kategori eklemek kolay olsun):

```sql
CHECK (kategori IN (
  'buyuk-dil-modelleri',
  'arastirma',
  'araclar',
  'robotik',
  'politika-etik',
  'is-dunyasi',
  'acik-kaynak'
))
```

Geçerli değerler ve insan-okunabilir karşılıkları `lib/kategoriler.ts`'te tutulur.

### CHECK constraint — `okuma_suresi`
```sql
CHECK (okuma_suresi > 0)
```

### NOT NULL
`icerik`, `yazar`, `kaynak_logo` dışındaki tüm sütunlar zorunlu.

---

## 4. Index'ler

| Index adı                       | Tip              | Sütun(lar)                              | Koşul       | Amaç |
|---------------------------------|------------------|------------------------------------------|-------------|------|
| `haberler_pkey`                 | btree            | `id`                                     | —           | PK |
| `haberler_slug_key`             | btree (unique)   | `slug`                                   | —           | Slug lookup |
| `idx_haberler_yayin_tarihi`     | btree            | `yayin_tarihi DESC`                      | —           | Tarih sıralı listeleme (varsayılan sorgu) |
| `idx_haberler_kategori`         | btree            | `kategori, yayin_tarihi DESC`            | —           | Kategori sayfası filtreleme |
| `idx_haberler_one_cikan`        | btree (kısmi)    | `yayin_tarihi DESC`                      | `one_cikan = true` | Manşet sorgusu (kısmi index, sadece true satırlar) |
| `idx_haberler_baslik_trgm`      | gin              | `baslik gin_trgm_ops`                    | —           | Başlıkta Türkçe arama (pg_trgm uzantısı) |
| `idx_haberler_ozet_trgm`        | gin              | `ozet gin_trgm_ops`                      | —           | Özette Türkçe arama |

`pg_trgm` uzantısı migration içinde `create extension if not exists pg_trgm` ile
garanti edilir; trigram index'ler Türkçe arama için gerekli.

---

## 5. Trigger'lar

### `set_updated_at()` — `BEFORE UPDATE`

```sql
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

| Trigger adı                | Zaman          | Olay     | Tablo       |
|----------------------------|----------------|----------|-------------|
| `trg_haberler_updated_at`  | `BEFORE`       | `UPDATE` | `haberler`  |

`update` çağrılarında `updated_at` alanını otomatik olarak `now()` yapar.
Uygulama kodu elle set etmek zorunda değil.

---

## 6. Row Level Security

```sql
ALTER TABLE haberler ENABLE ROW LEVEL SECURITY;
```

| Policy adı              | Rol(ler)            | Komut    | Koşul     |
|-------------------------|---------------------|----------|-----------|
| `haberler_select_all`   | `anon`, `authenticated` | `SELECT` | `true` (herkes) |

- **Okuma:** Anonim + authenticated herkese açık.
- **Yazma (INSERT/UPDATE/DELETE):** Policy tanımlı değil → `anon` ve `authenticated`
  için kapalı. Sadece `SUPABASE_SERVICE_ROLE_KEY` ile bağlanan admin client
  (`lib/supabase-admin.ts`) bypass edebilir.
- Bu sayede tüm yazma işlemleri uygulama sunucusunda (API route veya server
  action) zorunlu kalır.

---

## 7. Mevcut Veri Durumu (2026-06-16 itibarıyla)

**Toplam satır:** 50 (tümü `seed-50.ts` ile Webtekno CSV'sinden yüklendi)

### Kaynak dağılımı
| Kaynak adı | Satır |
|------------|-------|
| Webtekno   | 50    |

### Kategori dağılımı
| Kategori                  | Satır | Oran  |
|---------------------------|-------|-------|
| `buyuk-dil-modelleri`     | 25    | %50   |
| `is-dunyasi`              | 18    | %36   |
| `politika-etik`           | 3     | %6    |
| `arastirma`               | 2     | %4    |
| `robotik`                 | 2     | %4    |
| `araclar`                 | 0     | %0 ⚠️ |
| `acik-kaynak`             | 0     | %0 ⚠️ |

> ⚠️ `araclar` ve `acik-kaynak` kategorileri boş. `seed-50.ts`'teki
> `tespitKategori` fonksiyonu bu kategorilere düşen anahtar kelimeler
> Webtekno veri setinde hiç geçmediği için bu kategorilerde haber yok.

### Manşet haberler (`one_cikan = true`, 3 satır)
1. 2026-06-11 — *ChatGPT Kullanıcıları Müjde: Yakında Fiyatlara İndirim Gelebilir!*
2. 2026-06-11 — *Google, 4 Kat Daha Hızlı Metin Üreten Yeni Modeli DiffusionGemma'yı Tanıttı*
3. 2026-06-11 — *Dünya Kupası Heyecanınızı Yansıtmanın Yeni Yolu: #MessiMode Akımıyla Saçlarınızı Boyayın!*

### Etiket durumu
Tüm 50 satırda `etiketler = '{}'` (boş dizi). `seed-50.ts:161` etiketleri
bilinçli olarak boş bırakıyor; ileride kategori bazlı otomatik etiketleme
veya manuel etiket ataması eklenebilir.

---

## 8. Örnek Satır

`ORDER BY yayin_tarihi DESC LIMIT 1` ile çekilen gerçek bir kayıt:

```json
{
  "id": "8d1d2fb0-5423-4293-a6d1-cfa126ae6e24",
  "slug": "chatgpt-kullanicilari-mujde-yakinda-fiyatlara-i-ndirim-gelebilir-218262",
  "baslik": "ChatGPT Kullanıcıları Müjde: Yakında Fiyatlara İndirim Gelebilir!",
  "ozet": "İddialara göre OpenAI, rakiplerinin bulunduğu ortamda rekabetçi olmaya devam edebilmek için fiyatlarında indirime gidecek.",
  "icerik": "HaberlerWebteknoYapay Zekâ Haberleri ve İçerikleri... (HTML temizlenmiş tam metin)",
  "gorsel": "https://imgrosetta.webtekno.com/file/666348/666348-1280x720.jpg",
  "kaynak_ad": "Webtekno",
  "kaynak_url": "https://www.webtekno.com",
  "kaynak_logo": "https://www.webtekno.com/assets/img/logo.svg",
  "yazar": "Barış Bulut",
  "kategori": "buyuk-dil-modelleri",
  "etiketler": [],
  "yayin_tarihi": "2026-06-11T10:15:28+00:00",
  "okuma_suresi": 2,
  "orijinal_url": "https://www.webtekno.com/chatgpt-fiyatlara-indirim-gelebilir-h218262.html",
  "one_cikan": true,
  "created_at": "2026-06-16T18:01:10.000007+00:00",
  "updated_at": "2026-06-16T18:01:10.000007+00:00"
}
```

---

## 9. Uygulama Katmanıyla İlişki

| Sorumlu dosya                          | Sorgu / Kullanım |
|----------------------------------------|------------------|
| `lib/supabase.ts:28-52`                | `getHaberler({ limit, kategori, oneCikan })` — ana listeleme |
| `lib/supabase.ts:54-66`                | `getHaberBySlug(slug)` — detay sayfası |
| `lib/supabase.ts:68-82`                | `getManset()` — manşet (one_cikan=true, limit 1) |
| `lib/supabase.ts:84-95`                | `getTumSluglar()` — sitemap için tüm slug'lar |
| `lib/supabase.ts:97-106`               | `getHaberSayisi(kategori?)` — sayaç |
| `lib/supabase-admin.ts`                | service_role client (server-only) — yazma işlemleri |
| `types/haber.ts:16-35`                 | `Haber` interface (TS tip tanımı) |
| `types/haber.ts:37-49`                 | `HaberListItem` interface (liste için alt küme) |
| `app/page.tsx`                         | `getManset()` + `getHaberler({ limit: 13 })` |
| `app/haber/[slug]/page.tsx`            | `getHaberBySlug(params.slug)` |
| `app/kategori/[kategori]/page.tsx`     | `getHaberler({ kategori })` + `getHaberSayisi(kategori)` |
| `app/api/haberler/route.ts`            | JSON API (cache headers ile) |
| `app/rss.xml/route.ts`                 | RSS feed |
| `app/sitemap.ts`                       | `getTumSluglar()` → sitemap URL'leri |

### SELECT kalıpları

Liste sorgusu (`HaberListItem`):
```sql
SELECT id, slug, baslik, ozet, gorsel,
       kaynak_ad, kategori, etiketler,
       yayin_tarihi, okuma_suresi, one_cikan
FROM   haberler
ORDER  BY yayin_tarihi DESC
LIMIT  30;
```

Detay sorgusu (`Haber`):
```sql
SELECT id, slug, baslik, ozet, icerik, gorsel,
       kaynak_ad, kaynak_url, kaynak_logo, yazar,
       kategori, etiketler, yayin_tarihi, okuma_suresi,
       orijinal_url, one_cikan, created_at, updated_at
FROM   haberler
WHERE  slug = $1
LIMIT  1;
```

---

## 10. Bilinen Tasarım Kararları

- **Enum yerine CHECK** — Yeni kategori eklemek tek satır migration gerektirir,
  uygulama kodu (`lib/kategoriler.ts`) güncellenmeli.
- **`pg_trgm` ile Türkçe arama** — `to_tsvector` Türkçe sözlük desteği zayıf
  olduğu için trigram benzerliği tercih edildi.
- **`updated_at` trigger'ı** — Uygulama kodunda manuel `set` çağrısı yok;
  DB seviyesinde garantili.
- **Yazma sadece service_role** — Public route'lardan INSERT/UPDATE/DELETE
  yapılamaz; yalnızca `lib/supabase-admin.ts` üzerinden mümkün. Bu sayede
  spam ve manipülasyon riski ortadan kalkar.
- **`orijinal_url` zorunlu** — Her haber için kaynak bağlantısı tutulur
  (etik/gazetecilik standardı, içerik attribution).

---

## 11. On-Demand Revalidation (ISR)

DB güncellendikten sonra Netlify ISR cache'ini invalidate etmek için
`/api/revalidate` endpoint'i kullanılır. Sayfa `revalidate` süreleri dolmadan
değişikliklerin yansımasını sağlar.

### Akış
```
DB güncelleme scripti (fix-gorsel-pexels.ts vb.)
  └─→ fetch POST https://site/api/revalidate?secret=...
        └─→ Next.js revalidatePath() / revalidateTag() çağrısı
              └─→ Sonraki istek fresh render
```

### Endpoint

`app/api/revalidate/route.ts` (POST)

| Parametre     | Tip       | Açıklama |
|---------------|-----------|----------|
| `?secret=`    | query     | `REVALIDATE_SECRET` env ile karşılaştırılır |
| `body.all`    | bool      | Tüm ana yüzeyler (`/`, `/arsiv`, tüm `/haber/[slug]`, tüm `/kategori/[kategori]`) |
| `body.paths`  | string[]  | Belirli yollar (örn. `["/", "/haber/some-slug"]`) |
| `body.tags`   | string[]  | Next.js cache tag (ileride kullanım için) |

401 → secret yanlış; 503 → `REVALIDATE_SECRET` env tanımlı değil.

### Script

```bash
# Tüm ana yüzeyleri revalidate et (DB değişikliği sonrası default)
npx tsx scripts/revalidate.ts

# Sadece belirli yolları revalidate et
npx tsx scripts/revalidate.ts --paths=/,/arsiv

# Veritabanındaki tüm haberleri/kategorileri revalidate et
npx tsx scripts/revalidate.ts --all-slugs

# Network çağrısı atma, sadece body'yi gör
npx tsx scripts/revalidate.ts --dry-run
```

### Otomatik tetikleme

`fix-gorsel-pexels.ts` ve `fix-gorsel-picsum.ts` scriptleri başarılı güncelleme
sonrası otomatik olarak `triggerRevalidate()` çağırır (yukarıdaki `{all:true}`
gövdesiyle).

### Production kurulumu

Netlify'da `REVALIDATE_SECRET` env değişkeni tanımlı OLMALIDIR:
1. https://app.netlify.com → site → **Site settings** → **Environment variables**
2. **Add a variable** → `REVALIDATE_SECRET` = `<32-byte hex>` (örn. `openssl rand -hex 32`)
3. Save → bir sonraki deploy'da aktif olur

Yoksa endpoint 503 döner.

---

## 12. İlgili Dosyalar

- `supabase/migrations/001_initial_schema.sql` — Tablo DDL
- `supabase/seed.sql` — Örnek veri (Studio'dan çalıştırılabilir)
- `lib/supabase.ts` — Anon client + okuma sorguları
- `lib/supabase-admin.ts` — Service role client (yazma)
- `types/haber.ts` — TypeScript tipleri
- `scripts/seed.ts` — 12 örnek haber
- `scripts/seed-webtekno.ts` — 52 Webtekno haberi (eskileri siler)
- `scripts/seed-50.ts` — 50 Webtekno haberi (CSV tabanlı, test insert'li)
- `scripts/seed-tr-yapay-zeka.ts` — 50 Türkçe AI haberi (senkretik içerik)
- `scripts/fix-gorsel-picsum.ts` — Görselleri Picsum'a günceller
- `scripts/fix-gorsel-pexels.ts` — Görselleri Pexels'ten alakalı fotoğrafla günceller
- `scripts/revalidate.ts` — On-demand ISR revalidation tetikleyici
- `scripts/migrate.ts` — `pg` üzerinden migration çalıştırıcı
- `app/api/revalidate/route.ts` — On-demand revalidation HTTP endpoint
