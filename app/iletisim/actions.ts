'use server';

import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyCaptcha } from '@/lib/captcha';

interface IletisimPayload {
  ad: string;
  email: string;
  konu: string;
  mesaj: string;
}

export type IletisimSonuc =
  | { durum: 'ok'; mesaj: string }
  | { durum: 'hata'; mesaj: string; alanlar?: Partial<Record<keyof IletisimPayload, string>>; captchaHatasi?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GECERLI_KONULAR = ['genel', 'basin', 'ipucu', 'isbirligi', 'hata'] as const;

function temizle(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function ilkIpAdresi(forwarded: string | null, real: string | null): string | null {
  const kaynak = forwarded ?? real;
  if (!kaynak) return null;
  return kaynak.split(',')[0].trim().slice(0, 64) || null;
}

export async function iletisimSubmit(
  onceki: IletisimSonuc | null,
  formData: FormData,
): Promise<IletisimSonuc> {
  const ad = temizle(formData.get('ad'));
  const email = temizle(formData.get('email'));
  const konu = temizle(formData.get('konu'));
  const mesaj = temizle(formData.get('mesaj'));
  const captchaCevap = temizle(formData.get('captcha_cevap'));
  const captchaToken = temizle(formData.get('captcha_token'));

  // 1) Captcha doğrula
  if (!captchaCevap || !captchaToken || !verifyCaptcha(captchaCevap, captchaToken)) {
    return {
      durum: 'hata',
      mesaj: 'Doğrulama yanlış. Lütfen soruyu tekrar çöz veya sayfayı yenile.',
      captchaHatasi: true,
    };
  }

  // 2) Form alanlarını doğrula
  const alanlar: Partial<Record<keyof IletisimPayload, string>> = {};
  if (!ad) alanlar.ad = 'İsim gerekli';
  else if (ad.length > 80) alanlar.ad = 'İsim 80 karakteri aşamaz';
  if (!email) alanlar.email = 'E-posta gerekli';
  else if (!EMAIL_RE.test(email)) alanlar.email = 'Geçerli bir e-posta adresi gir';
  if (!konu) alanlar.konu = 'Konu gerekli';
  else if (!GECERLI_KONULAR.includes(konu as (typeof GECERLI_KONULAR)[number])) alanlar.konu = 'Geçersiz konu';
  if (!mesaj) alanlar.mesaj = 'Mesaj gerekli';
  else if (mesaj.length < 10) alanlar.mesaj = 'Mesaj en az 10 karakter olmalı';
  else if (mesaj.length > 4000) alanlar.mesaj = 'Mesaj 4000 karakteri aşamaz';

  if (Object.keys(alanlar).length > 0) {
    return { durum: 'hata', mesaj: 'Lütfen hatalı alanları düzelt.', alanlar };
  }

  // 3) İstek bağlamından ip ve user-agent al
  const basliklar = await headers();
  const ip = ilkIpAdresi(basliklar.get('x-forwarded-for'), basliklar.get('x-real-ip'));
  const userAgent = basliklar.get('user-agent')?.slice(0, 256) ?? null;

  // 4) Veritabanına kaydet
  const { error } = await supabaseAdmin.from('iletisim').insert({
    ad,
    email,
    konu,
    mesaj,
    ip_adresi: ip,
    user_agent: userAgent,
  });

  if (error) {
    console.error('[iletisim] insert hatası', error);
    return {
      durum: 'hata',
      mesaj: 'Mesaj şu an kaydedilemedi. Birkaç dakika sonra tekrar dene.',
    };
  }

  console.log('[iletisim] kaydedildi', { ad, email, konu, mesaj_uzunluk: mesaj.length, ip });

  return {
    durum: 'ok',
    mesaj: 'Mesajın alındı. Genellikle 1-2 iş günü içinde dönüş yapıyoruz.',
  };
}
