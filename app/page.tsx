import Link from 'next/link';
import { MansetUclusu } from '@/components/haber/MansetUclusu';
import { HaberListesi } from '@/components/haber/HaberListesi';
import { KATEGORI_LISTESI } from '@/lib/kategoriler';
import { getHaberler, getMansetler } from '@/lib/supabase';
import { kategoriIdToSlug } from '@/lib/utils';

export const revalidate = 1800; // 30 dakika

export default async function AnaSayfa() {
  const [mansetler, haberler] = await Promise.all([
    getMansetler(3),
    getHaberler({ limit: 16 }),
  ]);

  const mansetIdSeti = new Set(mansetler.map((m) => m.id));
  const mansettenSonraki = mansetler.length > 0
    ? haberler.filter((h) => !mansetIdSeti.has(h.id)).slice(0, 12)
    : haberler.slice(0, 12);

  return (
    <div className="container-site py-8 sm:py-10">
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="editorial-eyebrow">Bugünün Manşetleri</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute hidden sm:inline">
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
          </span>
        </div>
        <MansetUclusu mansetler={mansetler} />
      </section>

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
