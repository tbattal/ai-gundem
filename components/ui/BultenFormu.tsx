'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { bultenSubmit, type BultenSonuc } from '@/app/bulten/actions';
import { useRef, useEffect, useState } from 'react';

const BASLANGIC: BultenSonuc | null = null;

function GonderButonu() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-5 py-3 border border-ink bg-ink text-paper rounded-sm hover:bg-paper hover:text-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {pending ? 'Ekleniyor…' : 'Abone Ol →'}
    </button>
  );
}

interface Props {
  varyant?: 'genis' | 'satir-ici';
}

export function BultenFormu({ varyant = 'genis' }: Props) {
  const [sonuc, formAction] = useFormState(bultenSubmit, BASLANGIC);
  const formRef = useRef<HTMLFormElement>(null);
  const [siklik, setSiklik] = useState<'haftalik' | 'aylik'>('haftalik');

  useEffect(() => {
    if (sonuc?.durum === 'ok' && formRef.current) {
      formRef.current.reset();
      setSiklik('haftalik');
    }
  }, [sonuc]);

  if (sonuc?.durum === 'ok') {
    return (
      <div className="border border-olive bg-olive-tint/40 rounded-sm px-6 py-7 text-left">
        <span className="editorial-eyebrow text-olive">Onay gönderildi</span>
        <h3 className="mt-2 font-display text-2xl tracking-tight">E-postanı kontrol et.</h3>
        <p className="mt-2 text-sm text-ink-soft max-w-prose">
          <span className="font-mono text-ink">{sonuc.email}</span> adresine bir onay bağlantısı
          gönderdik. {sonuc.mesaj}
        </p>
        {sonuc.fallbackLog && (
          <p className="mt-3 text-xs text-live border-l-2 border-live pl-3 font-mono">
            Geliştirici notu: {sonuc.fallbackLog}
          </p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-ink underline-offset-4 hover:underline"
        >
          Başka bir adresle abone ol
        </button>
      </div>
    );
  }

  if (sonuc?.durum === 'mevcut') {
    return (
      <div className="border border-rule bg-paper-2/60 rounded-sm px-6 py-7 text-left">
        <span className="editorial-eyebrow">Zaten abone</span>
        <h3 className="mt-2 font-display text-2xl tracking-tight">Seni tanıyoruz.</h3>
        <p className="mt-2 text-sm text-ink-soft max-w-prose">{sonuc.mesaj}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-ink underline-offset-4 hover:underline"
        >
          Başka bir adresle abone ol
        </button>
      </div>
    );
  }

  const hatalar = sonuc?.durum === 'hata' ? sonuc.alanlar ?? {} : {};
  const inputBase =
    'w-full bg-paper-3 border border-rule rounded-sm px-3 py-3 text-sm focus:outline-none focus:border-ink transition-colors';
  const inputError = 'border-live focus:border-live';

  if (varyant === 'satir-ici') {
    return (
      <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-2">
        <input type="hidden" name="siklik" value={siklik} />
        <label htmlFor="email-inline" className="sr-only">
          E-posta
        </label>
        <input
          id="email-inline"
          name="email"
          type="email"
          required
          maxLength={120}
          placeholder="ornek@alan.com"
          className={`${inputBase} flex-1 ${hatalar.email ? inputError : ''}`}
        />
        <GonderButonu />
        {hatalar.email && <p className="basis-full text-xs text-live sm:mt-1">{hatalar.email}</p>}
      </form>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>
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
          placeholder="ornek@alan.com"
          className={`${inputBase} ${hatalar.email ? inputError : ''}`}
        />
        {hatalar.email && <p className="mt-1 text-xs text-live">{hatalar.email}</p>}
      </div>

      <div>
        <label htmlFor="isim" className="editorial-eyebrow block mb-1.5">
          İsim <span className="text-ink-mute normal-case tracking-normal">(opsiyonel)</span>
        </label>
        <input
          id="isim"
          name="isim"
          type="text"
          maxLength={80}
          placeholder="Adın"
          className={`${inputBase} ${hatalar.isim ? inputError : ''}`}
        />
        {hatalar.isim && <p className="mt-1 text-xs text-live">{hatalar.isim}</p>}
      </div>

      <fieldset>
        <legend className="editorial-eyebrow mb-2">Sıklık</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['haftalik', 'aylik'] as const).map((secenek) => {
            const aktif = siklik === secenek;
            return (
              <label
                key={secenek}
                className={`cursor-pointer border rounded-sm px-3 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                  aktif
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule bg-paper-3 text-ink-soft hover:border-ink'
                }`}
              >
                <input
                  type="radio"
                  name="siklik"
                  value={secenek}
                  checked={aktif}
                  onChange={() => setSiklik(secenek)}
                  className="sr-only"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                  {secenek === 'haftalik' ? 'Cuma' : 'Ay başı'}
                </span>
                <span>{secenek === 'haftalik' ? 'Her hafta' : 'Ayda bir özet'}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between pt-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
          İstediğin an çıkarsın
        </p>
        <GonderButonu />
      </div>
    </form>
  );
}
