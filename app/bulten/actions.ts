'use server';

import crypto from 'node:crypto';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { bultenOnayMailiGonder, resendHazirMi } from '@/lib/bulten-mail';

interface BultenPayload {
  email: string;
  isim: string;
  siklik: 'haftalik' | 'aylik';
}

type OnayDurumu = 'beklemede' | 'aktif' | 'iptal';

export type BultenSonuc =
  | { durum: 'ok'; mesaj: string; email: string; mailGonderildi: boolean; fallbackLog?: string }
  | { durum: 'mevcut'; mesaj: string }
  | { durum: 'hata'; mesaj: string; alanlar?: Partial<Record<keyof BultenPayload, string>> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DISPOSABLE_RE = /@(mailinator|10minutemail|tempmail|guerrillamail|trashmail)\./i;

function temizle(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function ilkIpAdresi(forwarded: string | null, real: string | null): string | null {
  const kaynak = forwarded ?? real;
  if (!kaynak) return null;
  return kaynak.split(',')[0].trim().slice(0, 64) || null;
}

function tokenUret(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function bultenSubmit(
  onceki: BultenSonuc | null,
  formData: FormData,
): Promise<BultenSonuc> {
  const email = temizle(formData.get('email'));
  const isim = temizle(formData.get('isim'));
  const siklikRaw = temizle(formData.get('siklik'));
  const siklik: BultenPayload['siklik'] = siklikRaw === 'aylik' ? 'aylik' : 'haftalik';

  // 1) Validate
  const alanlar: Partial<Record<keyof BultenPayload, string>> = {};
  if (!email) alanlar.email = 'E-posta gerekli';
  else if (!EMAIL_RE.test(email)) alanlar.email = 'Geçerli bir e-posta adresi gir';
  else if (DISPOSABLE_RE.test(email)) alanlar.email = 'Tek kullanımlık e-posta kabul edilmiyor';
  else if (email.length > 120) alanlar.email = 'E-posta çok uzun';
  if (isim.length > 80) alanlar.isim = 'İsim 80 karakteri aşamaz';

  if (Object.keys(alanlar).length > 0) {
    return { durum: 'hata', mesaj: 'Lütfen hatalı alanı düzelt.', alanlar };
  }

  // 2) Bağlam
  const basliklar = await headers();
  const ip = ilkIpAdresi(basliklar.get('x-forwarded-for'), basliklar.get('x-real-ip'));
  const userAgent = basliklar.get('user-agent')?.slice(0, 256) ?? null;

  // 3) Var olan abone kontrolü
  const { data: mevcut, error: mevcutErr } = await supabaseAdmin
    .from('bulten_aboneleri')
    .select('id, onay_durumu')
    .eq('email', email)
    .maybeSingle();

  if (mevcutErr) {
    console.error('[bulten] mevcut abone sorgu hatası', mevcutErr);
    return { durum: 'hata', mesaj: 'Şu an işlem yapılamıyor. Birkaç dakika sonra tekrar dene.' };
  }

  if (mevcut && mevcut.onay_durumu === 'aktif') {
    return {
      durum: 'mevcut',
      mesaj: 'Bu e-posta zaten bültenimize kayıtlı. Her cuma seni e-postanda göreceğiz.',
    };
  }

  // 4) Token üret, row insert/update
  const yeniToken = tokenUret();
  const simdi = new Date().toISOString();

  let rowId: string;
  if (mevcut) {
    // beklemede / iptal — token yenile, durumu beklemedeye al
    const { error: updErr } = await supabaseAdmin
      .from('bulten_aboneleri')
      .update({
        isim: isim || null,
        siklik,
        onay_durumu: 'beklemede' satisfies OnayDurumu,
        onay_token: yeniToken,
        ip_adresi: ip,
        user_agent: userAgent,
      })
      .eq('id', mevcut.id);
    if (updErr) {
      console.error('[bulten] update hatası', updErr);
      return { durum: 'hata', mesaj: 'Kayıt güncellenemedi. Birkaç dakika sonra tekrar dene.' };
    }
    rowId = mevcut.id;
  } else {
    const { data: eklenen, error: insErr } = await supabaseAdmin
      .from('bulten_aboneleri')
      .insert({
        email,
        isim: isim || null,
        siklik,
        onay_durumu: 'beklemede' satisfies OnayDurumu,
        onay_token: yeniToken,
        ip_adresi: ip,
        user_agent: userAgent,
      })
      .select('id')
      .single();
    if (insErr || !eklenen) {
      console.error('[bulten] insert hatası', insErr);
      return { durum: 'hata', mesaj: 'Abone kaydı oluşturulamadı. Birkaç dakika sonra tekrar dene.' };
    }
    rowId = eklenen.id;
  }

  console.log('[bulten] abone kaydedildi, onay maili gönderiliyor', {
    rowId,
    email,
    siklik,
    resendHazir: resendHazirMi(),
    zaman: simdi,
  });

  // 5) Onay maili gönder
  const sonuc = await bultenOnayMailiGonder(email, isim || null, yeniToken);

  if (!sonuc.gonderildi && !sonuc.fallbackLog) {
    // Gerçek hata — kullanıcıya bildir ama veritabanı kaydı duruyor
    return {
      durum: 'hata',
      mesaj: `Onay maili gönderilemedi (${sonuc.hata ?? 'bilinmeyen hata'}). Birkaç dakika sonra tekrar dene.`,
    };
  }

  return {
    durum: 'ok',
    email,
    mailGonderildi: sonuc.gonderildi,
    fallbackLog: sonuc.fallbackLog,
    mesaj: sonuc.gonderildi
      ? 'Onay maili gönderildi. E-postandaki bağlantıya tıklayarak aboneliğini aktifleştir.'
      : 'Onay maili gönderilemedi (Resend anahtarı eksik). Konsol çıktısını kontrol et.',
  };
}
