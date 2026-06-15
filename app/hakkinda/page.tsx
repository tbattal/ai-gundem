import Link from 'next/link';
import type { Metadata } from 'next';
import { KATEGORI_LISTESI } from '@/lib/kategoriler';
import { kategoriIdToSlug } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Hakkında',
  description:
    "AIGündem, Türkiye'nin yapay zekâ haber merkezi. Misyonumuz, çalışma ilkelerimiz ve editöryal yaklaşımımız.",
  alternates: { canonical: '/hakkinda' },
};

const KAYNAKLAR = [
  { ad: 'Webtekno', url: 'https://www.webtekno.com' },
  { ad: 'TechCrunch', url: 'https://techcrunch.com' },
  { ad: 'The Verge', url: 'https://www.theverge.com' },
  { ad: 'MIT Technology Review', url: 'https://www.technologyreview.com' },
  { ad: 'Wired', url: 'https://www.wired.com' },
  { ad: 'VentureBeat', url: 'https://venturebeat.com' },
  { ad: 'Nature', url: 'https://www.nature.com' },
];

const ILKELER = [
  {
    baslik: 'Kaynak göster',
    aciklama:
      'Her haber, okunduğu kaynağa ait ad ve orijinal URL ile yayınlanır. Alıntı ve özetleme sınırları açıktır.',
  },
  {
    baslik: 'Tarih ve saat ver',
    aciklama:
      'Yayın tarihi, kaynağın orijinal saati temel alınarak gösterilir. Eskiyen haberler arşive düşer, kaldırılmaz.',
  },
  {
    baslik: 'Yorum katma',
    aciklama:
      "Editöryal yorum katmıyor, yalnızca bağlam sağlıyoruz. Spekülatif başlık ve özetlerden kaçınıyoruz.",
  },
  {
    baslik: 'Erişilebilir yayınla',
    aciklama:
      'Sayfa yapısı ekran okuyucu uyumlu; fontlar sistem genelinde okunabilir, hareket azaltılabilir.',
  },
];

export default function HakkindaPage() {
  return (
    <div className="container-site py-10 sm:py-14">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-end pb-10 border-b border-rule">
        <div>
          <span className="editorial-eyebrow">Hakkında</span>
          <h1 className="mt-3 font-display text-display-lg sm:text-display-xl leading-[0.95] tracking-tight">
            Türkiye'nin yapay zekâ
            <br />
            <em className="text-olive">haber merkezi.</em>
          </h1>
          <p className="mt-5 max-w-prose text-base sm:text-lg text-ink-soft leading-relaxed">
            AIGündem, büyük dil modellerinden araçlara, araştırmalardan robotiğe, politikadan etiğe kadar
            yapay zekânın gündemini tek bir yerde toplar. Manuel seçim, otomatik çeviri değil — her
            haber kaynağından bağlamı koruyarak yayınlanır.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-6 sm:gap-10 md:min-w-[320px]">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">Yayın</dt>
            <dd className="mt-1 font-display text-2xl leading-none">Her gün</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">Kaynak</dt>
            <dd className="mt-1 font-display text-2xl leading-none">{KAYNAKLAR.length}+</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">Kategori</dt>
            <dd className="mt-1 font-display text-2xl leading-none">{KATEGORI_LISTESI.length}</dd>
          </div>
        </dl>
      </section>

      {/* Misyon */}
      <section className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12 py-12">
        <span className="editorial-eyebrow">Misyon</span>
        <div className="max-w-prose">
          <p className="font-display text-2xl sm:text-3xl leading-snug tracking-tight">
            Yapay zekâ alanında olan biteni, <em>bağlamıyla</em> ve <em>zamanında</em> Türkçe
            okuyucuya ulaştırmak.
          </p>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Haberler düzinelerce kaynaktan toplanır, manuel olarak sınıflandırılır ve orijinal
            bağlantısı korunarak yayınlanır. Bir konuyu takip etmek istediğinizde, ilgili
            kategorideki tüm geçmiş haberler tek bir zaman çizelgesinde görünür.
          </p>
        </div>
      </section>

      {/* Çalışma ilkeleri */}
      <section className="py-12 border-t border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <span className="editorial-eyebrow">Çalışma ilkeleri</span>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ILKELER.map((ilke, i) => (
              <li key={ilke.baslik} className="border-l-2 border-olive pl-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
                  0{i + 1}
                </span>
                <h3 className="mt-1 font-display text-xl">{ilke.baslik}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{ilke.aciklama}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-12 border-t border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <span className="editorial-eyebrow">Kategoriler</span>
          <div>
            <p className="text-ink-soft leading-relaxed max-w-prose mb-6">
              Her haber tek bir kategori altında yayınlanır. Kategori listesi, okuyucunun ilgisini
              çekebilecek başlıkları tarayabileceği şekilde sınırlı tutulmuştur.
            </p>
            <ul className="flex flex-wrap gap-2">
              {KATEGORI_LISTESI.map((k) => (
                <li key={k.id}>
                  <Link
                    href={`/kategori/${kategoriIdToSlug(k.id)}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-rule rounded-sm font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:bg-ink hover:text-paper hover:border-ink transition-colors"
                  >
                    {k.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Kaynaklar */}
      <section className="py-12 border-t border-rule">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <span className="editorial-eyebrow">Kaynaklar</span>
          <div>
            <p className="text-ink-soft leading-relaxed max-w-prose mb-6">
              AIGündem, aşağıdaki yayınların kamuya açık içeriklerinden derleme yapar. Her haberin
              orijinal kaynağı, detay sayfasında açıkça belirtilir.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 font-mono text-sm">
              {KAYNAKLAR.map((k) => (
                <li key={k.ad}>
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-olive"
                  >
                    {k.ad} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 border border-rule rounded-sm bg-paper-2/40">
        <div className="px-6 sm:px-10 py-10 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="editorial-eyebrow">Bağlantıda kal</span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl tracking-tight">
              Bültene katıl, haftalık özeti kaçırma.
            </h2>
            <p className="mt-2 text-sm text-ink-soft max-w-prose">
              Haftanın en çok okunan haberleri, kaynak bağlantılarıyla birlikte her cuma e-postana
              gelsin. Reklam yok, izleme yok.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/bulten"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 border border-ink bg-ink text-paper rounded-sm hover:bg-paper hover:text-ink transition-colors"
            >
              Bültene Katıl →
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 border border-rule text-ink rounded-sm hover:bg-paper-3 transition-colors"
            >
              İletişim
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
