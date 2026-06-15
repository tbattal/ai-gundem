import Image from 'next/image';
import Link from 'next/link';
import { KategoriEtiketi } from '@/components/ui/KategoriEtiketi';
import { OkunmaSuresi } from '@/components/ui/OkunmaSuresi';
import { tarihGöreceli } from '@/lib/utils';
import type { HaberListItem } from '@/types/haber';

interface Props {
  haber: HaberListItem;
  variant?: 'default' | 'compact' | 'wide';
}

export function HaberKarti({ haber, variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <article className="flex gap-3 py-4 border-b border-rule-soft last:border-b-0">
        <Link href={`/haber/${haber.slug}`} className="shrink-0">
          <div className="relative w-20 h-20 rounded-sm overflow-hidden bg-paper-2">
            <Image
              src={haber.gorsel}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <KategoriEtiketi kategori={haber.kategori} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
              {tarihGöreceli(haber.yayin_tarihi)}
            </span>
          </div>
          <h3 className="font-display text-base leading-snug">
            <Link href={`/haber/${haber.slug}`} className="hover:text-olive transition-colors">
              {haber.baslik}
            </Link>
          </h3>
        </div>
      </article>
    );
  }

  if (variant === 'wide') {
    return (
      <article className="grid grid-cols-1 sm:grid-cols-[1.1fr_2fr] gap-5 py-6 border-b border-rule last:border-b-0">
        <Link href={`/haber/${haber.slug}`} className="block">
          <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-paper-2">
            <Image
              src={haber.gorsel}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              className="object-cover"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <KategoriEtiketi kategori={haber.kategori} />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
              {haber.kaynak_ad} · {tarihGöreceli(haber.yayin_tarihi)}
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight">
            <Link href={`/haber/${haber.slug}`} className="hover:text-olive transition-colors">
              {haber.baslik}
            </Link>
          </h3>
          <p className="mt-3 text-[15px] text-ink-soft leading-relaxed line-clamp-3">
            {haber.ozet}
          </p>
          <div className="mt-auto pt-3">
            <OkunmaSuresi dakika={haber.okuma_suresi} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col group">
      <Link href={`/haber/${haber.slug}`} className="block">
        <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-paper-2">
          <Image
            src={haber.gorsel}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <KategoriEtiketi kategori={haber.kategori} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
            {tarihGöreceli(haber.yayin_tarihi)}
          </span>
        </div>
        <h3 className="font-display text-xl leading-snug tracking-tight">
          <Link href={`/haber/${haber.slug}`} className="hover:text-olive transition-colors">
            {haber.baslik}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3">
          {haber.ozet}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
            {haber.kaynak_ad}
          </span>
          <OkunmaSuresi dakika={haber.okuma_suresi} />
        </div>
      </div>
    </article>
  );
}
