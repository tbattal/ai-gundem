'use client';

interface Props {
  url: string;
  baslik: string;
}

export function PaylasimButonlari({ url, baslik }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(baslik);

  return (
    <div className="flex items-center gap-2 text-xs">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer noopener"
        className="px-3 py-1.5 border border-rule rounded-sm font-mono uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer noopener"
        className="px-3 py-1.5 border border-rule rounded-sm font-mono uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={() => {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(url);
          }
        }}
        className="px-3 py-1.5 border border-rule rounded-sm font-mono uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
      >
        Bağlantı
      </button>
    </div>
  );
}
