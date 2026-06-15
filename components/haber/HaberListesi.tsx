import { HaberKarti } from './HaberKarti';
import type { HaberListItem } from '@/types/haber';

interface Props {
  haberler: HaberListItem[];
  layout?: 'grid' | 'list';
  bosMesaj?: string;
}

export function HaberListesi({ haberler, layout = 'grid', bosMesaj }: Props) {
  if (haberler.length === 0) {
    return (
      <div className="py-12 text-center font-mono text-sm uppercase tracking-wider text-ink-mute">
        {bosMesaj ?? 'Henüz haber yok.'}
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="divide-y divide-rule-soft">
        {haberler.map((h) => (
          <HaberKarti key={h.id} haber={h} variant="wide" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {haberler.map((h) => (
        <HaberKarti key={h.id} haber={h} />
      ))}
    </div>
  );
}
