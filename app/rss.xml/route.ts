import { getHaberler } from '@/lib/supabase';
import { kategoriAdi } from '@/lib/kategoriler';
import { tarihFormat } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'AIGündem';

export const dynamic = 'force-dynamic';

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const haberler = await getHaberler({ limit: 30 });

  const items = haberler
    .map(
      (h) => `
    <item>
      <title>${escape(h.baslik)}</title>
      <link>${SITE_URL}/haber/${h.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/haber/${h.slug}</guid>
      <pubDate>${new Date(h.yayin_tarihi).toUTCString()}</pubDate>
      <category>${escape(kategoriAdi(h.kategori as never))}</category>
      <description>${escape(h.ozet)}</description>
      <source url="${h.kaynak_ad}">${escape(h.kaynak_ad)}</source>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Yapay zekanın gündemi, her gün. LLM'ler, araçlar, araştırma, robotik, etik ve politika.</description>
    <language>tr-TR</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
