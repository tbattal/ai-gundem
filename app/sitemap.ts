import type { MetadataRoute } from 'next';
import { getTumSluglar } from '@/lib/supabase';
import { KATEGORI_LISTESI } from '@/lib/kategoriler';
import { kategoriIdToSlug } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sluglar = await getTumSluglar();
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'hourly', priority: 1.0 },
    ...KATEGORI_LISTESI.map((k) => ({
      url: `${SITE_URL}/kategori/${kategoriIdToSlug(k.id)}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
    ...sluglar.map((s) => ({
      url: `${SITE_URL}/haber/${s.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ];
}
