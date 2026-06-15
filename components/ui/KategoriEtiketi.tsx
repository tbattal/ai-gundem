import { KATEGORILER, kategoriAdi, kategoriRengi } from '@/lib/kategoriler';
import type { Kategori } from '@/types/haber';

interface Props {
  kategori: Kategori;
  size?: 'sm' | 'md';
  variant?: 'solid' | 'ghost' | 'underline';
}

export function KategoriEtiketi({ kategori, size = 'sm', variant = 'ghost' }: Props) {
  const info = KATEGORILER[kategori];
  const ad = info?.ad ?? kategoriAdi(kategori);
  const renk = info?.renk ?? kategoriRengi(kategori);

  const sizeCls = size === 'md' ? 'text-xs px-2.5 py-1' : 'text-[10px] px-2 py-0.5';
  const base = `inline-flex items-center font-mono uppercase tracking-[0.14em] ${sizeCls}`;

  if (variant === 'solid') {
    return (
      <span
        className={base}
        style={{ backgroundColor: renk, color: renk === '#63fe13' ? '#131313' : '#fff' }}
      >
        {ad}
      </span>
    );
  }
  if (variant === 'underline') {
    return (
      <span className={`${base} text-ink pb-0.5`} style={{ borderBottom: `2px solid ${renk}` }}>
        {ad}
      </span>
    );
  }
  return (
    <span className={`${base} text-ink-soft border border-rule rounded-sm bg-paper-3/60`}>
      {ad}
    </span>
  );
}
