import Link from 'next/link';
import { KATEGORI_LISTESI } from '@/lib/kategoriler';
import { kategoriIdToSlug } from '@/lib/utils';

export function Header() {
  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <header className="site-header bg-paper/95 backdrop-blur border-b border-rule sticky top-0 z-50">
      <div className="container-site">
        <div className="flex items-center justify-between py-3 border-b border-rule-soft font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <span className="text-ink capitalize">{today}</span>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="live-dot" />
              Canlı
            </span>
            <Link href="/hakkinda" className="hover:text-olive">Hakkında</Link>
            <Link href="/iletisim" className="hover:text-olive">İletişim</Link>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span
              className="w-9 h-9 grid place-items-center rounded-sm font-display italic text-xl"
              style={{ background: '#131313', color: '#63fe13' }}
              aria-hidden
            >
              A
            </span>
            <span>
              <span className="block font-display text-2xl sm:text-3xl leading-none tracking-tight">
                AI<em>Gündem</em>
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft mt-1">
                Yapay zekanın gündemi · Her gün
              </span>
            </span>
          </Link>

          <form
            action="/arama"
            method="get"
            className="hidden md:flex items-center gap-2 border border-rule rounded-sm px-3 py-2 bg-paper-3/60"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mute">Ara</span>
            <input
              name="q"
              type="search"
              placeholder="Model, araç, araştırma..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
            <span className="font-mono text-[11px] text-ink-mute">⏎</span>
          </form>

          <Link
            href="/bulten"
            className="hidden lg:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-2 border border-ink rounded-sm hover:bg-ink hover:text-paper transition-colors"
          >
            Bültene Katıl →
          </Link>
        </div>

        <nav className="border-t border-rule-soft">
          <ul className="flex items-center gap-1 sm:gap-3 overflow-x-auto py-2.5 -mx-1 px-1 font-mono text-[11px] uppercase tracking-[0.14em]">
            <li>
              <Link href="/" className="px-2 py-1 hover:text-olive whitespace-nowrap">
                Ana Sayfa
              </Link>
            </li>
            {KATEGORI_LISTESI.map((k) => (
              <li key={k.id}>
                <Link
                  href={`/kategori/${kategoriIdToSlug(k.id)}`}
                  className="px-2 py-1 text-ink-soft hover:text-ink whitespace-nowrap"
                >
                  {k.ad}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
