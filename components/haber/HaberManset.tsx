import Image from 'next/image';
import Link from 'next/link';
import { KategoriEtiketi } from '@/components/ui/KategoriEtiketi';
import { OkunmaSuresi } from '@/components/ui/OkunmaSuresi';
import { tarihGöreceli } from '@/lib/utils';
import type { HaberListItem } from '@/types/haber';

interface Props {
  haber: HaberListItem;
}

export function HaberManset({ haber }: Props) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 pb-10 border-b border-rule">
      <Link
        href={`/haber/${haber.slug}`}
        className="block lg:col-span-3 group"
      >
        <div className="relative aspect-[16/10] lg:aspect-[5/4] rounded-sm overflow-hidden bg-paper-2">
          <Image
            src={haber.gorsel}
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

      <div className="lg:col-span-2 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-3">
          <KategoriEtiketi kategori={haber.kategori} variant="underline" size="md" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
            {haber.kaynak_ad}
          </span>
        </div>

        <h1 className="font-display text-display-md lg:text-display-lg leading-[1.05] tracking-tight text-ink">
          <Link href={`/haber/${haber.slug}`} className="hover:text-olive transition-colors">
            {haber.baslik}
          </Link>
        </h1>

        <p className="mt-4 text-[17px] text-ink-soft leading-relaxed line-clamp-4">
          {haber.ozet}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <Link
            href={`/haber/${haber.slug}`}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink border-b-2 border-coral pb-1 hover:text-olive hover:border-olive transition-colors"
          >
            Okumaya devam et →
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
            {tarihGöreceli(haber.yayin_tarihi)}
          </span>
          <OkunmaSuresi dakika={haber.okuma_suresi} />
        </div>
      </div>
    </article>
  );
}
