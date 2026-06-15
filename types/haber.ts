export type Kategori =
  | 'buyuk-dil-modelleri'
  | 'arastirma'
  | 'araclar'
  | 'robotik'
  | 'politika-etik'
  | 'is-dunyasi'
  | 'acik-kaynak';

export interface Kaynak {
  ad: string;
  url: string;
  logo?: string;
}

export interface Haber {
  id: string;
  slug: string;
  baslik: string;
  ozet: string;
  icerik?: string | null;
  gorsel: string;
  kaynak_ad: string;
  kaynak_url: string;
  kaynak_logo?: string | null;
  yazar?: string | null;
  kategori: Kategori;
  etiketler: string[];
  yayin_tarihi: string;
  okuma_suresi: number;
  orijinal_url: string;
  one_cikan?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HaberListItem {
  id: string;
  slug: string;
  baslik: string;
  ozet: string;
  gorsel: string;
  kaynak_ad: string;
  kategori: Kategori;
  etiketler: string[];
  yayin_tarihi: string;
  okuma_suresi: number;
  one_cikan?: boolean;
}
