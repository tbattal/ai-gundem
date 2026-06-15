import { HaberListesi } from '@/components/haber/HaberListesi';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { q?: string };
}

export default async function AramaSayfasi({ searchParams }: Props) {
  const q = (searchParams.q ?? '').trim();
  let haberler: Awaited<ReturnType<typeof import('@/lib/supabase').getHaberler>> = [];

  if (q.length >= 2) {
    const { data, error } = await supabase
      .from('haberler')
      .select('id, slug, baslik, ozet, gorsel, kaynak_ad, kategori, etiketler, yayin_tarihi, okuma_suresi, one_cikan')
      .or(`baslik.ilike.%${q}%,ozet.ilike.%${q}%`)
      .order('yayin_tarihi', { ascending: false })
      .limit(40);
    if (error) {
      console.error('[arama]', error.message);
    } else {
      haberler = (data ?? []) as typeof haberler;
    }
  }

  return (
    <div className="container-site py-8 sm:py-12">
      <header className="mb-8">
        <span className="editorial-eyebrow">Arama</span>
        <h1 className="font-display text-display-md tracking-tight mt-2">
          {q ? `“${q}” için sonuçlar` : 'Bir arama terimi gir'}
        </h1>
        {q && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
            {haberler.length} sonuç
          </p>
        )}
      </header>

      <form action="/arama" method="get" className="mb-10 flex items-center gap-2 border border-rule rounded-sm px-4 py-3 bg-paper-3/60 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mute">Ara</span>
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Model, araç, araştırma..."
          className="flex-1 bg-transparent text-base focus:outline-none"
        />
        <button
          type="submit"
          className="font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 bg-ink text-paper rounded-sm hover:bg-olive transition-colors"
        >
          Ara
        </button>
      </form>

      {q ? (
        <HaberListesi haberler={haberler} layout="list" bosMesaj="Aramayla eşleşen haber bulunamadı." />
      ) : (
        <p className="text-ink-soft">Yukarıdaki kutuya en az 2 harf yazıp aramayı başlat.</p>
      )}
    </div>
  );
}
