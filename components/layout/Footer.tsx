import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-rule bg-paper-2/40">
      <div className="container-site py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <span className="block font-display text-2xl tracking-tight">
            AI<em>Gündem</em>
          </span>
          <p className="mt-3 text-sm text-ink-soft max-w-prose leading-relaxed">
            Türkiye&apos;nin yapay zekâ haber merkezi. LLM&apos;ler, araçlar, araştırma, robotik, etik ve
            politika — her gün güncellenen, kaynak gösterilen haberler.
          </p>
        </div>

        <div>
          <span className="editorial-eyebrow">Kategoriler</span>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link className="link-olive" href="/kategori/llm">Büyük Dil Modelleri</Link></li>
            <li><Link className="link-olive" href="/kategori/araclar">Araçlar</Link></li>
            <li><Link className="link-olive" href="/kategori/arastirma">Araştırma</Link></li>
            <li><Link className="link-olive" href="/kategori/robotik">Robotik</Link></li>
            <li><Link className="link-olive" href="/kategori/politika">Politika &amp; Etik</Link></li>
          </ul>
        </div>

        <div>
          <span className="editorial-eyebrow">AIGündem</span>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link className="link-olive" href="/hakkinda">Hakkında</Link></li>
            <li><Link className="link-olive" href="/iletisim">İletişim</Link></li>
            <li><Link className="link-olive" href="/bulten">Bülten</Link></li>
            <li><Link className="link-olive" href="/rss.xml">RSS</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          <span>© {new Date().getFullYear()} AIGündem · Türkiye</span>
          <span>Kaynak gösterilmeden alıntılanamaz.</span>
        </div>
      </div>
    </footer>
  );
}
