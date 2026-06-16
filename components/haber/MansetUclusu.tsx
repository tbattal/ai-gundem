import Image from 'next/image';
import Link from 'next/link';
import { KategoriEtiketi } from '@/components/ui/KategoriEtiketi';
import { OkunmaSuresi } from '@/components/ui/OkunmaSuresi';
import { tarihGöreceli } from '@/lib/utils';
import type { HaberListItem } from '@/types/haber';

interface Props {
  mansetler: HaberListItem[];
}

/**
 * 3 manşeti editorial yerleşimde gösterir: 1 büyük (sol) + 2 küçük (sağ, dikey istif).
 * 1-2 manşet gelirse graceful degrade: tek sütun veya tek kart.
 */
export function MansetUclusu({ mansetler }: Props) {
  if (mansetler.length === 0) {
    return (
      <div className="py-16 text-center font-mono text-sm uppercase tracking-wider text-ink-mute border border-dashed border-rule">
        Henüz manşet haber yok. Supabase bağlantısını ve seed verisini kontrol et.
      </div>
    );
  }

  const [birinci, ikinci, ucuncu] = mansetler;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 pb-10 border-b border-rule">
      {birinci && (
        <article className="lg:col-span-3 group">
          <Link href={`/haber/${birinci.slug}`} className="block">
            <div className="relative aspect-[16/10] lg:aspect-[5/4] rounded-sm overflow-hidden bg-paper-2">
              <Image
                src={birinci.gorsel}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 bg-live/95 text-white font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Manşet
                </span>
              </div>
            </div>
          </Link>

          <div className="pt-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <KategoriEtiketi kategori={birinci.kategori} variant="underline" size="md" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
                {birinci.kaynak_ad}
              </span>
            </div>
            <h1 className="font-display text-display-md lg:text-display-lg leading-[1.05] tracking-tight text-ink">
              <Link href={`/haber/${birinci.slug}`} className="hover:text-olive transition-colors">
                {birinci.baslik}
              </Link>
            </h1>
            <p className="mt-4 text-[17px] text-ink-soft leading-relaxed line-clamp-4">
              {birinci.ozet}
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                {tarihGöreceli(birinci.yayin_tarihi)}
              </span>
              <OkunmaSuresi dakika={birinci.okuma_suresi} />
            </div>
          </div>
        </article>
      )}

      {mansetler.length > 1 && (
        <aside className="lg:col-span-2 flex flex-col divide-y divide-rule">
          {[ikinci, ucuncu].filter(Boolean).map((h) => (
            <article key={h.id} className="group py-5 first:pt-0 last:pb-0">
              <Link href={`/haber/${h.slug}`} className="flex gap-4">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-sm overflow-hidden bg-paper-2">
                  <Image
                    src={h.gorsel}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <KategoriEtiketi kategori={h.kategori} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
                      {h.kaynak_ad}
                    </span>
                  </div>
                  <h2 className="font-display text-lg sm:text-xl leading-snug tracking-tight">
                    <Link href={`/haber/${h.slug}`} className="hover:text-olive transition-colors">
                      {h.baslik}
                    </Link>
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-soft leading-relaxed line-clamp-2">
                    {h.ozet}
                  </p>
                  <div className="mt-auto pt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
                    <span>{tarihGöreceli(h.yayin_tarihi)}</span>
                    <OkunmaSuresi dakika={h.okuma_suresi} />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </aside>
      )}
    </div>
  );
}
