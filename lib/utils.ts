import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import slugify from 'slugify';

export function slugifyTr(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'tr',
    trim: true,
  });
}

export function tarihFormat(iso: string, pattern = 'd MMM yyyy'): string {
  try {
    return format(parseISO(iso), pattern, { locale: tr });
  } catch {
    return iso;
  }
}

export function tarihGöreceli(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: tr });
  } catch {
    return iso;
  }
}

export function okumaSuresiLabel(dakika: number): string {
  if (dakika < 1) return '1 dakika okuma';
  return `${dakika} dakika okuma`;
}

export function kategoriSlugToId(slug: string): string | null {
  const map: Record<string, string> = {
    llm: 'buyuk-dil-modelleri',
    'buyuk-dil-modelleri': 'buyuk-dil-modelleri',
    arastirma: 'arastirma',
    araclar: 'araclar',
    robotik: 'robotik',
    politika: 'politika-etik',
    'politika-etik': 'politika-etik',
    'is-dunyasi': 'is-dunyasi',
    'acik-kaynak': 'acik-kaynak',
  };
  return map[slug] ?? null;
}

export function kategoriIdToSlug(id: string): string {
  const map: Record<string, string> = {
    'buyuk-dil-modelleri': 'llm',
    arastirma: 'arastirma',
    araclar: 'araclar',
    robotik: 'robotik',
    'politika-etik': 'politika',
    'is-dunyasi': 'is-dunyasi',
    'acik-kaynak': 'acik-kaynak',
  };
  return map[id] ?? id;
}
