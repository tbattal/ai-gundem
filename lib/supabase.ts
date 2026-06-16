import { createClient } from '@supabase/supabase-js';
import type { Haber, HaberListItem, Kategori } from '@/types/haber';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env değişkenleri eksik: NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY gerekli.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

const SELECT_LISTE = `
  id, slug, baslik, ozet, gorsel,
  kaynak_ad, kategori, etiketler,
  yayin_tarihi, okuma_suresi, one_cikan
`;

const SELECT_DETAY = `
  id, slug, baslik, ozet, icerik, gorsel,
  kaynak_ad, kaynak_url, kaynak_logo, yazar,
  kategori, etiketler, yayin_tarihi, okuma_suresi,
  orijinal_url, one_cikan, created_at, updated_at
`;

export async function getHaberler(opts?: {
  limit?: number;
  kategori?: Kategori;
  oneCikan?: boolean;
}): Promise<HaberListItem[]> {
  let query = supabase
    .from('haberler')
    .select(SELECT_LISTE)
    .order('yayin_tarihi', { ascending: false })
    .limit(opts?.limit ?? 30);

  if (opts?.kategori) {
    query = query.eq('kategori', opts.kategori);
  }
  if (opts?.oneCikan) {
    query = query.eq('one_cikan', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[getHaberler]', error.message);
    return [];
  }
  return (data ?? []) as HaberListItem[];
}

export async function getHaberBySlug(slug: string): Promise<Haber | null> {
  const { data, error } = await supabase
    .from('haberler')
    .select(SELECT_DETAY)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[getHaberBySlug]', error.message);
    return null;
  }
  return (data ?? null) as Haber | null;
}

export async function getManset(): Promise<HaberListItem | null> {
  const { data, error } = await supabase
    .from('haberler')
    .select(SELECT_LISTE)
    .eq('one_cikan', true)
    .order('yayin_tarihi', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[getManset]', error.message);
    return null;
  }
  return (data ?? null) as HaberListItem | null;
}

export async function getMansetler(limit = 3): Promise<HaberListItem[]> {
  const { data, error } = await supabase
    .from('haberler')
    .select(SELECT_LISTE)
    .eq('one_cikan', true)
    .order('yayin_tarihi', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getMansetler]', error.message);
    return [];
  }
  return (data ?? []) as HaberListItem[];
}

export async function getTumSluglar(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase
    .from('haberler')
    .select('slug')
    .order('yayin_tarihi', { ascending: false });

  if (error) {
    console.error('[getTumSluglar]', error.message);
    return [];
  }
  return (data ?? []) as { slug: string }[];
}

export async function getHaberSayisi(kategori?: Kategori): Promise<number> {
  let query = supabase.from('haberler').select('id', { count: 'exact', head: true });
  if (kategori) query = query.eq('kategori', kategori);
  const { count, error } = await query;
  if (error) {
    console.error('[getHaberSayisi]', error.message);
    return 0;
  }
  return count ?? 0;
}
