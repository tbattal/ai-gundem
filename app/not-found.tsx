import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-site py-24 text-center">
      <span className="editorial-eyebrow">404</span>
      <h1 className="font-display text-display-lg mt-3">Sayfa bulunamadı</h1>
      <p className="mt-4 text-ink-soft max-w-prose mx-auto">
        Aradığın sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2 bg-ink text-paper rounded-sm hover:bg-olive transition-colors"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
