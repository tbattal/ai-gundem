import type { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const metadata: Metadata = {
  title: 'Bülten — Onay',
  description: 'AIGündem bülten aboneliğini onayla.',
  alternates: { canonical: '/bulten/onayla' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface SearchParams {
  token?: string;
}

type OnayDurum = 'basarili' | 'zaten' | 'hata';

interface OnayBilgi {
  durum: OnayDurum;
  mesaj: string;
  alt?: string;
}

async function onayla(token: string): Promise<OnayBilgi> {
  if (!token || !/^[0-9a-f]{64}$/.test(token)) {
    return { durum: 'hata', mesaj: 'Onay bağlantısı geçersiz.', alt: 'Bağlantıyı tarayıcıdan tam olarak kopyala.' };
  }

  const { data, error } = await supabaseAdmin
    .from('bulten_aboneleri')
    .select('id, email, onay_durumu')
    .eq('onay_token', token)
    .maybeSingle();

  if (error) {
    console.error('[bulten/onayla] sorgu hatası', error);
    return { durum: 'hata', mesaj: 'Şu an onay yapılamıyor. Birkaç dakika sonra tekrar dene.' };
  }

  if (!data) {
    return {
      durum: 'hata',
      mesaj: 'Bu onay bağlantısı artık geçerli değil.',
      alt: 'Bülten sayfasından yeni bir abonelik isteği gönder.',
    };
  }

  if (data.onay_durumu === 'aktif') {
    return {
      durum: 'zaten',
      mesaj: 'Bu e-posta zaten aktif abone.',
      alt: 'Her cuma e-postanda görüşmek üzere.',
    };
  }

  const { error: updErr } = await supabaseAdmin
    .from('bulten_aboneleri')
    .update({
      onay_durumu: 'aktif',
      onaylanma_tarihi: new Date().toISOString(),
      onay_token: null,
    })
    .eq('id', data.id);

  if (updErr) {
    console.error('[bulten/onayla] update hatası', updErr);
    return { durum: 'hata', mesaj: 'Onay kaydedilemedi. Birkaç dakika sonra tekrar dene.' };
  }

  return {
    durum: 'basarili',
    mesaj: 'Aboneliğin aktifleştirildi.',
    alt: `Her cuma ${data.email} adresine bülten göndereceğiz.`,
  };
}

export default async function BultenOnaylaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sonuc = await onayla(params.token ?? '');

  const baslik =
    sonuc.durum === 'basarili' ? 'Hoş geldin.' : sonuc.durum === 'zaten' ? 'Zaten abone' : 'Bir sorun var';

  const govde =
    sonuc.durum === 'hata'
      ? {
          renk: 'text-live',
          arkaplan: 'bg-paper-2/60 border-rule',
          etiket: 'Onaylanamadı',
        }
      : sonuc.durum === 'zaten'
        ? {
            renk: 'text-ink-soft',
            arkaplan: 'bg-paper-2/60 border-rule',
            etiket: 'Tekrar onay',
          }
        : {
            renk: 'text-olive',
            arkaplan: 'bg-olive-tint/40 border-olive',
            etiket: 'Onaylandı',
          };

  return (
    <div className="container-site py-16 sm:py-24">
      <div className="max-w-xl mx-auto text-center">
        <span className="editorial-eyebrow">Bülten</span>
        <h1 className={`mt-3 font-display text-display-lg sm:text-display-xl leading-[0.95] tracking-tight`}>
          <em className={sonuc.durum === 'basarili' ? 'text-olive' : ''}>{baslik}</em>
        </h1>

        <div className={`mt-8 border rounded-sm px-6 py-7 ${govde.arkaplan}`}>
          <span className={`editorial-eyebrow ${govde.renk}`}>{govde.etiket}</span>
          <p className="mt-3 text-base text-ink leading-relaxed">{sonuc.mesaj}</p>
          {sonuc.alt && <p className="mt-2 text-sm text-ink-soft">{sonuc.alt}</p>}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 border border-ink bg-ink text-paper rounded-sm hover:bg-paper hover:text-ink transition-colors"
          >
            Ana sayfaya dön →
          </Link>
          {sonuc.durum === 'hata' && (
            <Link
              href="/bulten"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 border border-rule text-ink rounded-sm hover:bg-paper-3 transition-colors"
            >
              Bülten sayfası
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
