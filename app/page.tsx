import Link from 'next/link';
import { HaberManset } from '@/components/haber/HaberManset';
import { HaberListesi } from '@/components/haber/HaberListesi';
import { KATEGORI_LISTESI } from '@/lib/kategoriler';
import { getHaberler, getManset } from '@/lib/supabase';
import { kategoriIdToSlug } from '@/lib/utils';

export const revalidate = 1800; // 30 dakika

export default async function AnaSayfa() {
  const [manset, haberler] = await Promise.all([
    getManset(),
    getHaberler({ limit: 13 }),
  ]);

  const mansettenSonraki = manset
    ? haberler.filter((h) => h.id !== manset.id).slice(0, 12)
    : haberler.slice(0, 12);

  return (
    <div className="container-site py-8 sm:py-10">
      {/* Manşet */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="editorial-eyebrow">Bugünün Manşeti</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute hidden sm:inline">
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
          </span>
        </div>
        {manset ? (
          <HaberManset haber={manset} />
        ) : (
          <div className="py-16 text-center font-mono text-sm uppercase tracking-wider text-ink-mute border border-dashed border-rule">
            Henüz manşet haber yok. Supabase bağlantısını ve seed verisini kontrol et.
          </div>
        )}
      </section>

      {/* Kategori kısayolları */}
      <nav aria-label="Kategoriler" className="mb-12 border-y border-rule py-4">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]">
          <li className="text-ink-mute">Kategoriler:</li>
          {KATEGORI_LISTESI.map((k) => (
            <li key={k.id}>
              <Link
                href={`/kategori/${kategoriIdToSlug(k.id)}`}
                className="text-ink-soft hover:text-olive transition-colors"
              >
                {k.ad}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Son haberler */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-display-md tracking-tight">Son Haberler</h2>
          <Link
            href="/arsiv"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft hover:text-ink"
          >
            Tüm arşiv →
          </Link>
        </div>
        <HaberListesi haberler={mansettenSonraki} layout="grid" />
      </section>
    </div>
  );
}
