import type { Metadata } from 'next';
import { IletisimFormu } from '@/components/ui/IletisimFormu';
import { generateCaptcha } from '@/lib/captcha';

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    "AIGündem ile iletişime geç. Genel sorular, basın talepleri, haber ipuçları ve düzeltme bildirimleri için kanallar.",
  alternates: { canonical: '/iletisim' },
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

const KANALLAR = [
  {
    baslik: 'Genel',
    email: 'merhaba@aigundem.com',
    aciklama: 'Editöryal sorular, geri bildirim, öneri ve şikayetler için.',
    beklenen: '1-2 iş günü',
  },
  {
    baslik: 'Basın',
    email: 'basin@aigundem.com',
    aciklama: 'Röportaj talepleri, medya iş birlikleri ve basın bültenleri için.',
    beklenen: '2-3 iş günü',
  },
  {
    baslik: 'İpucu',
    email: 'ipucu@aigundem.com',
    aciklama: 'Henüz yayınlanmamış bir gelişmeyi bildirmek veya kaynak göstermek için.',
    beklenen: 'Gizli · 24 saat',
  },
];

export default function IletisimPage() {
  const captcha = generateCaptcha();
  return (
    <div className="container-site py-10 sm:py-14">
      {/* Hero */}
      <section className="pb-10 border-b border-rule">
        <span className="editorial-eyebrow">İletişim</span>
        <h1 className="mt-3 font-display text-display-lg sm:text-display-xl leading-[0.95] tracking-tight">
          Bir haber mi var?
          <br />
          <em className="text-olive">Yaz, ulaşsın.</em>
        </h1>
        <p className="mt-5 max-w-prose text-base sm:text-lg text-ink-soft leading-relaxed">
          Editöryal sorular, basın talepleri, henüz yayınlanmamış gelişmeler veya bir hatayı
          bildirmek istediğinde aşağıdaki kanalları ya da formu kullanabilirsin. Tüm mesajlar
          okunur; her birine dönüş yapılır.
        </p>
      </section>

      {/* İki sütun: kanallar + form */}
      <section className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-14 py-12">
        {/* Sol sütun — kanallar */}
        <div>
          <span className="editorial-eyebrow">Kanallar</span>
          <ul className="mt-4 space-y-6">
            {KANALLAR.map((k) => (
              <li key={k.baslik} className="border-l-2 border-rule pl-4">
                <h3 className="font-display text-xl">{k.baslik}</h3>
                <a
                  href={`mailto:${k.email}`}
                  className="mt-1 inline-block font-mono text-sm text-olive hover:text-ink transition-colors"
                >
                  {k.email}
                </a>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{k.aciklama}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
                  Dönüş: {k.beklenen}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 pt-6 border-t border-rule-soft">
            <span className="editorial-eyebrow">Ofis</span>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              Uzaktan çalışma yapısı. Basın toplantıları ve röportajlar için yalnızca online
              görüşme kabul edilir.
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
              Türkiye · UTC+3
            </p>
          </div>
        </div>

        {/* Sağ sütun — form */}
        <div>
          <span className="editorial-eyebrow">Mesaj gönder</span>
          <p className="mt-3 text-sm text-ink-soft max-w-prose leading-relaxed">
            Aşağıdaki form doğrudan editör masasına iletilir. Gizli kalmasını istediğin bir konu
            varsa, İpucu kanalını e-posta ile tercih et.
          </p>

          <div className="mt-6">
            <IletisimFormu captchaProblem={captcha.problem} captchaToken={captcha.token} />
          </div>
        </div>
      </section>

      {/* Düzeltme bandı */}
      <section className="border border-rule rounded-sm bg-paper-2/40">
        <div className="px-6 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <span className="editorial-eyebrow">Düzeltme</span>
            <p className="mt-1 text-sm text-ink-soft max-w-prose">
              Yayınlanan bir haberde hata, eksik bilgi veya yanlış atıf fark ettiysen, haberin
              altındaki <em>Düzeltme Bildir</em> bağlantısını ya da yukarıdaki formu kullan.
            </p>
          </div>
          <a
            href="mailto:duzeltme@aigundem.com?subject=D%C3%BCzeltme%20bildirimi"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 border border-rule text-ink rounded-sm hover:bg-paper-3 transition-colors whitespace-nowrap"
          >
            duzeltme@aigundem.com
          </a>
        </div>
      </section>
    </div>
  );
}
