import type { Kategori } from '@/types/haber';

export interface KategoriInfo {
  id: Kategori;
  ad: string;
  aciklama: string;
  renk: string;
  slug: string;
}

export const KATEGORILER: Record<Kategori, KategoriInfo> = {
  'buyuk-dil-modelleri': {
    id: 'buyuk-dil-modelleri',
    ad: 'Büyük Dil Modelleri',
    aciklama: 'LLM dünyasından son gelişmeler, model karşılaştırmaları, çıkışlar.',
    renk: '#218c00',
    slug: 'llm',
  },
  arastirma: {
    id: 'arastirma',
    ad: 'Araştırma',
    aciklama: 'Yapay zeka alanında öne çıkan makaleler, benchmark sonuçları.',
    renk: '#131313',
    slug: 'arastirma',
  },
  araclar: {
    id: 'araclar',
    ad: 'Araçlar',
    aciklama: 'Yeni çıkan AI araçları, güncellemeler, karşılaştırmalar.',
    renk: '#63fe13',
    slug: 'araclar',
  },
  robotik: {
    id: 'robotik',
    ad: 'Robotik',
    aciklama: 'İnsansı robotlar, otonom sistemler, endüstriyel uygulamalar.',
    renk: '#d6332a',
    slug: 'robotik',
  },
  'politika-etik': {
    id: 'politika-etik',
    ad: 'Politika & Etik',
    aciklama: 'Düzenlemeler, yasalar, etik tartışmalar, toplumsal etki.',
    renk: '#8a8579',
    slug: 'politika',
  },
  'is-dunyasi': {
    id: 'is-dunyasi',
    ad: 'İş Dünyası',
    aciklama: 'Şirket haberleri, yatırımlar, işe alımlar, stratejik hamleler.',
    renk: '#434343',
    slug: 'is-dunyasi',
  },
  'acik-kaynak': {
    id: 'acik-kaynak',
    ad: 'Açık Kaynak',
    aciklama: 'Açık kaynak AI projeleri, modeller, veri setleri.',
    renk: '#555048',
    slug: 'acik-kaynak',
  },
};

export const KATEGORI_LISTESI = Object.values(KATEGORILER);

export function kategoriAdi(id: Kategori): string {
  return KATEGORILER[id]?.ad ?? id;
}

export function kategoriRengi(id: Kategori): string {
  return KATEGORILER[id]?.renk ?? '#131313';
}
