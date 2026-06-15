import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { KategoriEtiketi } from '@/components/ui/KategoriEtiketi';
import { OkunmaSuresi } from '@/components/ui/OkunmaSuresi';
import { PaylasimButonlari } from '@/components/ui/PaylasimButonlari';
import { HaberKarti } from '@/components/haber/HaberKarti';
import { getHaberBySlug, getHaberler, getTumSluglar } from '@/lib/supabase';
import { kategoriIdToSlug, tarihFormat } from '@/lib/utils';

export const revalidate = 3600; // 1 saat
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getTumSluglar();
  return slugs.slice(0, 200).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const haber = await getHaberBySlug(params.slug);
  if (!haber) return { title: 'Haber bulunamadı' };

  return {
    title: haber.baslik,
    description: haber.ozet,
    alternates: { canonical: `/haber/${haber.slug}` },
    openGraph: {
      type: 'article',
      title: haber.baslik,
      description: haber.ozet,
      images: [haber.gorsel],
      publishedTime: haber.yayin_tarihi,
    },
  };
}

export default async function HaberDetay({ params }: { params: { slug: string } }) {
  const haber = await getHaberBySlug(params.slug);
  if (!haber) notFound();

  const ilgili = (await getHaberler({ kategori: haber.kategori, limit: 4 }))
    .filter((h) => h.id !== haber.id)
    .slice(0, 3);

  return (
    <article className="container-site py-8 sm:py-12 max-w-[920px]">
      <nav className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        <Link href="/" className="hover:text-olive">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/kategori/${kategoriIdToSlug(haber.kategori)}`}
          className="hover:text-olive"
        >
          {haber.kategori}
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <KategoriEtiketi kategori={haber.kategori} variant="underline" size="md" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
            {haber.kaynak_ad} · {tarihFormat(haber.yayin_tarihi)}
          </span>
        </div>

        <h1 className="font-display text-display-lg leading-[1.05] tracking-tight text-ink">
          {haber.baslik}
        </h1>

        <p className="mt-5 text-xl text-ink-soft leading-relaxed max-w-prose">
          {haber.ozet}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-mute">
          {haber.yazar && <span><strong className="text-ink font-medium">{haber.yazar}</strong> tarafından</span>}
          <OkunmaSuresi dakika={haber.okuma_suresi} />
        </div>
      </header>

      <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-paper-2 mb-10">
        <Image
          src={haber.gorsel}
          alt=""
          fill
          priority
          sizes="(max-width: 920px) 100vw, 920px"
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-10">
        <div className="prose prose-lg max-w-prose">
          {haber.icerik ? (
            <div
              className="text-[17px] leading-[1.75] text-ink whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: haber.icerik }}
            />
          ) : (
            <p className="text-[17px] leading-[1.75] text-ink-soft italic">
              Bu haber için tam metin henüz eklenmedi. Aşağıdaki butondan kaynak siteye ulaşabilirsin.
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={haber.orijinal_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 bg-ink text-paper rounded-sm hover:bg-olive transition-colors"
            >
              Kaynak: {haber.kaynak_ad} ↗
            </a>
            <PaylasimButonlari
              url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/haber/${haber.slug}`}
              baslik={haber.baslik}
            />
          </div>
        </div>

        <aside className="space-y-6">
          {haber.etiketler.length > 0 && (
            <div>
              <span className="editorial-eyebrow">Etiketler</span>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {haber.etiketler.map((t) => (
                  <li key={t}>
                    <span className="inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-rule rounded-sm">
                      #{t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ilgili.length > 0 && (
            <div>
              <span className="editorial-eyebrow">İlgili Haberler</span>
              <div className="mt-3 divide-y divide-rule-soft border-t border-rule-soft">
                {ilgili.map((h) => (
                  <HaberKarti key={h.id} haber={h} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
