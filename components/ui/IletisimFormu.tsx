'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { iletisimSubmit, type IletisimSonuc } from '@/app/iletisim/actions';
import { useRef, useEffect } from 'react';

const BASLANGIC: IletisimSonuc | null = null;

function GonderButonu() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 border border-ink bg-ink text-paper rounded-sm hover:bg-paper hover:text-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Gönderiliyor…' : 'Mesajı Gönder →'}
    </button>
  );
}

interface Props {
  captchaProblem: string;
  captchaToken: string;
}

export function IletisimFormu({ captchaProblem, captchaToken }: Props) {
  const [sonuc, formAction] = useFormState(iletisimSubmit, BASLANGIC);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (sonuc?.durum === 'ok' && formRef.current) {
      formRef.current.reset();
    }
  }, [sonuc]);

  if (sonuc?.durum === 'ok') {
    return (
      <div className="border border-olive bg-olive-tint/40 rounded-sm px-6 py-8 text-center">
        <span className="editorial-eyebrow text-olive">Alındı</span>
        <h3 className="mt-2 font-display text-2xl tracking-tight">Teşekkürler.</h3>
        <p className="mt-2 text-sm text-ink-soft max-w-prose mx-auto">{sonuc.mesaj}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-ink underline-offset-4 hover:underline"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  const hatalar = sonuc?.durum === 'hata' ? sonuc.alanlar ?? {} : {};
  const captchaHatasi = sonuc?.durum === 'hata' && sonuc.captchaHatasi === true;

  const inputBase =
    'w-full bg-paper-3 border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-ink transition-colors';
  const inputError = 'border-live focus:border-live';

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ad" className="editorial-eyebrow block mb-1.5">
            İsim
          </label>
          <input
            id="ad"
            name="ad"
            type="text"
            required
            maxLength={80}
            className={`${inputBase} ${hatalar.ad ? inputError : ''}`}
            placeholder="Adın Soyadın"
          />
          {hatalar.ad && <p className="mt-1 text-xs text-live">{hatalar.ad}</p>}
        </div>
        <div>
          <label htmlFor="email" className="editorial-eyebrow block mb-1.5">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={120}
            className={`${inputBase} ${hatalar.email ? inputError : ''}`}
            placeholder="ornek@alan.com"
          />
          {hatalar.email && <p className="mt-1 text-xs text-live">{hatalar.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="konu" className="editorial-eyebrow block mb-1.5">
          Konu
        </label>
        <select
          id="konu"
          name="konu"
          required
          defaultValue=""
          className={`${inputBase} ${hatalar.konu ? inputError : ''}`}
        >
          <option value="" disabled>
            Seç…
          </option>
          <option value="genel">Genel</option>
          <option value="basin">Basın / Medya</option>
          <option value="ipucu">İpucu / Haber Önerisi</option>
          <option value="isbirligi">İş Birliği / Sponsorluk</option>
          <option value="hata">Hata / Düzeltme Bildirimi</option>
        </select>
        {hatalar.konu && <p className="mt-1 text-xs text-live">{hatalar.konu}</p>}
      </div>

      <div>
        <label htmlFor="mesaj" className="editorial-eyebrow block mb-1.5">
          Mesaj
        </label>
        <textarea
          id="mesaj"
          name="mesaj"
          required
          rows={6}
          maxLength={4000}
          className={`${inputBase} resize-y leading-relaxed ${hatalar.mesaj ? inputError : ''}`}
          placeholder="Mesajın… En az 10 karakter."
        />
        {hatalar.mesaj && <p className="mt-1 text-xs text-live">{hatalar.mesaj}</p>}
      </div>

      <div>
        <label htmlFor="captcha_cevap" className="editorial-eyebrow block mb-1.5">
          Doğrulama
        </label>
        <div className="flex items-stretch gap-2">
          <span
            aria-hidden
            className="inline-flex items-center px-3 border border-rule rounded-sm bg-paper-2 font-mono text-sm text-ink whitespace-nowrap"
          >
            {captchaProblem.replace(' = ?', '')}&nbsp;=&nbsp;
          </span>
          <input
            id="captcha_cevap"
            name="captcha_cevap"
            type="text"
            inputMode="numeric"
            required
            maxLength={3}
            pattern="-?\d{1,2}"
            className={`${inputBase} flex-1 ${captchaHatasi ? inputError : ''}`}
            placeholder="?"
          />
        </div>
        <input type="hidden" name="captcha_token" value={captchaToken} />
        {captchaHatasi ? (
          <p className="mt-1 text-xs text-live">
            {sonuc.mesaj}{' '}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="underline underline-offset-2 hover:text-ink"
            >
              Yenile
            </button>
          </p>
        ) : (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
            İşlemi yapan kişi olduğunu doğrula
          </p>
        )}
      </div>

      {sonuc?.durum === 'hata' && !captchaHatasi && !Object.keys(hatalar).length && (
        <p className="text-sm text-live">{sonuc.mesaj}</p>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
          1-2 iş günü içinde dönüş
        </p>
        <GonderButonu />
      </div>
    </form>
  );
}
