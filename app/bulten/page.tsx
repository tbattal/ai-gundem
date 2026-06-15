import type { Metadata } from 'next';
import { BultenFormu } from '@/components/ui/BultenFormu';

export const metadata: Metadata = {
  title: 'Bülten',
  description:
    "AIGündem bülteni — haftanın yapay zekâ gündemi her cuma e-postanda. Reklamsız, izlemesiz, beş dakikada okunur.",
  alternates: { canonical: '/bulten' },
  robots: { index: true, follow: true },
};

const NE_ALIRSIN = [
  {
    no: '01',
    baslik: 'Haftanın manşetleri',
    aciklama:
      "5-8 en önemli yapay zekâ haberi, her biri kaynak bağlantısı ve tek cümlelik özetle.",
  },
  {
    no: '02',
    baslik: 'Kaçırmaman gereken',
    aciklama:
      "Yayınlanan bir makale, rapor veya röportaj. Editörün o hafta en çok durduğu iş.",
  },
  {
    no: '03',
    baslik: 'Araç ve model',
    aciklama:
      "Yeni çıkan veya güncellenen yapay zekâ ürünleri, kısa notla — ne işe yarar, kime hitap eder.",
  },
  {
    no: '04',
    baslik: 'Trend grafiği',
    aciklama:
      "Yedi günde en çok konuşulan konular, kelime bulutu yerine somut başlıklar halinde.",
  },
];

const ORNEK_BULTEN = {
  tarih: 'Cuma, 12 Haziran 2026',
  konu: "Yapay zekâ bu hafta: Gemini 3.5, AB düzenlemesi, Apple Intelligence",
  onizleme: 'Düzenleyici cephesinde önemli bir hafta geçirdik…',
  bolumler: [
    {
      baslik: 'Haftanın 6 manşeti',
      satirlar: [
        'Google, 4 kat daha hızlı metin üreten DiffusionGemma modelini yayınladı',
        'AB, genel amaçlı modeller için yeni şeffaflık yükümlülüklerini oylamaya sundu',
        'Apple, WWDC 2026 açılışında Apple Intelligence kapsamını 12 ülkeye genişletti',
        'Anthropic, Claude Opus 4.6 için kodlama performansında %14 artış açıkladı',
        'xAI, Grok 4\'ü açık kaynak lisansla yayınladı',
        'OpenAI, ChatGPT indirimlerini Asya-Pasifik bölgesinde başlattı',
      ],
    },
    {
      baslik: 'Kaçırmaman gereken',
      satirlar: [
        "MIT Technology Review: 'Modeller neden hâlâ halüsinasyon görüyor?' — 18 dk okuma",
      ],
    },
    {
      baslik: 'Yeni araçlar',
      satirlar: [
        'GitHub Copilot Workspace — tasarımdan PR\'a uçtan uca ajan',
        'Perplexity Comet — pasif tarayıcı asistanı (beta)',
        'ElevenLabs Sound Effects v3 — 30 saniyelik jenerikler',
      ],
    },
  ],
};

const SSS = [
  {
    soru: 'Abonelikten nasıl çıkarım?',
    cevap:
      "Her bülten e-postasının altındaki 'Abonelikten çık' bağlantısı tek tıkla çıkarır. Hesap oluşturmadığın için ek ayar yok.",
  },
  {
    soru: 'Verilerim ne oluyor?',
    cevap:
      "Sadece e-posta adresin (ve istersen ismin) saklanır. Hiçbir üçüncü tarafla paylaşılmaz, izleme pikseli yoktur, açılma oranı takip edilmez.",
  },
  {
    soru: 'Ne sıklıkla geliyor?',
    cevap:
      "Varsayılan: her cuma sabahı 09:00 (Türkiye saati). İstersen ayda bir özet seçebilirsin; ikisi de aynı içerik yoğunluğunda.",
  },
  {
    soru: 'Geçmiş bültenleri görebilir miyim?',
    cevap:
      "Tüm geçmiş sayılar arşivde tutuluyor; web sitesinin /arsiv bölümünden erişebilirsin.",
  },
  {
    soru: 'Reklam veya sponsorlu içerik var mı?',
    cevap:
      "Yok. Bülten bağımsız, reklamsız, sponsorluk içermez. Maliyet sunucu giderleriyle sınırlı.",
  },
];

export default function BultenPage() {
  return (
    <div className="container-site py-10 sm:py-14">
      {/* Hero — ortalanmış + inline form */}
      <section className="max-w-3xl mx-auto text-center pb-10 border-b border-rule">
        <span className="editorial-eyebrow">Bülten</span>
        <h1 className="mt-3 font-display text-display-lg sm:text-display-xl leading-[0.95] tracking-tight">
          Haftanın yapay zekâ gündemi,
          <br />
          <em className="text-olive">her cuma e-postanda.</em>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-ink-soft leading-relaxed">
          Editör masasından geçmiş, beş dakikada okunur bir özet. Reklamsız, izlemesiz, sadece
          metin. Abonelik ücretsiz, istediğin an çıkarsın.
        </p>

        <div className="mt-8 max-w-xl mx-auto text-left">
          <BultenFormu varyant="satir-ici" />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
          ~2.200 abone · Cuma 09:00 (UTC+3)
        </p>
      </section>

      {/* Ne alırsın */}
      <section className="py-12 border-b border-rule">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NE_ALIRSIN.map((item) => (
            <article key={item.no} className="border-t border-rule pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-olive">
                {item.no}
              </span>
              <h3 className="mt-2 font-display text-xl tracking-tight">{item.baslik}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{item.aciklama}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Örnek bülten — mockup email card */}
      <section className="py-12 border-b border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <span className="editorial-eyebrow">Geçmiş sayı</span>
          <div>
            <p className="text-ink-soft leading-relaxed max-w-prose mb-6">
              Geçen haftanın bülteninden bir kesit. Her sayı bu yapıda, 5-7 dakikada okunacak
              uzunlukta.
            </p>

            <article className="border border-rule rounded-sm bg-bone shadow-sm">
              <header className="px-6 pt-5 pb-3 border-b border-rule-soft">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
                  <span>AIGündem Bülten · {ORNEK_BULTEN.tarih}</span>
                  <span>Sayı #47</span>
                </div>
                <h3 className="mt-3 font-display text-xl tracking-tight leading-snug">
                  {ORNEK_BULTEN.konu}
                </h3>
                <p className="mt-1 text-sm text-ink-soft italic">{ORNEK_BULTEN.onizleme}</p>
              </header>

              <div className="px-6 py-5 space-y-5">
                {ORNEK_BULTEN.bolumler.map((bolum) => (
                  <div key={bolum.baslik}>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-olive mb-2">
                      {bolum.baslik}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-ink-soft">
                      {bolum.satirlar.map((satir, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-ink-mute select-none">→</span>
                          <span>{satir}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <footer className="px-6 py-3 border-t border-rule-soft font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute flex items-center justify-between">
                <span>AIGündem · aigundem.com</span>
                <span>Abonelikten çık</span>
              </footer>
            </article>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <span className="editorial-eyebrow">Sık sorulanlar</span>
          <dl className="space-y-6">
            {SSS.map((item) => (
              <div key={item.soru} className="border-b border-rule-soft pb-5 last:border-b-0">
                <dt className="font-display text-lg tracking-tight">{item.soru}</dt>
                <dd className="mt-2 text-sm text-ink-soft leading-relaxed max-w-prose">
                  {item.cevap}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
