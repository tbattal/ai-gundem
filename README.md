# AIGündem

Türkiye'nin yapay zekâ haber merkezi. Büyük dil modellerinden araçlara, araştırmalardan robotiğe, politikadan etiğe kadar yapay zekânın gündemini tek bir yerde toplayan, manuel seçimle derlenmiş bir Next.js uygulaması.

## Stack

- **Next.js 14** (App Router, ISR, Server Actions)
- **TypeScript** (strict mode)
- **Tailwind CSS** (özel tasarım tokenları: paper, ink, olive, coral)
- **Supabase** (PostgreSQL, RLS)
- **Resend** (bülten onay mailleri)

## Yerel kurulum

```bash
# 1) Bağımlılıklar
npm install

# 2) Ortam değişkenleri
cp .env.example .env.local
# .env.local'u gerçek değerlerle doldur

# 3) Supabase migration'ları (Studio → SQL Editor'da sırayla çalıştır)
#   supabase/migrations/001_initial_schema.sql
#   supabase/migrations/002_iletisim_table.sql
#   supabase/migrations/003_bulten_aboneleri.sql

# 4) Geliştirme sunucusu
npm run dev
# http://localhost:3000
```

## Veritabanı şeması

| Tablo | Amaç | RLS |
|------|------|-----|
| `haberler` | Ana içerik | Herkes okur, service_role yazar |
| `iletisim` | İletişim formu mesajları | Sadece service_role |
| `bulten_aboneleri` | Bülten aboneleri, çift onay | Sadece service_role |

## Ortam değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (istemci) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (sunucu, RLS bypass) |
| `SUPABASE_DB_PASSWORD` | DB parola (migration script'leri) |
| `DATABASE_URL` | PostgreSQL bağlantı string'i |
| `NEXT_PUBLIC_SITE_URL` | Public site URL'i (canonical, mail linkleri) |
| `NEXT_PUBLIC_SITE_NAME` | Site adı (metadata) |
| `CAPTCHA_SECRET` | İletişim formu HMAC captcha anahtarı (32+ hex) |
| `RESEND_API_KEY` | Resend API anahtarı |
| `RESEND_FROM_EMAIL` | Gönderici adresi (örn. `AIGündem <bulten@aigundem.com>`) |

`CAPTCHA_SECRET` üretmek için: `openssl rand -hex 32`

## Script'ler

```bash
npm run dev              # Geliştirme sunucusu
npm run build            # Production build
npm run start            # Production sunucu
npm run lint             # ESLint
npm run typecheck        # TypeScript
npm run db:seed          # 12 örnek haber
npm run db:seed:webtekno # 52 Webtekno haberi (mevcut verileri siler)
```

## Deploy (Netlify)

`netlify.toml` ve `@netlify/plugin-nextjs` dahil. Netlify UI'da:

1. **Add new site** → **Import from GitHub** → repo seç
2. Build ayarları otomatik (`netlify.toml`'dan)
3. **Environment variables**: `.env.local`'daki tüm değerleri ekle
4. **Trigger deploy** → **Deploy site**

## Sayfalar

- `/` — Ana sayfa (manşet + son haberler grid)
- `/haber/[slug]` — Haber detay
- `/kategori/[kategori]` — Kategori listesi
- `/arama` — Arama sonuçları
- `/hakkinda` — Hakkında
- `/iletisim` — İletişim (HMAC captcha korumalı)
- `/bulten` — Bülten (çift onay)
- `/bulten/onayla` — Onay token doğrulama
- `/rss.xml` — RSS beslemesi
- `/sitemap.xml` — SEO site haritası
- `/api/haberler` — Haber listesi API

## Tasarım

- **Renkler**: paper (#f6f3ec), ink (#131313), olive (#218c00), coral (#63fe13)
- **Fontlar**: Instrument Serif (başlık), Inter (gövde), JetBrains Mono (meta)
- **Layout**: 1280px max, sticky header, editorial grid

## Lisans

MIT
