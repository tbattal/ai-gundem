import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HaberListesi } from '@/components/haber/HaberListesi';
import { KATEGORILER } from '@/lib/kategoriler';
import { getHaberler } from '@/lib/supabase';
import { kategoriSlugToId } from '@/lib/utils';
import type { Kategori } from '@/types/haber';

export const revalidate = 1800; // 30 dakika

interface Props {
  params: { kategori: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = kategoriSlugToId(params.kategori) as Kategori | null;
  if (!id) return { title: 'Kategori bulunamadı' };
  const info = KATEGORILER[id];
  return {
    title: `${info.ad} haberleri`,
    description: info.aciklama,
    alternates: { canonical: `/kategori/${params.kategori}` },
  };
}

export default async function KategoriSayfasi({ params }: Props) {
  const kategoriId = kategoriSlugToId(params.kategori) as Kategori | null;
  if (!kategoriId) notFound();

  const info = KATEGORILER[kategoriId];
  const haberler = await getHaberler({ kategori: kategoriId, limit: 30 });

  return (
    <div className="container-site py-8 sm:py-12">
      <header
        className="mb-10 pb-8 border-b border-rule"
        style={{ borderBottomColor: info.renk, borderBottomWidth: 3 }}
      >
        <span className="editorial-eyebrow">Kategori</span>
        <h1 className="font-display text-display-lg leading-[1.05] tracking-tight mt-2">
          {info.ad}
        </h1>
        <p className="mt-3 text-lg text-ink-soft max-w-prose leading-relaxed">
          {info.aciklama}
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
          {haberler.length} haber
        </p>
      </header>

      <HaberListesi
        haberler={haberler}
        layout="list"
        bosMesaj="Bu kategoride henüz haber yok."
      />
    </div>
  );
}
